-- =============================================================
-- Public enrollment submissions
--
-- Anyone (including anon) can submit a new row.
-- Only admins can read/update/delete; coaches can read.
--
-- Heads-up: an open INSERT policy for `anon` is the standard pattern
-- for public registration forms but it's a spam vector. Add a
-- captcha / Edge Function in front of writes before going to prod.
-- =============================================================

create table if not exists public.enrollments (
  id                uuid        primary key default gen_random_uuid(),
  child_first_name  text        not null,
  child_last_name   text        not null,
  child_dob         date,
  nationality       text,
  school            text,
  chess_level       text,                       -- beginner / intermediate / advanced
  program           text,                       -- little-queens / rising-stars / competitive / elite
  mother_name       text,
  father_name       text,
  guardian_email    text        not null,
  guardian_phone    text,
  notes             text,
  status            text        not null default 'pending'
                    check (status in ('pending', 'contacted', 'approved', 'rejected')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists enrollments_status_idx     on public.enrollments (status);
create index if not exists enrollments_created_at_idx on public.enrollments (created_at desc);

-- ── Updated-at trigger ────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at_enrollments on public.enrollments;
create trigger set_updated_at_enrollments
  before update on public.enrollments
  for each row execute function public.set_updated_at();

-- ── Row Level Security ───────────────────────────────────────
alter table public.enrollments enable row level security;

drop policy if exists "enrollments: public submit"  on public.enrollments;
drop policy if exists "enrollments: admin all"      on public.enrollments;
drop policy if exists "enrollments: coach reads"    on public.enrollments;

-- Anyone (anon or signed-in) can submit. with check(true) so the
-- policy doesn't validate row contents — keep validation in the form.
create policy "enrollments: public submit"
  on public.enrollments for insert
  to anon, authenticated
  with check (true);

-- Admins can do everything (read, update status, delete).
create policy "enrollments: admin all"
  on public.enrollments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Coaches can read but not modify.
create policy "enrollments: coach reads"
  on public.enrollments for select
  to authenticated
  using (public.is_coach());

-- ── Privileges ───────────────────────────────────────────────
-- The anon role needs INSERT on this table specifically, even though
-- RLS gates the actual write.
grant usage  on schema public                              to anon;
grant insert on public.enrollments                         to anon;
grant select, insert, update, delete on public.enrollments to authenticated;
