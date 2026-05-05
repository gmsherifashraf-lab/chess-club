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
    <header className="sticky top-0 z-50 bg-ivory/90 backdrop-blur-md border-b border-stone">
      <div className="h-[3px] w-full bg-gradient-to-r from-red via-white to-green2" />

      <div className="max-w-wrap mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-6 h-20">
          {/* Logo + Club Name (large + prominent) */}
          <Link href="/" className="flex items-center gap-3 group min-w-0">
            <img
              src={LOGO_URI}
              alt="Logo"
              className="h-11 w-auto transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:flex flex-col leading-none min-w-0">
              <span className="font-disp text-[1.15rem] lg:text-[1.35rem] font-bold text-ink truncate tracking-tight">
                <span className="ar">نادي الشطرنج والثقافة</span>
                <span className="en">Chess &amp; Culture Club</span>
              </span>
              <span className="text-[0.62rem] uppercase tracking-[0.22em] text-red font-semibold mt-1.5">
                <span className="ar">الشارقة • منذ 2017</span>
                <span className="en">Sharjah · Since 2017</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative text-[0.95rem] font-medium tracking-wide transition-colors ${
                    active ? "text-red" : "text-ink hover:text-red"
                  }`}
                >
                  <span className="ar">{l.ar}</span>
                  <span className="en">{l.en}</span>
                  <span
                    className={`absolute -bottom-2 left-0 h-[2px] bg-red transition-all ${
                      active ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggle}
              aria-label="Toggle language"
              className="hidden sm:inline-flex items-center justify-center min-w-[2.5rem] h-9 px-2.5 text-[0.78rem] font-semibold tracking-wider border border-stone text-ink hover:bg-ink hover:text-ivory transition-colors"
            >
              {lang === "ar" ? "EN" : "ع"}
            </button>

            {user ? (
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-1.5 h-10 px-5 text-[0.85rem] font-semibold tracking-wide bg-red text-white hover:bg-red-dk transition-all hover:shadow-[0_8px_24px_rgba(212,43,60,0.4)]"
              >
                <span className="ar">حسابي</span>
                <span className="en">My Account</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center gap-1.5 h-10 px-5 text-[0.85rem] font-semibold tracking-wide border border-ink text-ink hover:bg-ink hover:text-ivory transition-colors"
                >
                  <span className="ar">دخول</span>
                  <span className="en">Login</span>
                </Link>
                <Link
                  href="/register/academy"
                  className="inline-flex items-center gap-1.5 h-10 px-5 text-[0.85rem] font-semibold tracking-wide bg-red text-white hover:bg-red-dk transition-all hover:shadow-[0_8px_24px_rgba(212,43,60,0.4)]"
                >
                  <span className="ar">انضمي للنادي</span>
                  <span className="en">Join Club</span>
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Open menu"
              className="md:hidden inline-flex flex-col justify-center items-center w-10 h-10 gap-[5px] border border-stone"
            >
              <span className={`block w-5 h-[2px] bg-ink transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`block w-5 h-[2px] bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-[2px] bg-ink transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <nav className="md:hidden pb-5 flex flex-col gap-1 border-t border-stone pt-4">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 text-base font-medium border-l-2 ${
                    active ? "border-red text-red bg-red/5" : "border-transparent text-ink hover:bg-stone/30"
                  }`}
                >
                  <span className="ar">{l.ar}</span>
                  <span className="en">{l.en}</span>
                </Link>
              );
            })}
            <div className="flex items-center gap-3 mt-3 px-4">
              <button
                onClick={() => { toggle(); setOpen(false); }}
                className="text-[0.78rem] font-semibold tracking-wider px-3 py-2 border border-stone text-ink"
              >
                {lang === "ar" ? "EN" : "العربية"}
              </button>
              {!user && (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="text-[0.85rem] font-semibold tracking-wide px-4 py-2 border border-ink text-ink"
                >
                  <span className="ar">دخول</span>
                  <span className="en">Login</span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
