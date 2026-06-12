-- =============================================================================
-- 0019_realtime.sql
-- Add the realtime-driven tables to the supabase_realtime publication so the
-- in-app notification bell (postgres_changes on notifications, recipient-scoped)
-- and rating charts update live. The classroom tables are added in 0017.
-- Wrapped so it is idempotent and never fails if the publication is missing.
-- =============================================================================

do $$
declare t text;
begin
  foreach t in array array[
    'public.notifications',
    'public.rating_events'
  ] loop
    begin
      execute format('alter publication supabase_realtime add table %s', t);
    exception
      when duplicate_object then null;   -- already in the publication
      when undefined_object then null;   -- supabase_realtime publication absent
      when undefined_table  then null;   -- table not created yet
    end;
  end loop;
end $$;
