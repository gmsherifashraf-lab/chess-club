-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║  COMBINED MIGRATION — paste this whole file into the Supabase SQL Editor.  ║
-- ║                                                                           ║
-- ║  Contains migrations 0013 → 0019, in dependency order:                     ║
-- ║    0013  ratings_history          (rating_events, snapshots, peaks)        ║
-- ║    0014  notifications            (templates, feed, deliveries, prefs)     ║
-- ║    0015  notification_emitters    (notify on submission graded)            ║
-- ║    0016  classes                  (classes, enrollments, sessions)         ║
-- ║    0017  classroom                (live board/chat/hand + analytics)       ║
-- ║    0018  attendance_session_scope (per-session attendance rows)            ║
-- ║    0019  realtime                 (notifications + rating_events publish)   ║
-- ║                                                                           ║
-- ║  PRECONDITION: migrations 0001–0012 must already be applied (they define   ║
-- ║  set_updated_at(), is_admin(), is_coach(), is_editor(), is_player(),       ║
-- ║  coaches_player(), is_parent_of_roster(), and the base tables).            ║
-- ║                                                                           ║
-- ║  Everything below is idempotent — safe to run more than once. Run it once  ║
-- ║  in the Supabase Dashboard → SQL Editor → New query → paste → Run.         ║
-- ║  Live classroom additionally needs LiveKit keys set in the app env.        ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝


-- ═══════════════════════════════════════════════════════════════════════════
-- ▼▼▼  0013_ratings_history.sql  ▼▼▼
-- ═══════════════════════════════════════════════════════════════════════════

