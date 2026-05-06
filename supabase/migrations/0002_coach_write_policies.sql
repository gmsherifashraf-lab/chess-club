-- =============================================================
-- Coach write access for attendance and participations
--
-- Additive on top of 0001 — safe to run on an existing schema.
-- Adds policies that let users with role 'coach' (in user_roles)
-- insert/update/delete rows on attendance and participations,
-- alongside the existing admin-only write policy.
--
-- SELECT remains unchanged: any authenticated user can read.
-- =============================================================

-- Helper: is the current user a coach?
create or replace function public.is_coach()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('coach');
$$;

revoke all     on function public.is_coach() from public;
grant  execute on function public.is_coach() to authenticated;

-- ── attendance ────────────────────────────────────────────────
drop policy if exists "attendance: coach writes" on public.attendance;
create policy "attendance: coach writes"
  on public.attendance for all
  to authenticated
  using (public.is_coach())
  with check (public.is_coach());

-- ── participations ────────────────────────────────────────────
drop policy if exists "participations: coach writes" on public.participations;
create policy "participations: coach writes"
  on public.participations for all
  to authenticated
  using (public.is_coach())
  with check (public.is_coach());

-- Note: admins also retain write access through the
-- "<table>: write" policies created in 0001 — Postgres treats
-- multiple permissive policies as OR'ed.
