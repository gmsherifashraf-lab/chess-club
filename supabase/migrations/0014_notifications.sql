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

create type public.notification_channel as enum ('in_app', 'email', 'push', 'sms');
create type public.notification_priority as enum ('low', 'normal', 'high', 'critical');
create type public.delivery_status      as enum ('pending', 'queued', 'sent', 'failed', 'skipped', 'bounced');

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
