"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { LOGO_URI } from "@/lib/logo";
import { ROLE_DASHBOARD, DEFAULT_DASHBOARD } from "@/lib/auth";

const LINKS = [
  { href: "/",            ar: "الرئيسية",   en: "Home"        },
  { href: "/news",        ar: "الأخبار",     en: "News"        },
  { href: "/tournaments", ar: "البطولات",    en: "Tournaments" },
  { href: "/about",       ar: "من نحن",       en: "About"       },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, role } = useAuth();
  const { lang, toggle } = useLang();
  const [open, setOpen] = useState(false);

  const dashboardHref = (role && ROLE_DASHBOARD[role]) || DEFAULT_DASHBOARD;

  return (
    <header className="sticky top-0 z-50 bg-ivory/85 backdrop-blur-md border-b border-stone shadow-[0_1px_0_rgba(20,20,20,0.02)]">
      <div className="h-[3px] w-full bg-gradient-to-r from-red via-white to-green2" />

      <div className="max-w-wrap mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src={LOGO_URI}
              alt="Logo"
              className="h-9 w-auto transition-transform group-hover:scale-105"
            />
            <span className="font-disp text-[0.85rem] leading-tight text-ink hidden sm:inline">
              <span className="ar">نادي الشطرنج والثقافة</span>
              <span className="en">Chess &amp; Culture Club</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative text-[0.85rem] tracking-wide transition-colors ${
                    active ? "text-red" : "text-ink hover:text-red"
                  }`}
                >
                  <span className="ar">{l.ar}</span>
                  <span className="en">{l.en}</span>
                  <span
                    className={`absolute -bottom-1.5 left-0 right-0 mx-auto h-[2px] bg-red transition-all ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggle}
              aria-label="Toggle language"
              className="hidden sm:inline-flex items-center justify-center min-w-[2.25rem] h-8 px-2 text-[0.7rem] font-semibold tracking-wider border border-stone text-ink hover:bg-ink hover:text-ivory transition-colors"
            >
              {lang === "ar" ? "EN" : "ع"}
            </button>

            {user ? (
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-1.5 h-9 px-4 text-[0.78rem] font-semibold tracking-wide bg-red text-white hover:bg-red-dk transition-all hover:shadow-[0_8px_24px_rgba(212,43,60,0.35)]"
              >
                <span className="ar">حسابي</span>
                <span className="en">Profile</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 h-9 px-4 text-[0.78rem] font-semibold tracking-wide bg-red text-white hover:bg-red-dk transition-all hover:shadow-[0_8px_24px_rgba(212,43,60,0.35)]"
              >
                <span className="ar">دخول</span>
                <span className="en">Login</span>
              </Link>
            )}

            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Open menu"
              className="md:hidden inline-flex flex-col justify-center items-center w-9 h-9 gap-[5px] border border-stone"
            >
              <span className={`block w-4 h-[1.5px] bg-ink transition-transform ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
              <span className={`block w-4 h-[1.5px] bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`block w-4 h-[1.5px] bg-ink transition-transform ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {open && (
          <nav className="md:hidden pb-4 flex flex-col gap-1 border-t border-stone pt-3">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2.5 text-[0.9rem] border-l-2 ${
                    active ? "border-red text-red bg-red/5" : "border-transparent text-ink hover:bg-stone/30"
                  }`}
                >
                  <span className="ar">{l.ar}</span>
                  <span className="en">{l.en}</span>
                </Link>
              );
            })}
            <button
              onClick={() => { toggle(); setOpen(false); }}
              className="mt-2 self-start text-[0.72rem] tracking-wider px-3 py-1.5 border border-stone text-ink"
            >
              {lang === "ar" ? "EN" : "العربية"}
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
