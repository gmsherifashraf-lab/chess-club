"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLang } from "@/context/LangContext";
import { localeHref } from "@/lib/i18n";

/**
 * Locale-aware `next/link`. Prefixes the active locale (`/en`, `/ar`) onto
 * links that target localized public routes, and passes app/auth routes
 * (`/login`, `/dashboard`, …) through untouched. Lets server components
 * render internal links without resolving the locale themselves.
 */
type LocaleLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const { lang } = useLang();
  return <Link href={localeHref(lang, href)} {...props} />;
}
