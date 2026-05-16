-- ============================================================================
-- 0007_roles_editor_parent.sql
--
-- Adds the `editor` and `parent` roles to the system.
--
-- This migration is INTENTIONALLY ADDITIVE and non-destructive:
--   * Postgres cannot safely DROP an enum value that is still referenced
--     by columns / RLS policies / existing rows, so the legacy `player`
--     value is LEFT IN PLACE. The application layer no longer routes new
--     users to it (see src/lib/auth.ts) and treats any legacy `player`
--     row as `parent`.
--   * No RLS policies are rewritten here. `editor` and `parent` therefore
--     have NO table grants yet (deny-by-default) until their dashboard
--     scope is defined. They can authenticate and reach a holding
--     workspace, but cannot read/write club data.
--
-- ⚠ ALTER TYPE ... ADD VALUE cannot run inside a transaction block on
--   PostgreSQL < 12 mixed with later use. Supabase (PG 15+) allows it,
--   but if your runner wraps migrations in a txn, apply the ADD VALUE
--   statements separately/first.
-- ============================================================================

ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'parent';

-- Re-point the signup trigger default away from the retired `player`
-- role. New auth users without an explicit role become `parent`.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  signup_role public.app_role;
BEGIN
  BEGIN
    signup_role := coalesce(
      (new.raw_user_meta_data ->> 'role')::public.app_role,
      'parent'
    );
  EXCEPTION WHEN others THEN
    signup_role := 'parent';
  END;

  INSERT INTO public.profiles (id, role)
  VALUES (new.id, signup_role)
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;
