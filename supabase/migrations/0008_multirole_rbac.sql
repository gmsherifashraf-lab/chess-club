-- =============================================================================
-- 0008_multirole_rbac.sql
--
-- Professional 5-role RBAC + relational layer, built ADDITIVELY on top of
-- 0001–0007 (profiles, tasks, submissions, attendance, gallery_images,
-- enrollments, coaches/players, helper fns is_admin/is_coach/is_player).
--
-- Roles: admin · editor · coach · player · parent
--   admin  — full control, only role that creates accounts
--   editor — gallery + news + read join requests; NO user management
--   coach  — manage ONLY their linked players + tasks/submissions/attendance
--   player — own tasks/submissions/progress
--   parent — READ-ONLY view of their linked player(s)
--
-- Account creation: public signup is disabled in the app + Supabase Auth.
-- New users are created by an admin via the service-role API route
-- (src/app/api/admin/create-user). handle_new_user just mirrors the role.
--
-- Apply AFTER 0007. Idempotent where possible. Does NOT drop existing
-- policies except the gallery/news ones it explicitly rebuilds.
-- =============================================================================

-- 1. Ensure all five enum values exist (player from 0005; editor/parent 0007)
alter type public.app_role add value if not exists 'editor';
alter type public.app_role add value if not exists 'parent';

-- 2. Role helper functions for the two new roles.
--    NOTE: compare on role::text, NOT the enum literal. A freshly
--    ALTER TYPE ... ADD VALUE'd enum value cannot be *used* in the
--    same transaction (Postgres 55P04); a text comparison sidesteps
--    that, so this whole migration can run as one script.
create or replace function public.is_editor()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role::text = 'editor' from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.is_parent()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role::text = 'parent' from public.profiles where id = auth.uid()), false);
$$;

revoke all     on function public.is_editor() from public;
revoke all     on function public.is_parent() from public;
grant  execute on function public.is_editor() to authenticated;
grant  execute on function public.is_parent() to authenticated;

-- 3. Relationship: parent → player (a player has exactly ONE parent;
--    a parent may have several players). Enforced by unique(player_id).
create table if not exists public.parent_player_relationships (
  id          uuid        primary key default gen_random_uuid(),
  parent_id   uuid        not null references auth.users(id) on delete cascade,
  player_id   uuid        not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (player_id)
);
create index if not exists ppr_parent_idx on public.parent_player_relationships (parent_id);
create index if not exists ppr_player_idx on public.parent_player_relationships (player_id);

-- 4. Relationship: coach ↔ player (many-to-many)
create table if not exists public.coach_player_relationships (
  id          uuid        primary key default gen_random_uuid(),
  coach_id    uuid        not null references auth.users(id) on delete cascade,
  player_id   uuid        not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (coach_id, player_id)
);
create index if not exists cpr_coach_idx  on public.coach_player_relationships (coach_id);
create index if not exists cpr_player_idx on public.coach_player_relationships (player_id);

-- 5. Membership/join requests (canonical name; the existing public
--    `enrollments` table already backs the /register form — expose it
--    here as a stable view so app code can migrate gradually).
create or replace view public.join_requests as
  select * from public.enrollments;
grant select on public.join_requests to authenticated;

-- 6. Linkage helper functions (security definer → usable inside policies)
create or replace function public.is_parent_of(p uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.parent_player_relationships
    where parent_id = auth.uid() and player_id = p
  );
$$;

create or replace function public.coaches_player(p uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.coach_player_relationships
    where coach_id = auth.uid() and player_id = p
  );
$$;

revoke all     on function public.is_parent_of(uuid)  from public;
revoke all     on function public.coaches_player(uuid) from public;
grant  execute on function public.is_parent_of(uuid)  to authenticated;
grant  execute on function public.coaches_player(uuid) to authenticated;

-- 7. RLS on the new relationship tables
alter table public.parent_player_relationships enable row level security;
alter table public.coach_player_relationships  enable row level security;

