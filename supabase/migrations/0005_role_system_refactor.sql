-- =============================================================
-- Role-system refactor — admin / coach / player only
--
-- This migration replaces the old role system (admin/coach/parent/board).
-- It drops the legacy `user_roles` table, the `board_members` table,
-- and the role helper functions, then rebuilds the role infrastructure
-- around a single `profiles` table that mirrors `auth.users` and adds
-- the new `tasks` and `submissions` tables for the coach↔player
-- workflow.
--
-- DESTRUCTIVE for role state and board_members. Run AFTER 0001–0004.
-- Existing players / coaches / tournaments / participations /
-- attendance / news / enrollments / coach_assignments are preserved.
-- =============================================================

-- ───────────────────────────────────────────────────────────────
-- 1. Drop legacy role infrastructure
-- ───────────────────────────────────────────────────────────────
drop trigger if exists on_user_role_changed on public.user_roles;
drop trigger if exists on_auth_user_created on auth.users;

-- Drop functions that reference the old enum so we can re-create
-- the enum cleanly (cascade removes RLS policies that depend on them;
-- we recreate all of those further down).
drop function if exists public.sync_role_to_metadata()      cascade;
drop function if exists public.handle_new_user()            cascade;
drop function if exists public.is_admin()                   cascade;
drop function if exists public.is_coach()                   cascade;
drop function if exists public.has_role(public.app_role)    cascade;

drop table if exists public.user_roles    cascade;
drop table if exists public.board_members cascade;

drop type if exists public.app_role cascade;

-- ───────────────────────────────────────────────────────────────
-- 2. New role enum
-- ───────────────────────────────────────────────────────────────
create type public.app_role as enum ('admin', 'coach', 'player');

-- ───────────────────────────────────────────────────────────────
-- 3. profiles (single source of truth for role + display info)
-- ───────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid             primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  role        public.app_role  not null default 'player',
  avatar_url  text,
  bio         text,
  created_at  timestamptz      not null default now(),
  updated_at  timestamptz      not null default now()
);

create index profiles_role_idx on public.profiles (role);

-- Updated-at trigger reuses the helper from 0003
drop trigger if exists set_updated_at_profiles on public.profiles;
create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ───────────────────────────────────────────────────────────────
-- 4. tasks (coach → player work assignments)
-- ───────────────────────────────────────────────────────────────
create table public.tasks (
  id              uuid        primary key default gen_random_uuid(),
  title           text        not null,
  description     text,
  due_date        date,
  attachment_url  text,
  created_by      uuid        not null references auth.users(id) on delete restrict,
  assigned_to     uuid                 references auth.users(id) on delete cascade,
  status          text        not null default 'open'
                              check (status in ('open','in_progress','submitted','reviewed','closed')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index tasks_assigned_to_idx on public.tasks (assigned_to);
create index tasks_created_by_idx  on public.tasks (created_by);
create index tasks_status_idx      on public.tasks (status);

drop trigger if exists set_updated_at_tasks on public.tasks;
create trigger set_updated_at_tasks
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- ───────────────────────────────────────────────────────────────
-- 5. submissions (player answers + coach feedback)
-- ───────────────────────────────────────────────────────────────
create table public.submissions (
  id            uuid        primary key default gen_random_uuid(),
  task_id       uuid        not null references public.tasks(id)   on delete cascade,
  player_id     uuid        not null references auth.users(id)     on delete cascade,
  content       text,
  file_url      text,
  feedback      text,
  score         int         check (score is null or score between 0 and 100),
  reviewed_by   uuid                 references auth.users(id) on delete set null,
  reviewed_at   timestamptz,
  submitted_at  timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (task_id, player_id)
);

create index submissions_task_idx   on public.submissions (task_id);
create index submissions_player_idx on public.submissions (player_id);

drop trigger if exists set_updated_at_submissions on public.submissions;
create trigger set_updated_at_submissions
  before update on public.submissions
  for each row execute function public.set_updated_at();

-- ───────────────────────────────────────────────────────────────
-- 6. Role helper functions (security definer so they bypass RLS
--    on profiles when called from policies — preventing recursion)
-- ───────────────────────────────────────────────────────────────
create or replace function public.user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.is_coach()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'coach' from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.is_player()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'player' from public.profiles where id = auth.uid()),
    false
  );
$$;

