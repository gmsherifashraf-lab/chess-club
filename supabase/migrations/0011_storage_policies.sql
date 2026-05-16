-- =============================================================================
-- 0011_storage_policies.sql
--
-- Storage for player submission files + coach training material.
-- Buckets are PUBLIC (world-readable via the public object URL, so the
-- existing link-rendering in the dashboards needs no change) with
-- unguessable uuid object keys. Acceptable for club coursework; can be
-- hardened to private + signed URLs later.
--
-- The buckets are also created at runtime via the service-role API; the
-- insert below is the idempotent source-of-truth for fresh environments.
-- The INSERT/UPDATE policies are REQUIRED — storage.objects has RLS on by
-- default, so without them authenticated uploads fail.
--
-- Apply any time (independent of 0007-0010).
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit)
values ('submissions',       'submissions',       true, 10485760),
       ('training-material', 'training-material', true, 10485760)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit;

-- Public read needs no SELECT policy (served via the public URL).
-- Any authenticated club user may upload / replace objects in these
-- two buckets only.
drop policy if exists "club uploads: insert" on storage.objects;
create policy "club uploads: insert" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('submissions', 'training-material'));

drop policy if exists "club uploads: update" on storage.objects;
create policy "club uploads: update" on storage.objects
  for update to authenticated
  using      (bucket_id in ('submissions', 'training-material'))
  with check (bucket_id in ('submissions', 'training-material'));
