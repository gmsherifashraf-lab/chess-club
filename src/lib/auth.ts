import type { SupabaseClient } from "@supabase/supabase-js";

// ─── ROLE SYSTEM ─────────────────────────────────────────────────────────────
// Three roles only: admin (super-admin), coach, player.
// Stored in `public.profiles.role` and mirrored into
// auth.users.raw_user_meta_data.role by a trigger so middleware can
// read it from the JWT without a DB round-trip.
export type UserRole = "admin" | "coach" | "player";

export const ROLE_DASHBOARD: Record<UserRole, string> = {
  admin:  "/dashboard/admin",
  coach:  "/dashboard/coach",
  player: "/dashboard/player",
};

export const DEFAULT_DASHBOARD = "/dashboard/player";

export const ROLE_LABEL: Record<UserRole, { ar: string; en: string }> = {
  admin:  { ar: "مدير النظام", en: "Administrator" },
  coach:  { ar: "المدرب",      en: "Coach"         },
  player: { ar: "اللاعب",       en: "Player"        },
};

export const ROLE_COLOR: Record<UserRole, string> = {
  admin:  "#D42B3C",
  coach:  "#007A38",
  player: "#A07820",
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
  // to JWT metadata, then to 'player' default.
  let role: UserRole = (data.user?.user_metadata?.role ?? "player") as UserRole;

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
  return (user?.user_metadata?.role ?? "player") as UserRole;
}