revoke all     on function public.user_role()     from public;
revoke all     on function public.is_admin()      from public;
revoke all     on function public.is_coach()      from public;
revoke all     on function public.is_player()     from public;
grant  execute on function public.user_role()     to authenticated;
grant  execute on function public.is_admin()      to authenticated;
grant  execute on function public.is_coach()      to authenticated;
grant  execute on function public.is_player()     to authenticated;

-- ───────────────────────────────────────────────────────────────
-- 7. handle_new_user — auto-create profile on signup
-- ───────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  signup_role public.app_role;
begin
  begin
    signup_role := coalesce(
      (new.raw_user_meta_data->>'role')::public.app_role,
      'player'::public.app_role
    );
  exception when invalid_text_representation then
    signup_role := 'player';
  end;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    signup_role
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Mirror profile.role into auth.users.raw_user_meta_data so
-- middleware can read it from the JWT without a DB round-trip.
create or replace function public.sync_role_to_metadata()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update auth.users
     set raw_user_meta_data =
           coalesce(raw_user_meta_data, '{}'::jsonb)
           || jsonb_build_object('role', new.role::text)
   where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_profile_role_changed on public.profiles;
create trigger on_profile_role_changed
  after insert or update of role on public.profiles
  for each row execute function public.sync_role_to_metadata();

-- ───────────────────────────────────────────────────────────────
-- 8. RLS — enable on all relevant tables
-- ───────────────────────────────────────────────────────────────
alter table public.profiles    enable row level security;
alter table public.tasks       enable row level security;
alter table public.submissions enable row level security;

-- The existing tables already have RLS enabled in 0001/0003/0004,
-- but we drop their policies and rebuild them against the new
-- helper functions.
alter table public.players          enable row level security;
alter table public.coaches          enable row level security;
alter table public.tournaments      enable row level security;
alter table public.participations   enable row level security;
alter table public.attendance       enable row level security;
alter table public.news             enable row level security;
alter table public.enrollments      enable row level security;
alter table public.coach_assignments enable row level security;

-- ───────────────────────────────────────────────────────────────
-- 9. profiles policies
-- ───────────────────────────────────────────────────────────────
drop policy if exists "profiles: read self"    on public.profiles;
drop policy if exists "profiles: read all"     on public.profiles;
drop policy if exists "profiles: update self"  on public.profiles;
drop policy if exists "profiles: admin all"    on public.profiles;

-- Anyone authenticated can read profiles (needed for displaying
-- coach / player names everywhere). Admins can read regardless.
create policy "profiles: read all"
  on public.profiles for select
  to authenticated
  using (true);

-- A user can update their own profile (everything except role).
create policy "profiles: update self"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

-- Admins can do anything (super-admin).
create policy "profiles: admin all"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ───────────────────────────────────────────────────────────────
-- 10. tasks policies
-- ───────────────────────────────────────────────────────────────
drop policy if exists "tasks: admin all"      on public.tasks;
drop policy if exists "tasks: coach writes"   on public.tasks;
drop policy if exists "tasks: coach reads"    on public.tasks;
drop policy if exists "tasks: player reads"   on public.tasks;

-- Admin: everything.
create policy "tasks: admin all"
  on public.tasks for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Coach: full CRUD on tasks they created.
create policy "tasks: coach writes"
  on public.tasks for all
  to authenticated
  using (public.is_coach() and created_by = auth.uid())
  with check (public.is_coach() and created_by = auth.uid());

-- Coaches can read all tasks (so they can see other coaches' work
-- and the global view); admin reads via the admin policy.
create policy "tasks: coach reads"
  on public.tasks for select
  to authenticated
  using (public.is_coach());

-- Player: can only see tasks assigned to them.
create policy "tasks: player reads"
  on public.tasks for select
  to authenticated
  using (public.is_player() and assigned_to = auth.uid());

-- ───────────────────────────────────────────────────────────────
-- 11. submissions policies
-- ───────────────────────────────────────────────────────────────
drop policy if exists "submissions: admin all"           on public.submissions;
drop policy if exists "submissions: player own"          on public.submissions;
drop policy if exists "submissions: coach review"        on public.submissions;
drop policy if exists "submissions: coach reads owned"   on public.submissions;

-- Admin: everything.
create policy "submissions: admin all"
  on public.submissions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Player: can insert / read / update their own submissions.
create policy "submissions: player own"
  on public.submissions for all
  to authenticated
  using (public.is_player() and player_id = auth.uid())
  with check (public.is_player() and player_id = auth.uid());

