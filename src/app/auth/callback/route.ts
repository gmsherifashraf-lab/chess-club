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
 * We exchange the `code` parameter for a session, then redirect the user
 * to their role dashboard (or to a "next" path if one was supplied).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "";   // optional redirect override

  if (!code) {
    // No code — redirect to login with an error hint
    return NextResponse.redirect(
      `${origin}/login?error=missing_code`
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    console.error("[auth/callback] exchangeCodeForSession error:", error?.message);
    return NextResponse.redirect(
      `${origin}/login?error=session_exchange_failed`
    );
  }

  // Determine the right dashboard for this user's role
  const role      = (data.session.user.user_metadata?.role ?? "parent") as UserRole;
  const dashboard = ROLE_DASHBOARD[role] ?? DEFAULT_DASHBOARD;

  // Use the "next" param if it looks safe (starts with /), else fall back to dashboard
  const redirectTo =
    next && next.startsWith("/") && !next.startsWith("//")
      ? next
      : dashboard;

  return NextResponse.redirect(`${origin}${redirectTo}`);
}
