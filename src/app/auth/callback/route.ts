import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ROLE_DASHBOARD, DEFAULT_DASHBOARD, type UserRole } from "@/lib/auth";

/**
 * GET /auth/callback
 *
 * Supabase redirects here after:
 *  - Email confirmation (sign-up)
 *  - Magic-link sign-in
 *  - Password-reset links
 *
 * Exchanges the `code` parameter for a session, then redirects to
 * the role's dashboard (or to a "next" path if one was supplied).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    console.error("[auth/callback] exchangeCodeForSession error:", error?.message);
    return NextResponse.redirect(`${origin}/login?error=session_exchange_failed`);
  }

  // Resolve role from profiles (canonical source); fall back to JWT meta.
  let role: UserRole = "player";
  const meta = data.session.user.user_metadata?.role;
  if (meta === "admin" || meta === "coach" || meta === "player") role = meta;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.session.user.id)
    .maybeSingle();
  if (profile?.role === "admin" || profile?.role === "coach" || profile?.role === "player") {
    role = profile.role;
  }

  const dashboard = ROLE_DASHBOARD[role] ?? DEFAULT_DASHBOARD;

  const redirectTo =
    next && next.startsWith("/") && !next.startsWith("//")
      ? next
      : dashboard;

  return NextResponse.redirect(`${origin}${redirectTo}`);
}