-- Coach: can read submissions for tasks they created and write
-- feedback / score on them (full update granted; in practice the
-- UI only edits feedback fields).
create policy "submissions: coach reads owned"
  on public.submissions for select
  to authenticated
  using (
    public.is_coach()
    and exists (
      select 1 from public.tasks t
      where t.id = submissions.task_id
        and t.created_by = auth.uid()
    )
  );

create policy "submissions: coach review"
  on public.submissions for update
  to authenticated
  using (
    public.is_coach()
    and exists (
      select 1 from public.tasks t
      where t.id = submissions.task_id
        and t.created_by = auth.uid()
    )
  )
  with check (
    public.is_coach()
    and exists (
      select 1 from public.tasks t
      where t.id = submissions.task_id
        and t.created_by = auth.uid()
    )
  );

-- ───────────────────────────────────────────────────────────────
-- 12. Rebuild policies for the existing domain tables
-- ───────────────────────────────────────────────────────────────
-- Drop everything previously created so we can rebuild against
-- the new helper functions.
do $$
declare
  pol record;
begin
  for pol in
    select policyname, tablename from pg_policies
    where schemaname = 'public'
      and tablename in (
        'players','coaches','tournaments','participations',
        'attendance','news','enrollments','coach_assignments'
      )
  loop
    execute format('drop policy if exists %I on public.%I', pol.policyname, pol.tablename);
  end loop;
end $$;

-- Generic read-for-all + admin-write loop. Coach-specific writes
-- are layered on after.
do $$
declare t text;
begin
  foreach t in array array['players','coaches','tournaments','news'] loop
    execute format($p$
      create policy "%1$s: read"
        on public.%1$s for select
        to authenticated
        using (true)
    $p$, t);

    execute format($p$
      create policy "%1$s: admin writes"
        on public.%1$s for all
        to authenticated
        using (public.is_admin())
        with check (public.is_admin())
    $p$, t);
  end loop;
end $$;

-- participations and attendance: read for all authenticated, write
-- for admin OR coach.
do $$
declare t text;
begin
  foreach t in array array['participations','attendance'] loop
    execute format($p$
      create policy "%1$s: read"
        on public.%1$s for select
        to authenticated
        using (true)
    $p$, t);

    execute format($p$
      create policy "%1$s: admin writes"
        on public.%1$s for all
        to authenticated
        using (public.is_admin())
        with check (public.is_admin())
    $p$, t);

    execute format($p$
      create policy "%1$s: coach writes"
        on public.%1$s for all
        to authenticated
        using (public.is_coach())
        with check (public.is_coach())
    $p$, t);
  end loop;
end $$;

-- enrollments: anon insert, admin read/write, coach read.
create policy "enrollments: public submit"
  on public.enrollments for insert
  to anon, authenticated
  with check (true);

create policy "enrollments: admin all"
  on public.enrollments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "enrollments: coach reads"
  on public.enrollments for select
  to authenticated
  using (public.is_coach());

-- coach_assignments: read for all authenticated, admin writes.
create policy "coach_assignments: read"
  on public.coach_assignments for select
  to authenticated
  using (true);

create policy "coach_assignments: admin writes"
  on public.coach_assignments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ───────────────────────────────────────────────────────────────
-- 13. Privileges
-- ───────────────────────────────────────────────────────────────
grant usage on schema public to authenticated, anon;

grant select, insert, update, delete on
  public.profiles, public.tasks, public.submissions,
  public.players, public.coaches, public.tournaments,
  public.participations, public.attendance,
  public.news, public.enrollments, public.coach_assignments
  to authenticated;

grant insert on public.enrollments to anon;

-- ───────────────────────────────────────────────────────────────
-- 14. Backfill profiles for any pre-existing auth users (idempotent)
-- ───────────────────────────────────────────────────────────────
insert into public.profiles (id, email, full_name, role)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  case
    -- Project owner is always admin (super-admin bootstrap).
    when lower(u.email) = 'gmsherifashraf@gmail.com'        then 'admin'::public.app_role
    when (u.raw_user_meta_data->>'role') = 'admin'          then 'admin'::public.app_role
    when (u.raw_user_meta_data->>'role') = 'coach'          then 'coach'::public.app_role
    else 'player'::public.app_role
  end
from auth.users u
on conflict (id) do nothing;

-- ───────────────────────────────────────────────────────────────
-- 15. Promote project owner to admin (idempotent — runs even if
--     the profile already existed before this migration).
-- ───────────────────────────────────────────────────────────────
update public.profiles
   set role = 'admin'::public.app_role
 where id in (
   select id from auth.users where lower(email) = 'gmsherifashraf@gmail.com'
 );
