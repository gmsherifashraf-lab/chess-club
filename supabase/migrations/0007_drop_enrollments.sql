-- =============================================================
-- Drop the public enrollments / academy flow
--
-- The academy enrollment page was never linked from the site and
-- the club has no academy intake. Removing the table also drops its
-- RLS policies, indexes, the set_updated_at_enrollments trigger, and
-- the anon INSERT grant. The shared public.set_updated_at() function
-- is intentionally left in place — profiles, tasks, submissions, and
-- gallery_images still use it.
-- =============================================================

drop table if exists public.enrollments cascade;
