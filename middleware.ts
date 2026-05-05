import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";
import { ROLE_DASHBOARD, DEFAULT_DASHBOARD, type UserRole } from "@/lib/auth";

// Routes that require the user to be logged in
const PROTECTED_PREFIXES = ["/dashboard"];

// Routes the logged-in user should not see (auth pages)
const AUTH_ROUTES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create a response we can mutate to refresh session cookies
  let response = NextResponse.next({ request });

  // Attach Supabase and refresh the session cookie silently
  const supabase = createMiddlewareClient(request, response);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute  = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  // ── Not logged in → redirect to /login ──────────────────────────────────
  if (isProtected && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname); // remember where they were going
    return NextResponse.redirect(url);
  }

  // ── Logged in → don't show /login or /register ──────────────────────────
  if (isAuthRoute && session) {
    const role = (session.user.user_metadata?.role ?? "parent") as UserRole;
    const dashboard = ROLE_DASHBOARD[role] ?? DEFAULT_DASHBOARD;
    const url = request.nextUrl.clone();
    url.pathname = dashboard;
    return NextResponse.redirect(url);
  }

  // ── Wrong dashboard role → redirect to correct one ──────────────────────
  if (session && pathname.startsWith("/dashboard")) {
    const role = (session.user.user_metadata?.role ?? "parent") as UserRole;
    const correctDash = ROLE_DASHBOARD[role] ?? DEFAULT_DASHBOARD;

    if (!pathname.startsWith(correctDash)) {
      const url = request.nextUrl.clone();
      url.pathname = correctDash;
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next/static  (Next.js assets)
     * - _next/image   (image optimizer)
     * - favicon.ico
     * - public files (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
