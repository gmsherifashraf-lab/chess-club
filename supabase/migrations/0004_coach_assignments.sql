-- =============================================================
-- Coach ↔ Player assignment
--
-- Adds:
--   coaches.user_id              — links a coach record to an auth user
--   public.coach_assignments     — junction (coach_id, player_id)
--
-- Additive: existing coach data is untouched.
-- =============================================================

-- ── Link coaches to auth users ────────────────────────────────
-- Nullable so a coach record can exist before an account is created.
alter table public.coaches
  add column if not exists user_id uuid
    references auth.users(id) on delete set null;

-- Each auth user can be linked to at most one coach record.
create unique index if not exists coaches_user_id_idx
  on public.coaches (user_id)
  where user_id is not null;

-- ── Junction table ────────────────────────────────────────────
create table if not exists public.coach_assignments (
  coach_id    uuid        not null references public.coaches(id) on delete cascade,
  player_id   uuid        not null references public.players(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (coach_id, player_id)
);

create index if not exists coach_assignments_player_idx
  on public.coach_assignments (player_id);

-- ── RLS ───────────────────────────────────────────────────────
alter table public.coach_assignments enable row level security;

drop policy if exists "coach_assignments: read"          on public.coach_assignments;
drop policy if exists "coach_assignments: admin writes"  on public.coach_assignments;

-- All authenticated users can read (the coach UI needs to query their own
-- assignments; admins need the full list).
create policy "coach_assignments: read"
  on public.coach_assignments for select
  to authenticated
  using (true);

create policy "coach_assignments: admin writes"
  on public.coach_assignments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert, update, delete on public.coach_assignments to authenticated;

-- ── Helper for coach UI ───────────────────────────────────────
-- Returns the coach.id linked to the calling user, or null.
create or replace function public.current_coach_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.coaches where user_id = auth.uid() limit 1;
$$;

revoke all     on function public.current_coach_id() from public;
grant  execute on function public.current_coach_id() to authenticated;

-- =============================================================
-- One-time linking step (run AFTER you've created the auth user
-- and the coaches row separately):
--
--   update public.coaches
--   set    user_id = (select id from auth.users where email = lower('coach@example.com'))
--   where  name = 'Coach Name';
--
-- If you've been using the seeded coach data and signed in as
-- ashraf.shereif@icloud.com:
--
--   update public.coaches
--   set    user_id = (select id from auth.users where email = 'ashraf.shereif@icloud.com')
--   where  name    = 'Fatima Al-Maktoum';   -- pick whichever coach record you are
-- =============================================================
