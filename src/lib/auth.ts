import type { SupabaseClient } from "@supabase/supabase-js";

// ─── ROLE MAPPING ─────────────────────────────────────────────────────────────
// The login page shows four role cards: admin / coach / parent / board.
// We store the chosen role in the user's metadata at sign-up so we can
// redirect them to the right dashboard after every login.
export type UserRole = "admin" | "coach" | "parent" | "board";

export const ROLE_DASHBOARD: Record<UserRole, string> = {
  admin:  "/dashboard/admin",
  coach:  "/dashboard/coach",
  parent: "/dashboard/parent",
  board:  "/dashboard/board",
};

export const DEFAULT_DASHBOARD = "/dashboard/parent";

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
  dashboard: string | null; // redirect target on success
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

  const role = (data.user?.user_metadata?.role ?? "parent") as UserRole;
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