-- =============================================================================
-- 0013_ratings_history.sql
-- Time-series rating data per player per rating kind.
-- `players.rating` (0001) stays as the canonical "current FIDE classical"
-- field used by the roster table; this migration adds:
--   - rating_kind enum
--   - rating_events: immutable journal of rating changes (with source link)
--   - rating_snapshots / rating_peaks views
--   - record_rating_event() helper (admin or the player's coach)
--
-- Adapted from the sibling platform (its 0017). The Egypt schema linked
-- rating_events.attempt_id -> assessment_attempts; that table does not exist
-- in this project yet, so the attempt link is omitted here.
-- =============================================================================

do $$ begin
  create type public.rating_kind as enum (
    'fide_classical',
    'fide_rapid',
    'fide_blitz',
    'national',          -- UAE Chess Federation / national rating
    'club_internal',     -- the club's own internal rating
    'lichess_classical',
    'lichess_rapid',
    'lichess_blitz',
    'chesscom_rapid',
    'chesscom_blitz'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.rating_source as enum (
    'tournament',
    'assessment',
    'admin_adjust',
    'external_sync',     -- pulled from lichess/chesscom/FIDE feed
    'manual_entry'
  );
exception when duplicate_object then null;
end $$;

-- ── 1. Immutable journal of rating changes ───────────────────────────────────
create table if not exists public.rating_events (
  id              uuid        primary key default gen_random_uuid(),
  player_id       uuid        not null references public.players(id)     on delete cascade,
  kind            public.rating_kind   not null,
  rating_before   int         check (rating_before is null or rating_before between 0 and 4000),
  rating_after    int         not null check (rating_after between 0 and 4000),
  delta           int         generated always as (rating_after - coalesce(rating_before, rating_after)) stored,
  source          public.rating_source not null,
  source_ref      jsonb       not null default '{}'::jsonb,  -- e.g. {"tournament_id":"…"}
  tournament_id   uuid                 references public.tournaments(id) on delete set null,
  reason          text,
  effective_on    date        not null default current_date,
  recorded_by     uuid                 references auth.users(id) on delete set null,
  recorded_at     timestamptz not null default now()
);

create index if not exists rating_events_player_kind_date_idx
  on public.rating_events (player_id, kind, effective_on desc);

create index if not exists rating_events_kind_date_idx
  on public.rating_events (kind, effective_on desc);

create index if not exists rating_events_tournament_idx
  on public.rating_events (tournament_id);

-- ── 2. Latest snapshot per (player, kind) — as a view ────────────────────────
create or replace view public.rating_snapshots as
  select distinct on (player_id, kind)
         player_id,
         kind,
         rating_after as rating,
         effective_on,
         source,
         delta
    from public.rating_events
   order by player_id, kind, effective_on desc, recorded_at desc;

grant select on public.rating_snapshots to authenticated;

-- Peak rating per (player, kind) — useful for player profile pages.
create or replace view public.rating_peaks as
  select player_id, kind, max(rating_after) as peak_rating
    from public.rating_events
   group by player_id, kind;

grant select on public.rating_peaks to authenticated;

-- ── 3. Helper function: record a rating change ───────────────────────────────
-- Captures the "before" rating from the most-recent prior event automatically,
-- so callers only need to specify the new value and source.
create or replace function public.record_rating_event(
  p_player_id    uuid,
  p_kind         public.rating_kind,
  p_rating_after int,
  p_source       public.rating_source,
  p_reason       text default null,
  p_tournament   uuid default null,
  p_source_ref   jsonb default '{}'::jsonb,
  p_effective_on date default current_date
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_before int;
  v_id     uuid;
begin
  -- Caller authorisation: admins always, coaches if they coach the player.
  if not (public.is_admin() or (public.is_coach() and public.coaches_player(p_player_id))) then
    raise exception 'rating: not authorised to record an event for this player';
  end if;

  select rating_after
    into v_before
    from public.rating_events
   where player_id = p_player_id and kind = p_kind
   order by effective_on desc, recorded_at desc
   limit 1;

  insert into public.rating_events
    (player_id, kind, rating_before, rating_after,
     source, reason, tournament_id, source_ref,
     effective_on, recorded_by)
  values
    (p_player_id, p_kind, v_before, p_rating_after,
     p_source, p_reason, p_tournament, p_source_ref,
     p_effective_on, auth.uid())
  returning id into v_id;

  -- Keep the legacy players.rating column in sync ONLY for the canonical kind.
  if p_kind = 'fide_classical' then
    update public.players set rating = p_rating_after where id = p_player_id;
  end if;

  return v_id;
end;
$$;

grant execute on function public.record_rating_event(uuid, public.rating_kind, int, public.rating_source, text, uuid, jsonb, date)
  to authenticated;

-- ── 4. RLS ───────────────────────────────────────────────────────────────────
alter table public.rating_events enable row level security;

drop policy if exists "rating_events: admin all"    on public.rating_events;
drop policy if exists "rating_events: coach reads"  on public.rating_events;
drop policy if exists "rating_events: player reads" on public.rating_events;
drop policy if exists "rating_events: parent reads" on public.rating_events;

create policy "rating_events: admin all" on public.rating_events
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "rating_events: coach reads" on public.rating_events
  for select to authenticated using (public.is_coach() and public.coaches_player(player_id));

create policy "rating_events: player reads" on public.rating_events
  for select to authenticated
  using (player_id in (select p.id from public.players p where p.profile_id = auth.uid()));

create policy "rating_events: parent reads" on public.rating_events
  for select to authenticated using (public.is_parent_of_roster(player_id));


-- ═══════════════════════════════════════════════════════════════════════════
-- ▼▼▼  0014_notifications.sql  ▼▼▼
-- ═══════════════════════════════════════════════════════════════════════════

-- =============================================================================
-- 0014_notifications.sql
-- Notification system: template-driven, multi-channel, realtime-friendly.
--
-- Layers:
--   notification_templates   — canonical message keys with default copy + channels
--   notifications            — one row per recipient (the in-app feed source)
--   notification_deliveries  — per-channel delivery attempts (email, push, in_app)
--   notification_preferences — per-user channel opt-out
--
-- Writes flow through public.notify() (security definer); the in-app bell reads
-- public.notifications filtered to recipient_id = auth.uid() and marks rows read
-- via public.mark_notification_read(). Adapted from the sibling platform (0018).
-- =============================================================================

do $$ begin
  create type public.notification_channel as enum ('in_app', 'email', 'push', 'sms');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type public.notification_priority as enum ('low', 'normal', 'high', 'critical');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type public.delivery_status as enum ('pending', 'queued', 'sent', 'failed', 'skipped', 'bounced');
exception when duplicate_object then null;
end $$;

-- ── 1. Templates ─────────────────────────────────────────────────────────────
create table if not exists public.notification_templates (
  key             text         primary key,                 -- 'assignment.assigned', 'tournament.starting'
  title_template  text         not null,                    -- supports {{var}}
  body_template   text         not null,
  default_channels public.notification_channel[] not null default '{in_app}',
  default_priority public.notification_priority  not null default 'normal',
  description     text,
  is_system       boolean      not null default false,      -- system templates can't be deleted via UI
  created_at      timestamptz  not null default now(),
  updated_at      timestamptz  not null default now()
);

drop trigger if exists set_updated_at_notification_templates on public.notification_templates;
create trigger set_updated_at_notification_templates
  before update on public.notification_templates
  for each row execute function public.set_updated_at();

-- ── 2. Notifications (the in-app feed item) ──────────────────────────────────
create table if not exists public.notifications (
  id            uuid        primary key default gen_random_uuid(),
  recipient_id  uuid        not null references auth.users(id) on delete cascade,
  template_key  text                 references public.notification_templates(key) on delete set null,
  title         text        not null,
  body          text,
  data          jsonb       not null default '{}'::jsonb,    -- {task_id, tournament_id, …}
  category      text,                                         -- 'assignment' | 'tournament' | 'system' | …
  priority      public.notification_priority not null default 'normal',
  link          text,                                         -- in-app deep link
  read_at       timestamptz,
  archived_at   timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists notifications_recipient_created_idx
  on public.notifications (recipient_id, created_at desc);

create index if not exists notifications_recipient_unread_idx
  on public.notifications (recipient_id) where read_at is null;

create index if not exists notifications_category_idx on public.notifications (category);
create index if not exists notifications_data_gin     on public.notifications using gin (data);

-- ── 3. Per-channel delivery attempts ─────────────────────────────────────────
create table if not exists public.notification_deliveries (
  id              uuid        primary key default gen_random_uuid(),
  notification_id uuid        not null references public.notifications(id) on delete cascade,
  channel         public.notification_channel not null,
  status          public.delivery_status not null default 'pending',
  provider_id     text,
  attempt_count   int         not null default 0,
  last_error      text,
  scheduled_for   timestamptz,
  sent_at         timestamptz,
  failed_at       timestamptz,
  created_at      timestamptz not null default now(),
  unique (notification_id, channel)
);

create index if not exists deliveries_status_idx    on public.notification_deliveries (status);
create index if not exists deliveries_scheduled_idx on public.notification_deliveries (scheduled_for) where status in ('pending', 'queued');

-- ── 4. Per-user channel preferences (opt-outs) ───────────────────────────────
create table if not exists public.notification_preferences (
  user_id   uuid        not null references auth.users(id) on delete cascade,
  category  text        not null,                            -- matches notifications.category
  channel   public.notification_channel not null,
  enabled   boolean     not null default true,
  updated_at timestamptz not null default now(),
  primary key (user_id, category, channel)
);

drop trigger if exists set_updated_at_notification_preferences on public.notification_preferences;
create trigger set_updated_at_notification_preferences
  before update on public.notification_preferences
  for each row execute function public.set_updated_at();

-- ── 5. Helper: emit a notification (creates row + queues deliveries) ─────────
create or replace function public.notify(
  p_recipient    uuid,
  p_template_key text,
  p_title        text,
  p_body         text default null,
  p_data         jsonb default '{}'::jsonb,
  p_category     text default null,
  p_priority     public.notification_priority default 'normal',
  p_link         text default null,
  p_channels     public.notification_channel[] default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id       uuid;
  v_channels public.notification_channel[];
  c          public.notification_channel;
  v_enabled  boolean;
begin
  insert into public.notifications
    (recipient_id, template_key, title, body, data, category, priority, link)
  values
    (p_recipient, p_template_key, p_title, p_body, p_data, p_category, p_priority, p_link)
  returning id into v_id;

  -- Resolve effective channel list (explicit > template default > in_app).
  if p_channels is not null then
    v_channels := p_channels;
  else
    select default_channels into v_channels
      from public.notification_templates where key = p_template_key;
    if v_channels is null then v_channels := '{in_app}'::public.notification_channel[]; end if;
  end if;

  -- Queue per-channel deliveries, honouring per-user opt-outs by category.
  foreach c in array v_channels loop
    v_enabled := true;
    if p_category is not null then
      select enabled into v_enabled
        from public.notification_preferences
       where user_id = p_recipient and category = p_category and channel = c;
      v_enabled := coalesce(v_enabled, true);
    end if;

    insert into public.notification_deliveries (notification_id, channel, status, scheduled_for)
    values (v_id, c, case when v_enabled then 'pending' else 'skipped' end, now());
  end loop;

  return v_id;
end;
$$;

grant execute on function public.notify(uuid, text, text, text, jsonb, text, public.notification_priority, text, public.notification_channel[])
  to authenticated;

-- Helper: mark a notification read (caller-scoped).
create or replace function public.mark_notification_read(p_id uuid)
returns void
language sql
security definer
set search_path = public, pg_temp
as $$
  update public.notifications
     set read_at = coalesce(read_at, now())
   where id = p_id and recipient_id = auth.uid();
$$;

grant execute on function public.mark_notification_read(uuid) to authenticated;

-- ── 6. RLS ───────────────────────────────────────────────────────────────────
alter table public.notification_templates    enable row level security;
alter table public.notifications             enable row level security;
alter table public.notification_deliveries   enable row level security;
alter table public.notification_preferences  enable row level security;

-- Templates: readable by any authenticated user (so UIs can render),
-- writable by admin/editor.
drop policy if exists "templates: read"        on public.notification_templates;
drop policy if exists "templates: admin write" on public.notification_templates;
create policy "templates: read"        on public.notification_templates for select to authenticated using (true);
create policy "templates: admin write" on public.notification_templates for all    to authenticated using (public.is_admin() or public.is_editor()) with check (public.is_admin() or public.is_editor());

-- Notifications: recipient reads/marks-read; admin all. Writes happen through
-- public.notify() (security definer) so we don't expose direct insert.
drop policy if exists "notifications: admin all"         on public.notifications;
drop policy if exists "notifications: recipient reads"   on public.notifications;
drop policy if exists "notifications: recipient updates" on public.notifications;

create policy "notifications: admin all" on public.notifications
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "notifications: recipient reads" on public.notifications
  for select to authenticated using (recipient_id = auth.uid());

create policy "notifications: recipient updates" on public.notifications
  for update to authenticated
  using  (recipient_id = auth.uid())
  with check (recipient_id = auth.uid());

-- Deliveries: admin only (workers use service role).
drop policy if exists "deliveries: admin all"       on public.notification_deliveries;
drop policy if exists "deliveries: recipient reads" on public.notification_deliveries;
create policy "deliveries: admin all" on public.notification_deliveries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "deliveries: recipient reads" on public.notification_deliveries
  for select to authenticated
  using (exists (select 1 from public.notifications n where n.id = notification_deliveries.notification_id and n.recipient_id = auth.uid()));

-- Preferences: user manages own; admin can see all.
drop policy if exists "prefs: admin all"        on public.notification_preferences;
drop policy if exists "prefs: user manages own" on public.notification_preferences;
create policy "prefs: admin all" on public.notification_preferences
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "prefs: user manages own" on public.notification_preferences
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ── 7. System templates seed (coaching scope) ────────────────────────────────
insert into public.notification_templates (key, title_template, body_template, default_channels, default_priority, description, is_system) values
  ('assignment.assigned', 'New task: {{title}}',                'You have a new task due {{due_at}}. Open the dashboard to begin.', '{in_app,email}', 'normal', 'Sent when a coach assigns work to a player.', true),
  ('assignment.due_soon', 'Task due in {{hours}}h',             '"{{title}}" is due {{due_at}}.',                                   '{in_app,email}', 'high',   'Reminder before a task due date.', true),
  ('assignment.graded',   'Task reviewed: {{title}}',           'Your coach reviewed "{{title}}". Open to see feedback.',           '{in_app,email}', 'normal', 'Sent after a coach grades a submission.', true),
  ('class.session_today', 'Class today at {{time}}',            '"{{class_title}}" starts {{time}}.',                               '{in_app,push}',  'normal', 'Same-day reminder for an enrolled class.', true),
  ('tournament.starting', 'Tournament starts in {{hours}}h',    'Round 1 of {{name}} starts {{starts_at}}.',                        '{in_app,email,push}', 'high', 'Pre-tournament reminder.', true),
  ('rating.changed',      'Rating updated: {{kind}} {{delta}}', 'Your {{kind}} rating is now {{rating}} ({{delta}}).',              '{in_app}',       'low',    'After a rating event is recorded.', true)
on conflict (key) do nothing;


-- ═══════════════════════════════════════════════════════════════════════════
-- ▼▼▼  0015_notification_emitters.sql  ▼▼▼
-- ═══════════════════════════════════════════════════════════════════════════

-- =============================================================================
-- 0015_notification_emitters.sql
-- First real caller of public.notify(): when a coach grades a submission
-- (reviewed_at transitions NULL -> set), the player gets an in-app notification.
--
-- This proves the notification system end-to-end. Add further emitters
-- (task assigned, tournament starting, rating changed) on the same pattern.
-- Depends on 0014_notifications.sql.
-- =============================================================================

create or replace function public.tg_notify_submission_graded()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_title text;
begin
  -- Fire only on the NULL -> set transition of reviewed_at (the grading event).
  if old.reviewed_at is not null or new.reviewed_at is null then
    return new;
  end if;

  select title into v_title from public.tasks where id = new.task_id;

  perform public.notify(
    p_recipient    => new.player_id,
    p_template_key => 'assignment.graded',
    p_title        => 'Task reviewed: ' || coalesce(v_title, 'your task'),
    p_body         => case
                        when new.score is not null
                          then 'Your coach reviewed it — score ' || new.score || '/100. Open to see feedback.'
                        else 'Your coach left feedback. Open to see it.'
                      end,
    p_data         => jsonb_build_object('task_id', new.task_id, 'submission_id', new.id),
    p_category     => 'assignment',
    p_priority     => 'normal',
    p_link         => '/dashboard/player'
  );

  return new;
exception
  -- Never let a notification failure block the grading write.
  when others then
    return new;
end;
$$;

drop trigger if exists notify_submission_graded on public.submissions;
create trigger notify_submission_graded
  after update on public.submissions
  for each row execute function public.tg_notify_submission_graded();


-- ═══════════════════════════════════════════════════════════════════════════
-- ▼▼▼  0016_classes.sql  ▼▼▼
-- ═══════════════════════════════════════════════════════════════════════════

-- =============================================================================
-- 0016_classes.sql
-- Recurring classes (courses) and their concrete dated sessions. The existing
-- attendance(player_id, date) gets an optional session_id link so we can move
-- to session-bound attendance without a destructive rewrite.
--
-- This is a single-location club, so there is no "branches" concept — classes
-- belong directly to the club and to a primary coach.
-- =============================================================================

-- ── 1. Class definitions (recurring courses) ─────────────────────────────────
do $$ begin
  create type public.class_format as enum ('in_person', 'online', 'hybrid');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type public.class_level as enum ('beginner', 'intermediate', 'advanced', 'elite');
exception when duplicate_object then null;
end $$;

create table if not exists public.classes (
  id                uuid        primary key default gen_random_uuid(),
  primary_coach_id  uuid                 references public.coaches(id)     on delete set null,
  title             text        not null,
  description       text,
  format            public.class_format  not null default 'in_person',
  level             public.class_level,
  capacity          int         check (capacity is null or capacity between 1 and 200),
  weekly_schedule   jsonb,                   -- e.g. [{"day":"Mon","start":"17:00","end":"18:30"}]
  starts_on         date,
  ends_on           date,
  fee_minor         int         check (fee_minor is null or fee_minor >= 0),
  currency          text        not null default 'AED',
  is_active         boolean     not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists classes_coach_idx  on public.classes (primary_coach_id);
create index if not exists classes_active_idx on public.classes (is_active);
create index if not exists classes_level_idx  on public.classes (level);

drop trigger if exists set_updated_at_classes on public.classes;
create trigger set_updated_at_classes
  before update on public.classes
  for each row execute function public.set_updated_at();

-- ── 2. Class enrollment (which player is in which class) ─────────────────────
do $$ begin
  create type public.enrollment_state as enum ('active', 'paused', 'completed', 'withdrawn');
exception when duplicate_object then null;
end $$;

create table if not exists public.class_enrollments (
  id           uuid        primary key default gen_random_uuid(),
  class_id     uuid        not null references public.classes(id)  on delete cascade,
  player_id    uuid        not null references public.players(id)  on delete cascade,
  state        public.enrollment_state not null default 'active',
  enrolled_at  timestamptz not null default now(),
  ended_at     timestamptz,
  unique (class_id, player_id)
);

create index if not exists class_enrollments_player_idx on public.class_enrollments (player_id);
create index if not exists class_enrollments_class_idx  on public.class_enrollments (class_id);
create index if not exists class_enrollments_state_idx  on public.class_enrollments (state);

-- ── 3. Class sessions (concrete dated occurrence) ────────────────────────────
do $$ begin
  create type public.session_state as enum ('scheduled', 'in_progress', 'completed', 'cancelled');
exception when duplicate_object then null;
end $$;

create table if not exists public.class_sessions (
  id           uuid        primary key default gen_random_uuid(),
  class_id     uuid        not null references public.classes(id) on delete cascade,
  starts_at    timestamptz not null,
  ends_at      timestamptz not null,
  state        public.session_state not null default 'scheduled',
  notes        text,
  coach_id     uuid                 references public.coaches(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists class_sessions_class_starts_idx on public.class_sessions (class_id, starts_at desc);
create index if not exists class_sessions_starts_idx       on public.class_sessions (starts_at);
create index if not exists class_sessions_state_idx        on public.class_sessions (state);

drop trigger if exists set_updated_at_class_sessions on public.class_sessions;
create trigger set_updated_at_class_sessions
  before update on public.class_sessions
  for each row execute function public.set_updated_at();

-- ── 4. Bridge legacy attendance to sessions (additive, nullable) ─────────────
alter table public.attendance
  add column if not exists session_id uuid references public.class_sessions(id) on delete set null;

create index if not exists attendance_session_idx on public.attendance (session_id);

-- ── 5. RLS ───────────────────────────────────────────────────────────────────
alter table public.classes           enable row level security;
alter table public.class_enrollments enable row level security;
alter table public.class_sessions    enable row level security;

-- Classes: public read of active classes (programs grid on marketing site).
drop policy if exists "classes: public read active" on public.classes;
drop policy if exists "classes: admin writes"       on public.classes;
drop policy if exists "classes: coach reads own"    on public.classes;
create policy "classes: public read active" on public.classes for select to anon, authenticated using (is_active = true);
create policy "classes: admin writes"       on public.classes for all    to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "classes: coach reads own"    on public.classes for select to authenticated using (
  public.is_coach() and primary_coach_id in (select c.id from public.coaches c where c.user_id = auth.uid())
);

-- Class enrollments: admin all; coach reads enrollments for their classes;
-- player reads own; parent reads child enrollments.
drop policy if exists "class_enrollments: admin all"          on public.class_enrollments;
drop policy if exists "class_enrollments: coach reads class"  on public.class_enrollments;
drop policy if exists "class_enrollments: player reads own"   on public.class_enrollments;
drop policy if exists "class_enrollments: parent reads child" on public.class_enrollments;

create policy "class_enrollments: admin all" on public.class_enrollments
  for all to authenticated
  using  (public.is_admin())
  with check (public.is_admin());

create policy "class_enrollments: coach reads class" on public.class_enrollments
  for select to authenticated
  using (public.is_coach() and public.coaches_player(player_id));

create policy "class_enrollments: player reads own" on public.class_enrollments
  for select to authenticated
  using (player_id in (select p.id from public.players p where p.profile_id = auth.uid()));

create policy "class_enrollments: parent reads child" on public.class_enrollments
  for select to authenticated
  using (public.is_parent_of_roster(player_id));

-- Class sessions: admin all; coach reads/writes sessions for classes they
-- coach; players + parents read sessions for classes the player is enrolled in.
drop policy if exists "class_sessions: admin all"          on public.class_sessions;
drop policy if exists "class_sessions: coach writes own"   on public.class_sessions;
drop policy if exists "class_sessions: player reads"       on public.class_sessions;
drop policy if exists "class_sessions: parent reads child" on public.class_sessions;

create policy "class_sessions: admin all" on public.class_sessions
  for all to authenticated
  using  (public.is_admin())
  with check (public.is_admin());

create policy "class_sessions: coach writes own" on public.class_sessions
  for all to authenticated
  using  (public.is_coach() and coach_id in (select c.id from public.coaches c where c.user_id = auth.uid()))
  with check (public.is_coach() and coach_id in (select c.id from public.coaches c where c.user_id = auth.uid()));

create policy "class_sessions: player reads" on public.class_sessions
  for select to authenticated
  using (
    public.is_player() and exists (
      select 1
        from public.class_enrollments ce
        join public.players p on p.id = ce.player_id
       where ce.class_id = class_sessions.class_id
         and p.profile_id = auth.uid()
    )
  );

create policy "class_sessions: parent reads child" on public.class_sessions
  for select to authenticated
  using (
    exists (
      select 1
        from public.class_enrollments ce
       where ce.class_id = class_sessions.class_id
         and public.is_parent_of_roster(ce.player_id)
    )
  );

-- ── 6. Helper view: latest scheduled session per class ───────────────────────
create or replace view public.next_class_session as
  select distinct on (class_id)
         id as session_id, class_id, starts_at, ends_at, coach_id
    from public.class_sessions
   where state in ('scheduled', 'in_progress')
   order by class_id, starts_at;

grant select on public.next_class_session to anon, authenticated;


-- ═══════════════════════════════════════════════════════════════════════════
-- ▼▼▼  0017_classroom.sql  ▼▼▼
-- ═══════════════════════════════════════════════════════════════════════════

-- =============================================================================
-- 0017_classroom.sql
-- Live classroom: shared board state, chat persistence, raise-hand events,
-- presence snapshots, and a session_analytics view that powers post-class
-- summary cards on the coach / admin dashboards.
--
-- LiveKit handles the WebRTC plane; this migration only persists what the
-- realtime broadcast channel needs to replay or aggregate after the session.
-- Recording is intentionally NOT modeled — academy policy is no recordings.
-- =============================================================================

-- ── 1. Shared board state ───────────────────────────────────────────────────
-- Snapshot of the live board the coach + students are looking at. One row
-- per "lift" (coach moves a piece on the shared board); we keep history so
-- a student joining mid-session can catch up to the current position.
create table if not exists public.session_board_states (
  id           uuid        primary key default gen_random_uuid(),
  session_id   uuid        not null references public.class_sessions(id) on delete cascade,
  fen          text        not null,
  last_move    text,                                                   -- e.g. "e2e4" — for arrow rendering
  ply          int         not null default 0,
  pushed_by    uuid                 references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now()
);

create index if not exists session_board_states_session_idx
  on public.session_board_states (session_id, created_at desc);

-- ── 2. Chat persistence (broadcast also fires for live feel) ────────────────
do $$ begin
  create type public.classroom_chat_kind as enum ('message', 'reaction', 'system');
exception when duplicate_object then null;
end $$;

create table if not exists public.session_chat_messages (
  id           uuid        primary key default gen_random_uuid(),
  session_id   uuid        not null references public.class_sessions(id) on delete cascade,
  author_id    uuid                 references public.profiles(id) on delete set null,
  author_name  text        not null,
  kind         public.classroom_chat_kind not null default 'message',
  body         text        not null check (length(body) between 1 and 2000),
  created_at   timestamptz not null default now()
);

create index if not exists session_chat_session_idx
  on public.session_chat_messages (session_id, created_at);

-- ── 3. Raise-hand events ────────────────────────────────────────────────────
-- The live UI tracks raised hands via presence metadata for instant feedback.
-- This table is the audit trail: when did each student raise + when answered.
create table if not exists public.raise_hand_events (
  id            uuid        primary key default gen_random_uuid(),
  session_id    uuid        not null references public.class_sessions(id) on delete cascade,
  student_id    uuid        not null references public.profiles(id) on delete cascade,
  raised_at     timestamptz not null default now(),
  answered_at   timestamptz,
  answered_by   uuid                 references public.profiles(id) on delete set null
);

create index if not exists raise_hand_session_idx
  on public.raise_hand_events (session_id, raised_at desc);
create index if not exists raise_hand_unanswered_idx
  on public.raise_hand_events (session_id) where answered_at is null;

-- ── 4. Attendance snapshot helper ───────────────────────────────────────────
-- The presence channel computes attendance live; the /api/classroom/.../attendance
-- route writes a final row to public.attendance(session_id, player_id, ...) on
-- session end. We reuse the legacy attendance table (from 0001) via the
-- session_id bridge added in 0016, so no new table is needed here — but we add
-- two columns to capture engagement quality:
do $$
begin
  if exists (select 1 from information_schema.tables
              where table_schema = 'public' and table_name = 'attendance')
  then
    begin
      alter table public.attendance
        add column if not exists joined_at        timestamptz,
        add column if not exists left_at          timestamptz,
        add column if not exists active_seconds   int default 0,
        add column if not exists hand_raises      int default 0;
    exception when others then null;
    end;
  end if;
end $$;

-- ── 5. Session analytics view ───────────────────────────────────────────────
-- One row per class_session with counts the dashboards render.
create or replace view public.session_analytics as
  select
    cs.id                                                                      as session_id,
    cs.class_id,
    cs.starts_at,
    cs.ends_at,
    cs.state,
    coalesce((select count(*) from public.attendance a
              where a.session_id = cs.id), 0)::int                             as attendees,
    coalesce((select avg(a.active_seconds) from public.attendance a
              where a.session_id = cs.id and a.active_seconds > 0), 0)::int    as avg_active_seconds,
    coalesce((select count(*) from public.raise_hand_events r
              where r.session_id = cs.id), 0)::int                             as raise_hand_count,
    coalesce((select count(*) from public.session_chat_messages m
              where m.session_id = cs.id and m.kind = 'message'), 0)::int      as chat_message_count,
    coalesce((select max(ply) from public.session_board_states b
              where b.session_id = cs.id), 0)::int                             as board_ply_count
  from public.class_sessions cs;

grant select on public.session_analytics to authenticated;

-- ── 6. Realtime publication ─────────────────────────────────────────────────
-- The board/chat/hand events all need to flow to subscribers in the room.
do $$
declare t text;
begin
  foreach t in array array[
    'public.session_board_states',
    'public.session_chat_messages',
    'public.raise_hand_events'
  ] loop
    begin
      execute format('alter publication supabase_realtime add table %s', t);
    exception
      when duplicate_object then null;
      when undefined_object then null;
      when undefined_table  then null;
    end;
  end loop;
end $$;

-- ── 7. RLS ──────────────────────────────────────────────────────────────────
alter table public.session_board_states  enable row level security;
alter table public.session_chat_messages enable row level security;
alter table public.raise_hand_events     enable row level security;

-- Helper: is the caller a participant of this session (admin, the assigned
-- coach, or an enrolled player)?
create or replace function public.is_session_participant(s_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_admin()
    or exists (
      select 1 from public.class_sessions cs
       where cs.id = s_id
         and cs.coach_id in (select c.id from public.coaches c where c.user_id = auth.uid())
    )
    or exists (
      select 1
        from public.class_sessions cs
        join public.class_enrollments ce on ce.class_id = cs.class_id
        join public.players p            on p.id = ce.player_id
       where cs.id = s_id
         and p.profile_id = auth.uid()
         and ce.state = 'active'
    );
$$;

grant execute on function public.is_session_participant(uuid) to authenticated;

-- session_board_states: any participant reads, only coach + admin write.
drop policy if exists "board_states: participant reads" on public.session_board_states;
drop policy if exists "board_states: coach writes"      on public.session_board_states;
create policy "board_states: participant reads" on public.session_board_states
  for select to authenticated using (public.is_session_participant(session_id));
create policy "board_states: coach writes" on public.session_board_states
  for insert to authenticated with check (
    public.is_admin() or exists (
      select 1 from public.class_sessions cs
       where cs.id = session_id
         and cs.coach_id in (select c.id from public.coaches c where c.user_id = auth.uid())
    )
  );

-- session_chat_messages: participants read + write.
drop policy if exists "chat: participant reads"  on public.session_chat_messages;
drop policy if exists "chat: participant writes" on public.session_chat_messages;
create policy "chat: participant reads" on public.session_chat_messages
  for select to authenticated using (public.is_session_participant(session_id));
create policy "chat: participant writes" on public.session_chat_messages
  for insert to authenticated with check (
    public.is_session_participant(session_id)
    and (author_id is null or author_id = auth.uid())
  );

-- raise_hand_events: students raise their own, coach + admin can answer.
drop policy if exists "hand: own insert"      on public.raise_hand_events;
drop policy if exists "hand: participant read" on public.raise_hand_events;
drop policy if exists "hand: coach answers"   on public.raise_hand_events;
create policy "hand: own insert" on public.raise_hand_events
  for insert to authenticated
  with check (
    student_id = auth.uid() and public.is_session_participant(session_id)
  );
create policy "hand: participant read" on public.raise_hand_events
  for select to authenticated
  using (public.is_session_participant(session_id));
create policy "hand: coach answers" on public.raise_hand_events
  for update to authenticated
  using (
    public.is_admin() or exists (
      select 1 from public.class_sessions cs
       where cs.id = session_id
         and cs.coach_id in (select c.id from public.coaches c where c.user_id = auth.uid())
    )
  );


-- ═══════════════════════════════════════════════════════════════════════════
-- ▼▼▼  0018_attendance_session_scope.sql  ▼▼▼
-- ═══════════════════════════════════════════════════════════════════════════

-- =============================================================================
-- 0018_attendance_session_scope.sql
-- Make attendance session-scoped. The legacy primary key (player_id, date) from
-- 0001 allowed only ONE attendance row per player per day, so a player attending
-- two class sessions on the same day had the second join overwrite the first
-- (and session_analytics, which counts by session_id, under-reported).
--
-- This migration is additive and non-destructive:
--   • adds a surrogate `id` primary key (existing rows keep their data),
--   • enforces one row per (player_id, session_id) for session-bound rows,
--   • preserves the legacy one-row-per-day rule for rows with no session_id.
-- Idempotent — safe to re-run.
-- =============================================================================

do $$
begin
  if exists (
    select 1 from information_schema.tables
     where table_schema = 'public' and table_name = 'attendance'
  ) then
    -- Surrogate id; existing rows are backfilled by the default.
    alter table public.attendance
      add column if not exists id uuid not null default gen_random_uuid();

    -- Drop the legacy composite primary key (player_id, date) if still present.
    if exists (
      select 1 from information_schema.table_constraints
       where table_schema = 'public' and table_name = 'attendance'
         and constraint_type = 'PRIMARY KEY' and constraint_name = 'attendance_pkey'
    ) then
      alter table public.attendance drop constraint attendance_pkey;
    end if;

    -- New surrogate primary key.
    if not exists (
      select 1 from information_schema.table_constraints
       where table_schema = 'public' and table_name = 'attendance'
         and constraint_type = 'PRIMARY KEY' and constraint_name = 'attendance_pkey'
    ) then
      alter table public.attendance add constraint attendance_pkey primary key (id);
    end if;
  end if;
end $$;

-- One row per (player, session) for session-bound attendance. A regular (not
-- partial) unique index so it can serve as the upsert ON CONFLICT target; NULL
-- session_ids remain distinct in Postgres, so legacy daily rows are unaffected.
create unique index if not exists attendance_player_session_uniq
  on public.attendance (player_id, session_id);

-- Preserve the legacy one-row-per-day rule for non-session (NULL session_id) rows.
create unique index if not exists attendance_player_date_legacy_uniq
  on public.attendance (player_id, date) where session_id is null;


-- ═══════════════════════════════════════════════════════════════════════════
-- ▼▼▼  0019_realtime.sql  ▼▼▼
-- ═══════════════════════════════════════════════════════════════════════════

-- =============================================================================
-- 0019_realtime.sql
-- Add the realtime-driven tables to the supabase_realtime publication so the
-- in-app notification bell (postgres_changes on notifications, recipient-scoped)
-- and rating charts update live. The classroom tables are added in 0017.
-- Wrapped so it is idempotent and never fails if the publication is missing.
-- =============================================================================

do $$
declare t text;
begin
  foreach t in array array[
    'public.notifications',
    'public.rating_events'
  ] loop
    begin
      execute format('alter publication supabase_realtime add table %s', t);
    exception
      when duplicate_object then null;   -- already in the publication
      when undefined_object then null;   -- supabase_realtime publication absent
      when undefined_table  then null;   -- table not created yet
    end;
  end loop;
end $$;

-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║  END — migrations 0013 → 0019 applied.                                     ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝
