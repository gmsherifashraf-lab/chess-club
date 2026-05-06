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
  const response = NextResponse.next({ request });

  // IMPORTANT — call supabase.auth.getUser() (NOT getSession()) so the JWT
  // is validated and any auth cookies on the response are refreshed in one
  // call. With @supabase/ssr ≥0.5 this is the only supported middleware
  // pattern; getSession() can return stale data and won't trigger cookie
  // rotation, which is what was causing the post-sign-in /login redirect
  // loop on Vercel.
  const supabase = createMiddlewareClient(request, response);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  // ── Not logged in → redirect to /login ──────────────────────────────────
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // ── Logged in → don't show /login or /register ──────────────────────────
  if (isAuthRoute && user) {
    const role = (user.user_metadata?.role ?? "parent") as UserRole;
    const dashboard = ROLE_DASHBOARD[role] ?? DEFAULT_DASHBOARD;
    const url = request.nextUrl.clone();
    url.pathname = dashboard;
    return NextResponse.redirect(url);
  }

  // ── Wrong dashboard role → redirect to correct one ──────────────────────
  if (user && pathname.startsWith("/dashboard")) {
    const role = (user.user_metadata?.role ?? "parent") as UserRole;
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
     *  - _next/static  (Next.js assets)
     *  - _next/image   (image optimizer)
     *  - favicon.ico
     *  - public files  (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
