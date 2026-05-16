import type { SupabaseClient } from "@supabase/supabase-js";

// ─── ROLE SYSTEM ─────────────────────────────────────────────────────────────
// Four roles: admin (super-admin), coach, editor, parent.
// Stored in `public.profiles.role` and mirrored into
// auth.users.raw_user_meta_data.role by a trigger so middleware can
// read it from the JWT without a DB round-trip.
//
// `player` is RETIRED. The DB enum still carries the value (it cannot be
// dropped safely), but the app never routes there: any legacy `player`
// (or unknown) value is normalised to `parent`. See normaliseRole() in
// AuthContext.tsx and middleware.ts, and migration 0007.
// Five live roles. Accounts are ADMIN-created only (public signup is
// disabled); every player MUST be linked to a parent (enforced by the
// admin account-creation flow + parent_player_relationships).
export type UserRole = "admin" | "editor" | "coach" | "player" | "parent";

export const ALL_ROLES: UserRole[] = [
  "admin",
  "editor",
  "coach",
  "player",
  "parent",
];

export const ROLE_DASHBOARD: Record<UserRole, string> = {
  admin:  "/dashboard/admin",
  editor: "/dashboard/editor",
  coach:  "/dashboard/coach",
  player: "/dashboard/player",
  parent: "/dashboard/parent",
};

export const DEFAULT_DASHBOARD = "/dashboard/player";

export const ROLE_LABEL: Record<UserRole, { ar: string; en: string }> = {
  admin:  { ar: "مدير النظام",   en: "Administrator" },
  editor: { ar: "محرّرة المحتوى", en: "Editor"        },
  coach:  { ar: "المدرّبة",       en: "Coach"         },
  player: { ar: "اللاعبة",        en: "Player"        },
  parent: { ar: "وليّة الأمر",    en: "Parent"        },
};

export const ROLE_COLOR: Record<UserRole, string> = {
  admin:  "#C8102E",
  editor: "#117A4F",
  coach:  "#0A5234",
  player: "#1F6B4F",
  parent: "#1F1F1F",
};

// ─── SIGN UP ──────────────────────────────────────────────────────────────────
export interface SignUpParams {
  email:    string;
  password: string;
  role:     UserRole;
  fullName: string;
}

export interface AuthResult {
  error: string | null;
}

export async function signUp(
  supabase: SupabaseClient,
  { email, password, role, fullName }: SignUpParams
): Promise<AuthResult> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  });

  if (error) return { error: error.message };
  return { error: null };
}

// ─── SIGN IN ──────────────────────────────────────────────────────────────────
export interface SignInParams {
  email:    string;
  password: string;
}

export interface SignInResult {
  error:     string | null;
  dashboard: string | null;
}

export async function signIn(
  supabase: SupabaseClient,
  { email, password }: SignInParams
): Promise<SignInResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message, dashboard: null };

  // Prefer the role from the freshest source: profiles row. Fall back
  // to JWT metadata, then to the 'parent' default.
  let role: UserRole = (data.user?.user_metadata?.role ?? "parent") as UserRole;

  try {
    if (data.user?.id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();
      if (profile?.role) role = profile.role as UserRole;
    }
  } catch {
    /* ignore — fall back to metadata */
  }

  const dashboard = ROLE_DASHBOARD[role] ?? DEFAULT_DASHBOARD;
  return { error: null, dashboard };
}

// ─── SIGN OUT ─────────────────────────────────────────────────────────────────
export async function signOut(supabase: SupabaseClient): Promise<void> {
  await supabase.auth.signOut();
}

// ─── GET SESSION (server-side) ────────────────────────────────────────────────
export async function getSession(supabase: SupabaseClient) {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ─── GET USER ROLE (server-side helper) ──────────────────────────────────────
export async function getUserRole(supabase: SupabaseClient): Promise<UserRole> {
  const { data: { user } } = await supabase.auth.getUser();
  return (user?.user_metadata?.role ?? "parent") as UserRole;
}
