-- =============================================================================
-- 0027_attendance_session_scope.sql
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
