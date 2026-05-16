-- =============================================================================
-- 0009_attendance_bridge.sql
--
-- Fixes a correctness bug exposed by the 5-role rollout:
--
--   * The ROSTER model (0001): players / coaches / attendance /
--     coach_assignments are keyed by their own table ids.
--   * The AUTH model (0005): profiles / tasks / submissions are keyed
--     by auth.users.id.
--
-- parent_player_relationships (0008) holds AUTH user ids, but
-- `attendance.player_id` is a ROSTER players.id. The 0008 policy
-- `attendance: parent reads` therefore never matched → parents saw
-- zero attendance.
--
-- Fix: add a nullable bridge `players.profile_id → auth.users(id)` so a
-- roster player can be tied to their player login, then rewrite the
-- parent attendance policy to traverse it. Fully additive.
--
-- Apply AFTER 0008.
-- =============================================================================

alter table public.players
  add column if not exists profile_id uuid
  references auth.users(id) on delete set null;

create index if not exists players_profile_id_idx
  on public.players (profile_id);

-- Helper: does the current parent own the roster player `rp`?
create or replace function public.is_parent_of_roster(rp uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.players p
    join public.parent_player_relationships r
      on r.player_id = p.profile_id
    where p.id = rp
      and r.parent_id = auth.uid()
  );
$$;
revoke all     on function public.is_parent_of_roster(uuid) from public;
grant  execute on function public.is_parent_of_roster(uuid) to authenticated;

-- Replace the broken parent attendance policy with the bridged one.
drop policy if exists "attendance: parent reads" on public.attendance;
create policy "attendance: parent reads" on public.attendance
  for select to authenticated
  using (public.is_parent() and public.is_parent_of_roster(player_id));

-- Parents may also read their child's roster row (name/rating) so the
-- dashboard can resolve roster ids for that child.
drop policy if exists "players: parent reads child" on public.players;
create policy "players: parent reads child" on public.players
  for select to authenticated
  using (
    public.is_parent()
    and profile_id is not null
    and public.is_parent_of(profile_id)
  );

-- Audit view: roster players not yet bridged to a login (admin surfaces
-- these so attendance/progress can flow to the parent).
create or replace view public.roster_players_unbridged as
  select id, name, rating, age
  from public.players
  where profile_id is null;
grant select on public.roster_players_unbridged to authenticated;
