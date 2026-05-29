import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { LOCALES, isLocale, splitLocale } from "@/lib/i18n";

/**
 * Locale segment layout. Validates the `[locale]` param, and emits
 * per-locale metadata: hreflang `alternates` (so Google serves the right
 * language) and the matching Open Graph locale. `<html lang dir>` itself
 * is rendered by the root layout from the `x-locale` header.
 */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const pathname = (await headers()).get("x-pathname") ?? `/${locale}`;
  const rest = splitLocale(pathname).rest;
  const path = rest === "/" ? "" : rest;

  return {
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        "en-AE": `/en${path}`,
        "ar-AE": `/ar${path}`,
        "x-default": `/en${path}`,
      },
    },
    openGraph: {
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      alternateLocale: locale === "ar" ? "en_AE" : "ar_AE",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return children;
}
