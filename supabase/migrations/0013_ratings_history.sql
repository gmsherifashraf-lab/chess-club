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

create type public.rating_source as enum (
  'tournament',
  'assessment',
  'admin_adjust',
  'external_sync',     -- pulled from lichess/chesscom/FIDE feed
  'manual_entry'
);

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
