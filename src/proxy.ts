import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";
import { ROLE_DASHBOARD, DEFAULT_DASHBOARD, type UserRole } from "@/lib/auth";
import {
  DEFAULT_LOCALE,
  LOCALIZED_SEGMENTS,
  isLocale,
  type Locale,
} from "@/lib/i18n";

// Routes that require the user to be logged in
const PROTECTED_PREFIXES = ["/dashboard"];

// Routes the logged-in user should not see (auth pages).
// /register is a public club-registration form (no account), so it is
// intentionally NOT listed — anyone, signed in or not, may open it.
const AUTH_ROUTES = ["/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Locale resolution ───────────────────────────────────────────────────
  // Public marketing pages live under /[locale]. App surfaces (/dashboard,
  // /login, /auth, /api) are intentionally not localized.
  const firstSegment = pathname.split("/")[1] ?? "";
  const pathLocale: Locale | null = isLocale(firstSegment) ? firstSegment : null;
  const cookieValue = request.cookies.get("locale")?.value;
  const cookieLocale: Locale | null = isLocale(cookieValue) ? cookieValue : null;
  // Manual + remembered only — the browser's Accept-Language is never used.
  const preferredLocale: Locale = cookieLocale ?? DEFAULT_LOCALE;

  // ── Locale redirects ────────────────────────────────────────────────────
  if (!pathLocale) {
    // Bare root → the visitor's remembered locale (or the default).
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = `/${preferredLocale}`;
      return NextResponse.redirect(url);
    }
    // Legacy un-prefixed public link → the same page under a locale.
    if ((LOCALIZED_SEGMENTS as readonly string[]).includes(firstSegment)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${preferredLocale}${pathname}`;
      return NextResponse.redirect(url);
    }
  }

  const currentLocale: Locale = pathLocale ?? preferredLocale;

  // Create a response we can mutate to refresh session cookies. The locale
  // headers let the root layout server-render <html lang dir> and let
  // [locale]/layout build per-page hreflang.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", currentLocale);
  requestHeaders.set("x-pathname", pathname);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Persist the locale when it was chosen via the URL.
  if (pathLocale && pathLocale !== cookieLocale) {
    response.cookies.set("locale", pathLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

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
      console.error("proxy getUser:", msg);
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

  // ── Logged in → don't show /login ───────────────────────────────────────
  if (isAuthRoute && user) {
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
// may still carry role='player' or 'board' in their JWT until profile
// sync runs; treat them as 'parent' so they land on a valid dashboard.
function normaliseRole(raw: unknown): UserRole {
  if (
    raw === "admin" ||
    raw === "editor" ||
    raw === "coach" ||
    raw === "player" ||
    raw === "parent"
  )
    return raw;
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
