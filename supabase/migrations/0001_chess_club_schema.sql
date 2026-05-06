-- =============================================================
-- Chess Club Management — initial schema
-- Tables, role system, helper functions, and RLS policies.
-- Safe to re-run: every object uses IF NOT EXISTS / OR REPLACE
-- or is dropped before being recreated.
-- =============================================================

-- ---------- Extensions ---------------------------------------
create extension if not exists "pgcrypto";  -- for gen_random_uuid()

-- ---------- Reset (DESTRUCTIVE) ------------------------------
-- Drops any pre-existing versions of these tables so the new
-- UUID-based schema can replace bigint columns from earlier runs.
-- Comment this block out if you have data you want to keep.
drop table if exists public.attendance      cascade;
drop table if exists public.participations  cascade;
drop table if exists public.tournaments     cascade;
drop table if exists public.players         cascade;
drop table if exists public.coaches         cascade;
drop table if exists public.user_roles      cascade;

-- ---------- Enums --------------------------------------------
do $$ begin
  create type public.app_role as enum ('admin', 'staff', 'user');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.attendance_status as enum ('present', 'absent', 'late', 'excused');
exception when duplicate_object then null; end $$;

-- ---------- Roles table --------------------------------------
-- One row per (user, role). A user can hold multiple roles.
create table if not exists public.user_roles (
  user_id  uuid           not null references auth.users(id) on delete cascade,
  role     public.app_role not null,
  granted_at timestamptz  not null default now(),
  primary key (user_id, role)
);

-- ---------- Domain tables ------------------------------------
create table if not exists public.players (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  rating      int         check (rating is null or rating between 0 and 4000),
  age         int         check (age is null or age between 3 and 120),
  image_url   text,
  created_at  timestamptz not null default now()
);

create table if not exists public.coaches (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  title      text,
  image_url  text,
  created_at timestamptz not null default now()
);

create table if not exists public.tournaments (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  date        date not null,
  location    text,
  description text,
  created_at  timestamptz not null default now()
);

create table if not exists public.participations (
  player_id     uuid not null references public.players(id)     on delete cascade,
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  result        text,         -- e.g. '1st', '5/7', 'withdrew'
  score         numeric(4,1), -- optional numeric points
  primary key (player_id, tournament_id)
);

create table if not exists public.attendance (
  player_id  uuid not null references public.players(id) on delete cascade,
  date       date not null,
  status     public.attendance_status not null default 'present',
  note       text,
  primary key (player_id, date)
);

-- Helpful indexes
create index if not exists players_rating_idx       on public.players (rating desc);
create index if not exists tournaments_date_idx     on public.tournaments (date desc);
create index if not exists participations_t_idx     on public.participations (tournament_id);
create index if not exists attendance_date_idx      on public.attendance (date);

-- ---------- Helper functions ---------------------------------
-- SECURITY DEFINER so RLS on user_roles cannot recurse into the
-- policies that depend on these helpers.
create or replace function public.has_role(check_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = check_role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('admin');
$$;

revoke all on function public.has_role(public.app_role) from public;
revoke all on function public.is_admin()                 from public;
grant execute on function public.has_role(public.app_role) to authenticated;
grant execute on function public.is_admin()                 to authenticated;

-- ---------- Enable RLS ---------------------------------------
alter table public.user_roles      enable row level security;
alter table public.players         enable row level security;
alter table public.coaches         enable row level security;
alter table public.tournaments     enable row level security;
alter table public.participations  enable row level security;
alter table public.attendance      enable row level security;

-- ---------- Policies: user_roles -----------------------------
drop policy if exists "user_roles: read own"      on public.user_roles;
drop policy if exists "user_roles: admin reads"   on public.user_roles;
drop policy if exists "user_roles: admin writes"  on public.user_roles;

create policy "user_roles: read own"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid());

create policy "user_roles: admin reads"
  on public.user_roles for select
  to authenticated
  using (public.is_admin());

create policy "user_roles: admin writes"
  on public.user_roles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- Generic policy helper ----------------------------
-- For each domain table:
--   * authenticated users can SELECT
--   * only admins can INSERT/UPDATE/DELETE
do $$
declare t text;
begin
  foreach t in array array['players','coaches','tournaments','participations','attendance']
  loop
    execute format('drop policy if exists "%1$s: read"   on public.%1$s', t);
    execute format('drop policy if exists "%1$s: write"  on public.%1$s', t);

    execute format($p$
      create policy "%1$s: read"
        on public.%1$s for select
        to authenticated
        using (true)
    $p$, t);

    execute format($p$
      create policy "%1$s: write"
        on public.%1$s for all
        to authenticated
        using (public.is_admin())
        with check (public.is_admin())
    $p$, t);
  end loop;
end $$;

-- ---------- Default privileges -------------------------------
-- RLS is the gatekeeper, but table privileges still need to be granted.
grant usage on schema public to authenticated;
grant select                         on public.players, public.coaches, public.tournaments,
                                         public.participations, public.attendance,
                                         public.user_roles
                                       to authenticated;
grant insert, update, delete         on public.players, public.coaches, public.tournaments,
                                         public.participations, public.attendance,
                                         public.user_roles
                                       to authenticated;
-- (Writes are still gated by the admin RLS policy above.)

-- ---------- Auto-grant 'user' role on signup -----------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
