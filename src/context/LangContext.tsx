"use client";
import React, { createContext, useContext, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { type Locale, dirOf, splitLocale, swapLocale } from "@/lib/i18n";

interface LangCtx {
  lang: Locale;
  dir: "rtl" | "ltr";
  toggle: () => void;
}

const Ctx = createContext<LangCtx>({ lang: "en", dir: "ltr", toggle: () => {} });

/**
 * Language state is driven by the URL locale (`/en`, `/ar`). The server
 * resolves an initial value and passes it as `lang`; on a localized route
 * the live value is read from the pathname so client-side navigation
 * between locales updates direction without a full reload. `toggle`
 * navigates to the same page in the other locale.
 */
export function LangProvider({
  lang: serverLang,
  children,
}: {
  lang: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // On `/en` | `/ar` the URL is authoritative; on un-prefixed routes
  // (dashboard, login) fall back to the server-resolved value.
  const lang: Locale = splitLocale(pathname).locale ?? serverLang;

  // The server already renders <html lang dir> correctly on a hard load;
  // this keeps it in sync after a client-side locale switch.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dirOf(lang);
  }, [lang]);

  const toggle = useCallback(() => {
    const next: Locale = lang === "ar" ? "en" : "ar";
    // Remember the choice — used for un-prefixed routes and the `/` redirect.
    document.cookie = `locale=${next};path=/;max-age=31536000;samesite=lax`;
    if (splitLocale(pathname).locale) {
      router.push(swapLocale(pathname, next));
    } else {
      router.refresh();
    }
  }, [lang, pathname, router]);

  return (
    <Ctx.Provider value={{ lang, dir: dirOf(lang), toggle }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLang = () => useContext(Ctx);
