-- =============================================================
-- Chess Club Management — initial schema
-- Tables, role system, helper functions, and RLS policies.
--
-- Roles are stored in public.user_roles (single source of truth).
-- A trigger mirrors the role into auth.users.raw_user_meta_data
-- so the existing middleware/login (which reads metadata.role) keeps
-- working without an extra DB round-trip per request.
--
-- Safe to re-run: each object is dropped or guarded with IF NOT
-- EXISTS / OR REPLACE. The reset block at the top is destructive.
-- =============================================================

-- ---------- Extensions ---------------------------------------
create extension if not exists "pgcrypto";  -- for gen_random_uuid()

-- ---------- Reset (DESTRUCTIVE) ------------------------------
-- Drops any pre-existing versions of these tables. Comment this
-- block out if you have data you want to keep.
drop table if exists public.attendance      cascade;
drop table if exists public.participations  cascade;
drop table if exists public.tournaments     cascade;
drop table if exists public.players         cascade;
drop table if exists public.coaches         cascade;
drop table if exists public.news            cascade;
drop table if exists public.board_members   cascade;
drop table if exists public.user_roles      cascade;
drop type  if exists public.app_role        cascade;
drop type  if exists public.attendance_status cascade;

-- ---------- Enums --------------------------------------------
-- Role names match the app's UserRole type in src/lib/auth.ts
create type public.app_role          as enum ('admin', 'coach', 'parent', 'board');
create type public.attendance_status as enum ('present', 'absent', 'late', 'excused');

-- ---------- Roles table --------------------------------------
-- One role per user (PK = user_id). Single source of truth; a
-- trigger below mirrors the value into auth.users.raw_user_meta_data
-- so the JWT carries it for fast middleware reads.
create table public.user_roles (
  user_id    uuid           primary key references auth.users(id) on delete cascade,
  role       public.app_role not null,
  granted_at timestamptz    not null default now()
);

-- ---------- Domain tables ------------------------------------
create table public.players (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  rating      int         check (rating is null or rating between 0 and 4000),
  age         int         check (age is null or age between 3 and 120),
  image_url   text,
  created_at  timestamptz not null default now()
);

create table public.coaches (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  title      text,
  image_url  text,
  created_at timestamptz not null default now()
);

create table public.tournaments (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  date        date not null,
  location    text,
  description text,
  created_at  timestamptz not null default now()
);

create table public.participations (
  player_id     uuid not null references public.players(id)     on delete cascade,
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  result        text,
  score         numeric(4,1),
  primary key (player_id, tournament_id)
);

create table public.attendance (
  player_id  uuid not null references public.players(id) on delete cascade,
  date       date not null,
  status     public.attendance_status not null default 'present',
  note       text,
  primary key (player_id, date)
);

-- Content tables consumed by the home page (src/lib/queries/home.ts)
create table public.board_members (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text,
  image_url  text,
  bio        text,
  created_at timestamptz not null default now()
);

create table public.news (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  category     text,
  excerpt      text,
  body         text,
  image_url    text,
  published_at timestamptz,
  created_at   timestamptz not null default now()
);

-- Indexes
create index players_rating_idx    on public.players (rating desc);
create index tournaments_date_idx  on public.tournaments (date desc);
create index participations_t_idx  on public.participations (tournament_id);
create index attendance_date_idx   on public.attendance (date);
create index news_published_idx    on public.news (published_at desc);

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

revoke all       on function public.has_role(public.app_role) from public;
revoke all       on function public.is_admin()                 from public;
grant  execute   on function public.has_role(public.app_role) to authenticated;
grant  execute   on function public.is_admin()                 to authenticated;

-- ---------- Enable RLS ---------------------------------------
alter table public.user_roles      enable row level security;
alter table public.players         enable row level security;
alter table public.coaches         enable row level security;
alter table public.tournaments     enable row level security;
alter table public.participations  enable row level security;
alter table public.attendance      enable row level security;
alter table public.board_members   enable row level security;
alter table public.news            enable row level security;

-- ---------- Policies: user_roles -----------------------------
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

-- ---------- Domain table policies (loop) ---------------------
-- For each domain table:
--   * authenticated users can SELECT
--   * only admins can INSERT/UPDATE/DELETE
do $$
declare t text;
begin
  foreach t in array array[
    'players','coaches','tournaments','participations','attendance',
    'board_members','news'
  ] loop
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
grant usage on schema public to authenticated;
grant select, insert, update, delete on
  public.players, public.coaches, public.tournaments,
  public.participations, public.attendance,
  public.board_members, public.news, public.user_roles
  to authenticated;
-- (Writes are still gated by the admin RLS policy above.)

-- ---------- Auto-grant role on signup ------------------------
-- Reads the role chosen during signUp() from raw_user_meta_data,
-- defaults to 'parent' (the academy enrollment path).
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
      'parent'::public.app_role
    );
  exception when invalid_text_representation then
    signup_role := 'parent';  -- fallback if metadata has an unexpected role
  end;

  insert into public.user_roles (user_id, role)
  values (new.id, signup_role)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Mirror user_roles → auth.users metadata ----------
-- Lets middleware keep reading session.user.user_metadata.role
-- without an extra DB query per request, while making user_roles
-- the single write target.
create or replace function public.sync_role_to_metadata()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'DELETE') then
    update auth.users
       set raw_user_meta_data = (raw_user_meta_data - 'role')
     where id = old.user_id;
    return old;
  else
    update auth.users
       set raw_user_meta_data =
             coalesce(raw_user_meta_data, '{}'::jsonb)
             || jsonb_build_object('role', new.role::text)
     where id = new.user_id;
    return new;
  end if;
end;
$$;

drop trigger if exists on_user_role_changed on public.user_roles;
create trigger on_user_role_changed
  after insert or update or delete on public.user_roles
  for each row execute function public.sync_role_to_metadata();
