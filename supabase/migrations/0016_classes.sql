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
create type public.class_format as enum ('in_person', 'online', 'hybrid');
create type public.class_level  as enum ('beginner', 'intermediate', 'advanced', 'elite');

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
create type public.enrollment_state as enum ('active', 'paused', 'completed', 'withdrawn');

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
create type public.session_state as enum ('scheduled', 'in_progress', 'completed', 'cancelled');

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
