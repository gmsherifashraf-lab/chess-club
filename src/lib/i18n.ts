/**
 * i18n core — URL-based locale routing for the public marketing site.
 *
 * Public pages live under `/[locale]/…` (`/en`, `/ar`). App surfaces
 * (`/dashboard`, `/login`, `/auth`, `/api`) are intentionally NOT
 * localized — they stay unprefixed. The bilingual rendering itself is
 * still the `.ar` / `.en` span + CSS system; the locale here only drives
 * the server-rendered `<html lang dir>` and which URL the visitor is on.
 */

export const LOCALES = ["en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Public route segments that are moved under the `[locale]` segment. */
export const LOCALIZED_SEGMENTS = [
  "about",
  "board",
  "achievements",
  "events",
  "calendar",
  "tournaments",
  "news",
  "gallery",
  "media",
  "contact",
  "register",
] as const;

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "ar";
}

export function dirOf(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

/**
 * Split a pathname into its locale prefix and the remainder.
 * `/ar/news` → `{ locale: "ar", rest: "/news" }`
 * `/dashboard` → `{ locale: null, rest: "/dashboard" }`
 */
export function splitLocale(pathname: string): {
  locale: Locale | null;
  rest: string;
} {
  const match = pathname.match(/^\/(en|ar)(\/.*)?$/);
  if (match) return { locale: match[1] as Locale, rest: match[2] || "/" };
  return { locale: null, rest: pathname };
}

/**
 * Prefix an app-relative path with a locale.
 * `withLocale("ar", "/news")` → `/ar/news` · `withLocale("en", "/")` → `/en`
 */
export function withLocale(locale: Locale, path: string): string {
  const clean = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/** Re-point a pathname at a different locale, keeping the rest of the path. */
export function swapLocale(pathname: string, locale: Locale): string {
  return withLocale(locale, splitLocale(pathname).rest);
}

/**
 * Prefix a link only if it targets a localized public page. App/auth
 * surfaces (`/login`, `/dashboard`, …) and unknown paths pass through
 * untouched. Safe to call on any internal href.
 */
export function localeHref(locale: Locale, path: string): string {
  if (path === "/") return withLocale(locale, "/");
  const segment = path.split("/")[1] ?? "";
  return (LOCALIZED_SEGMENTS as readonly string[]).includes(segment)
    ? withLocale(locale, path)
    : path;
}
