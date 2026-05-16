-- =============================================================================
-- 0010_coach_link_sync.sql
--
-- Single source of truth for coach<->player links = the AUTH model
-- (public.coach_player_relationships, keyed by auth.users.id, managed in
-- the admin "Links" tab + the create-user API).
--
-- The legacy ROSTER junction (public.coach_assignments, keyed by
-- coaches.id / players.id) is now DERIVED from it via the bridges
-- coaches.user_id (0004) and players.profile_id (0009), kept in sync by
-- triggers. The coach dashboard (reads coach_assignments) and the
-- coaches_player() RLS (reads coach_player_relationships) therefore both
-- keep working and can no longer drift. The manual CoachAssignments admin
-- tab has been removed in the app.
--
-- NON-DESTRUCTIVE: existing coach_assignments rows are preserved. A
-- one-time forward backfill ADDS the rows implied by current
-- coach_player_relationships. Roster-only leftovers are NOT deleted
-- automatically — review public.coach_assignments_orphans and run the
-- optional cleanup at the bottom once links are recreated in the UI.
--
-- Apply AFTER 0009. Idempotent.
-- =============================================================================

-- 1. Incremental sync: a coach_player_relationships row -> coach_assignments
create or replace function public.cpr_to_roster_sync()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_coach uuid;
  v_player uuid;
begin
  if (tg_op = 'DELETE' or tg_op = 'UPDATE') then
    select id into v_coach  from public.coaches where user_id   = old.coach_id;
    select id into v_player from public.players where profile_id = old.player_id;
    if v_coach is not null and v_player is not null then
      delete from public.coach_assignments
      where coach_id = v_coach and player_id = v_player;
    end if;
  end if;

  if (tg_op = 'INSERT' or tg_op = 'UPDATE') then
    select id into v_coach  from public.coaches where user_id   = new.coach_id;
    select id into v_player from public.players where profile_id = new.player_id;
    if v_coach is not null and v_player is not null then
      insert into public.coach_assignments (coach_id, player_id)
      values (v_coach, v_player)
      on conflict (coach_id, player_id) do nothing;
    end if;
  end if;

  return null;
end;
$$;

drop trigger if exists trg_cpr_to_roster on public.coach_player_relationships;
create trigger trg_cpr_to_roster
  after insert or update or delete on public.coach_player_relationships
  for each row execute function public.cpr_to_roster_sync();

-- 2. Late-bridge backfill: if coaches.user_id or players.profile_id is set
--    AFTER the auth relationship exists, (re)derive that entity's roster
--    links so order of operations never matters.
create or replace function public.rebuild_roster_links_for_coach(p_user uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_coach uuid;
begin
  select id into v_coach from public.coaches where user_id = p_user;
  if v_coach is null then return; end if;
  insert into public.coach_assignments (coach_id, player_id)
  select v_coach, pl.id
  from public.coach_player_relationships r
  join public.players pl on pl.profile_id = r.player_id
  where r.coach_id = p_user
  on conflict (coach_id, player_id) do nothing;
end;
$$;

create or replace function public.rebuild_roster_links_for_player(p_user uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_player uuid;
begin
  select id into v_player from public.players where profile_id = p_user;
  if v_player is null then return; end if;
  insert into public.coach_assignments (coach_id, player_id)
  select co.id, v_player
  from public.coach_player_relationships r
  join public.coaches co on co.user_id = r.coach_id
  where r.player_id = p_user
  on conflict (coach_id, player_id) do nothing;
end;
$$;

create or replace function public.coaches_bridge_sync()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.user_id is not null
     and (tg_op = 'INSERT' or new.user_id is distinct from old.user_id) then
    perform public.rebuild_roster_links_for_coach(new.user_id);
  end if;
  return null;
end;
$$;
drop trigger if exists trg_coaches_bridge on public.coaches;
create trigger trg_coaches_bridge
  after insert or update of user_id on public.coaches
  for each row execute function public.coaches_bridge_sync();

create or replace function public.players_bridge_sync()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.profile_id is not null
     and (tg_op = 'INSERT' or new.profile_id is distinct from old.profile_id) then
    perform public.rebuild_roster_links_for_player(new.profile_id);
  end if;
  return null;
end;
$$;
drop trigger if exists trg_players_bridge on public.players;
create trigger trg_players_bridge
  after insert or update of profile_id on public.players
  for each row execute function public.players_bridge_sync();

-- 3. One-time forward backfill (additive, non-destructive).
insert into public.coach_assignments (coach_id, player_id)
select co.id, pl.id
from public.coach_player_relationships r
join public.coaches co on co.user_id    = r.coach_id
join public.players pl on pl.profile_id = r.player_id
on conflict (coach_id, player_id) do nothing;

-- 4. Audit view: coach_assignments rows NOT backed by an auth
--    relationship (manual leftovers / pre-existing drift).
create or replace view public.coach_assignments_orphans as
  select ca.coach_id, ca.player_id,
         co.name as coach_name, pl.name as player_name
  from public.coach_assignments ca
  join public.coaches co on co.id = ca.coach_id
  join public.players pl on pl.id = ca.player_id
  where not exists (
    select 1
    from public.coach_player_relationships r
    join public.coaches c2 on c2.user_id    = r.coach_id
    join public.players p2 on p2.profile_id = r.player_id
    where c2.id = ca.coach_id and p2.id = ca.player_id
  );
grant select on public.coach_assignments_orphans to authenticated;

-- =============================================================================
-- OPTIONAL — DESTRUCTIVE. Run only after recreating coach links in the
-- admin "Links" tab and reviewing coach_assignments_orphans. This purges
-- legacy roster-only assignments so coach_assignments becomes fully
-- derived from the auth model:
--
--   delete from public.coach_assignments ca
--   using public.coach_assignments_orphans o
--   where ca.coach_id = o.coach_id and ca.player_id = o.player_id;
-- =============================================================================