drop policy if exists "ppr: admin all"     on public.parent_player_relationships;
drop policy if exists "ppr: parent reads"  on public.parent_player_relationships;
drop policy if exists "ppr: player reads"  on public.parent_player_relationships;
create policy "ppr: admin all" on public.parent_player_relationships
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "ppr: parent reads" on public.parent_player_relationships
  for select to authenticated using (parent_id = auth.uid());
create policy "ppr: player reads" on public.parent_player_relationships
  for select to authenticated using (player_id = auth.uid());

drop policy if exists "cpr: admin all"    on public.coach_player_relationships;
drop policy if exists "cpr: coach reads"  on public.coach_player_relationships;
drop policy if exists "cpr: player reads" on public.coach_player_relationships;
create policy "cpr: admin all" on public.coach_player_relationships
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "cpr: coach reads" on public.coach_player_relationships
  for select to authenticated using (coach_id = auth.uid());
create policy "cpr: player reads" on public.coach_player_relationships
  for select to authenticated using (player_id = auth.uid());

-- 8. EDITOR access — gallery + news (full), join requests (read).
drop policy if exists "gallery_images: editor all" on public.gallery_images;
create policy "gallery_images: editor all" on public.gallery_images
  for all to authenticated using (public.is_editor()) with check (public.is_editor());

drop policy if exists "news: editor all" on public.news;
create policy "news: editor all" on public.news
  for all to authenticated using (public.is_editor()) with check (public.is_editor());

drop policy if exists "enrollments: editor reads" on public.enrollments;
create policy "enrollments: editor reads" on public.enrollments
  for select to authenticated using (public.is_editor());

-- 9. COACH scoping — coaches act only on their linked players.
--    (Existing 0005 coach policies on tasks/submissions key off
--    created_by; these add the relationship-scoped read paths.)
drop policy if exists "submissions: coach linked" on public.submissions;
create policy "submissions: coach linked" on public.submissions
  for select to authenticated
  using (public.is_coach() and public.coaches_player(player_id));

drop policy if exists "tasks: coach linked" on public.tasks;
create policy "tasks: coach linked" on public.tasks
  for select to authenticated
  using (public.is_coach() and assigned_to is not null and public.coaches_player(assigned_to));

-- 10. PARENT access — strictly READ-ONLY for their linked player(s).
drop policy if exists "tasks: parent reads"       on public.tasks;
drop policy if exists "submissions: parent reads" on public.submissions;
drop policy if exists "attendance: parent reads"  on public.attendance;
drop policy if exists "profiles: parent reads child" on public.profiles;

create policy "tasks: parent reads" on public.tasks
  for select to authenticated
  using (public.is_parent() and assigned_to is not null and public.is_parent_of(assigned_to));

create policy "submissions: parent reads" on public.submissions
  for select to authenticated
  using (public.is_parent() and public.is_parent_of(player_id));

-- attendance: the table links to a player; adjust the column name here
-- if your attendance schema differs (0001 uses player_id on attendance).
create policy "attendance: parent reads" on public.attendance
  for select to authenticated
  using (public.is_parent() and public.is_parent_of(player_id));

create policy "profiles: parent reads child" on public.profiles
  for select to authenticated
  using (public.is_parent() and public.is_parent_of(id));

-- 11. Integrity guard: a player profile SHOULD have a parent link.
--     Hard-blocking at the DB is impractical (the link is created in a
--     second statement by the admin flow), so we expose an audit view
--     the admin dashboard surfaces as "players missing a parent".
create or replace view public.players_without_parent as
  select p.id, p.email, p.full_name
  from public.profiles p
  where p.role = 'player'
    and not exists (
      select 1 from public.parent_player_relationships r
      where r.player_id = p.id
    );
grant select on public.players_without_parent to authenticated;

-- 12. Privileges for new tables
grant select, insert, update, delete
  on public.parent_player_relationships, public.coach_player_relationships
  to authenticated;

-- 13. handle_new_user — accounts are admin-created with an explicit role
--     in user_metadata; default to 'player' only as a safety net.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare signup_role public.app_role;
begin
  begin
    signup_role := coalesce(
      (new.raw_user_meta_data->>'role')::public.app_role, 'player'::public.app_role);
  exception when others then
    signup_role := 'player';
  end;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id, new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    signup_role
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
