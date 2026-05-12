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
  // rotation.
  const supabase = createMiddlewareClient(request, response);
  let user: Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"] = null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch (err) {
    // Stale refresh token in the browser (signed out elsewhere, project key
    // rotated, etc.) — wipe the sb-* cookies on BOTH request and response so
    // downstream Server Components see a clean cookie jar in this same
    // request, and the browser stops sending the bad cookie afterwards.
    const msg = err instanceof Error ? err.message : String(err);
    if (/refresh.*token/i.test(msg) || /invalid.*token/i.test(msg)) {
      for (const c of request.cookies.getAll()) {
        if (c.name.startsWith("sb-")) {
          request.cookies.delete(c.name);
          response.cookies.delete(c.name);
        }
      }
    } else {
      console.error("middleware getUser:", msg);
    }
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  // ── Not logged in → redirect to /login ──────────────────────────────────
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Treat /register/academy (public enrollment) as NOT an auth route — anyone
  // can submit it without an account.
  const isPureAuthRoute =
    isAuthRoute && !pathname.startsWith("/register/academy");

  // ── Logged in → don't show /login or /register ──────────────────────────
  if (isPureAuthRoute && user) {
    const role = normaliseRole(user.user_metadata?.role);
    const dashboard = ROLE_DASHBOARD[role] ?? DEFAULT_DASHBOARD;
    const url = request.nextUrl.clone();
    url.pathname = dashboard;
    return NextResponse.redirect(url);
  }

  // ── Wrong dashboard role → redirect to correct one ──────────────────────
  if (user && pathname.startsWith("/dashboard")) {
    const role = normaliseRole(user.user_metadata?.role);
    const correctDash = ROLE_DASHBOARD[role] ?? DEFAULT_DASHBOARD;

    // The /dashboard index page does its own redirect; let it through.
    if (pathname === "/dashboard") return response;

    if (!pathname.startsWith(correctDash)) {
      const url = request.nextUrl.clone();
      url.pathname = correctDash;
      return NextResponse.redirect(url);
    }
  }

  return response;
}

// Map any legacy / unknown role value to a valid UserRole. Old accounts
// still have role='parent' or 'board' in their JWT until profile sync
// runs; treat them as 'player' so they don't get stuck on the wrong page.
function normaliseRole(raw: unknown): UserRole {
  if (raw === "admin" || raw === "coach" || raw === "player") return raw;
  return "player";
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
