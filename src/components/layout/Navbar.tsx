"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { EASE_EMPHASIS } from "@/lib/motion";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { ROLE_DASHBOARD, DEFAULT_DASHBOARD } from "@/lib/auth";
import Logo from "@/components/brand/Logo";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Item = {
  href: string;
  ar: string;
  en: string;
  children?: { href: string; ar: string; en: string }[];
};

const NAV: Item[] = [
  { href: "/", ar: "الرئيسية", en: "Home" },
  {
    href: "/about",
    ar: "عن النادي",
    en: "About",
    children: [
      { href: "/about", ar: "نبذة عن النادي", en: "About the Club" },
      { href: "/register", ar: "التسجيل في النادي", en: "Register with the Club" },
    ],
  },
  { href: "/news", ar: "الأخبار", en: "News" },
  { href: "/tournaments", ar: "البطولات", en: "Tournaments" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, role } = useAuth();
  const { lang, toggle } = useLang();
  const reduce = useReducedMotion();

  const [open, setOpen] = useState(false); // mobile drawer
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<string | null>(null); // open dropdown key
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close transient UI on route change
  useEffect(() => {
    setOpen(false);
    setMenu(null);
  }, [pathname]);

  // Escape closes dropdown + drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const dashboardHref = (role && ROLE_DASHBOARD[role]) || DEFAULT_DASHBOARD;
  const isHome = pathname === "/";

  // Solid bar when scrolled, off-home, or drawer open. Otherwise the
  // bar floats transparently over the dark hero with light type.
  const solid = scrolled || !isHome || open;

  const dur = reduce ? 0 : 0.45;

  const openMenu = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(key);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(null), 140);
  };

  return (
    <>
      {/* Accessibility: skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-forest-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        <span className="ar">تخطَّ إلى المحتوى</span>
        <span className="en">Skip to content</span>
      </a>

      <motion.header
        initial={false}
        animate={{
          backgroundColor: solid ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0)",
        }}
        transition={{ duration: dur, ease: EASE_EMPHASIS }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-shadow duration-500",
          solid
            ? "border-b border-line shadow-sm backdrop-blur-xl"
            : "border-b border-white/10",
        )}
      >
        {/* Flag hairline — only on the solid bar (the hero owns its own
            flag line when the bar is transparent over it). */}
        {solid && (
          <div className="h-[3px] w-full bg-[linear-gradient(90deg,#C8102E_33.3%,#fff_33.3%_66.6%,#117A4F_66.6%)]" />
        )}

        <div className="mx-auto flex h-20 max-w-wrap items-center justify-between gap-4 px-5 sm:px-8 lg:gap-10 lg:px-10">
          {/* ── Logo + wordmark ─────────────────────────────────────── */}
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3.5 lg:gap-4"
            aria-label="Chess & Culture Club for Women, Sharjah — home"
          >
            <Logo size={56} tone={solid ? "natural" : "white"} />
            <span className="hidden min-w-0 flex-col leading-none sm:flex">
              <span
                className={cn(
                  "font-disp text-[1.05rem] font-bold tracking-tight lg:text-[1.22rem]",
                  solid ? "text-text-1" : "text-white",
                )}
              >
                <span className="ar">نادي الشطرنج والثقافة للفتيات</span>
                <span className="en">Chess &amp; Culture Club for Women</span>
              </span>
              <span
                className={cn(
                  "mt-1.5 text-[0.6rem] font-bold uppercase tracking-[0.26em]",
                  solid ? "text-forest-700" : "text-white/70",
                )}
              >
                <span className="ar">الشارقة • تأسس 1991</span>
                <span className="en">Sharjah · Est. 1991</span>
              </span>
            </span>
          </Link>

          {/* ── Desktop nav ─────────────────────────────────────────── */}
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Primary"
          >
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              if (item.children) {
                const isOpen = menu === item.href;
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => openMenu(item.href)}
                    onMouseLeave={scheduleClose}
                    onFocus={() => openMenu(item.href)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node))
                        scheduleClose();
                    }}
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      onClick={() => setMenu(isOpen ? null : item.href)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-4 py-2 text-[0.95rem] font-medium tracking-wide transition-colors",
                        solid
                          ? active || isOpen
                            ? "text-forest-700"
                            : "text-text-2 hover:text-forest-700"
                          : active || isOpen
                            ? "text-white"
                            : "text-white/80 hover:text-white",
                      )}
                    >
                      <span className="ar">{item.ar}</span>
                      <span className="en">{item.en}</span>
                      <svg
                        aria-hidden
                        viewBox="0 0 10 6"
                        className={cn(
                          "h-1.5 w-2.5 transition-transform duration-300",
                          isOpen && "rotate-180",
                        )}
                      >
                        <path
                          d="M1 1l4 4 4-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{
                            duration: reduce ? 0 : 0.22,
                            ease: EASE_EMPHASIS,
                          }}
                          role="menu"
                          className="absolute start-0 top-full min-w-60 overflow-hidden border border-line bg-white py-2 shadow-feature"
                        >
                          {item.children.map((c) => (
                            <Link
                              key={c.href + c.en}
                              href={c.href}
                              role="menuitem"
                              className="block px-5 py-3 text-[0.9rem] font-medium text-text-2 transition-colors hover:bg-forest-50 hover:text-forest-700 focus-visible:bg-forest-50 focus-visible:text-forest-700 focus-visible:outline-none"
                            >
                              <span className="ar">{c.ar}</span>
                              <span className="en">{c.en}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-[0.95rem] font-medium tracking-wide transition-colors",
                    solid
                      ? active
                        ? "text-forest-700"
                        : "text-text-2 hover:text-forest-700"
                      : active
                        ? "text-white"
                        : "text-white/80 hover:text-white",
                  )}
                >
                  <span className="ar">{item.ar}</span>
                  <span className="en">{item.en}</span>
                  <motion.span
                    initial={false}
                    animate={{ scaleX: active ? 1 : 0 }}
                    transition={{ duration: reduce ? 0 : 0.35, ease: EASE_EMPHASIS }}
                    className={cn(
                      "absolute inset-x-4 -bottom-0.5 h-[2px] origin-left rtl:origin-right",
                      solid ? "bg-forest-700" : "bg-white",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* ── Right cluster ───────────────────────────────────────── */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={toggle}
              aria-label={
                lang === "ar" ? "Switch to English" : "التبديل إلى العربية"
              }
              className={cn(
                "hidden h-10 min-w-[2.75rem] items-center justify-center border px-3 text-[0.8rem] font-bold tracking-wider transition-colors sm:inline-flex",
                solid
                  ? "border-text-1/25 text-text-1 hover:bg-text-1 hover:text-white"
                  : "border-white/30 text-white hover:bg-white hover:text-text-1",
              )}
            >
              {lang === "ar" ? "EN" : "ع"}
            </button>

            {user ? (
              <Link
                href={dashboardHref}
                className={cn(
                  buttonVariants({
                    variant: solid ? "primary" : "light",
                    size: "sm",
                  }),
                  "hidden sm:inline-flex",
                )}
              >
                <span className="ar">حسابي</span>
                <span className="en">My Account</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    "hidden h-10 items-center px-4 text-[0.85rem] font-semibold tracking-wide transition-colors sm:inline-flex",
                    solid
                      ? "text-text-2 hover:text-forest-700"
                      : "text-white/85 hover:text-white",
                  )}
                >
                  <span className="ar">دخول</span>
                  <span className="en">Login</span>
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({
                      variant: solid ? "primary" : "light",
                      size: "sm",
                    }),
                  )}
                >
                  <span className="ar">انضمي إلينا</span>
                  <span className="en">Join the Club</span>
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={cn(
                "inline-flex h-11 w-11 flex-col items-center justify-center gap-[5px] border transition-colors md:hidden",
                solid
                  ? "border-text-1/25 hover:border-text-1"
                  : "border-white/30 hover:border-white",
              )}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "block h-[2px] w-5 transition-transform duration-300",
                    solid ? "bg-text-1" : "bg-white",
                    open && i === 0 && "translate-y-[7px] rotate-45",
                    open && i === 1 && "opacity-0",
                    open && i === 2 && "-translate-y-[7px] -rotate-45",
                  )}
                />
              ))}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            className="overscroll-contain fixed inset-0 top-20 z-40 overflow-y-auto bg-white md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <motion.nav
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{
                duration: reduce ? 0 : 0.35,
                ease: EASE_EMPHASIS,
                delay: reduce ? 0 : 0.05,
              }}
              className="safe-b mx-auto flex max-w-wrap flex-col gap-1 p-6 pb-16 sm:p-8"
              aria-label="Mobile"
            >
              {NAV.flatMap((item) =>
                item.children
                  ? [
                      { ...item, _h: true },
                      ...item.children.map((c) => ({ ...c, _sub: true })),
                    ]
                  : [item],
              ).map((l: Item & { _h?: boolean; _sub?: boolean }, i) => {
                const active =
                  l.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(l.href);
                if (l._h) {
                  return (
                    <div
                      key={"h" + l.href}
                      className="mt-4 px-2 pb-1 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-text-4"
                    >
                      <span className="ar">{l.ar}</span>
                      <span className="en">{l.en}</span>
                    </div>
                  );
                }
                return (
                  <motion.div
                    key={l.href + (l._sub ? "s" : "")}
                    initial={{ x: -14, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: reduce ? 0 : 0.3,
                      delay: reduce ? 0 : 0.08 + i * 0.04,
                    }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block border-b border-line py-4 font-disp transition-colors",
                        l._sub ? "ps-5 text-[1.1rem]" : "text-[1.4rem]",
                        active
                          ? "text-forest-700"
                          : "text-text-1 hover:text-forest-700",
                      )}
                    >
                      <span className="ar">{l.ar}</span>
                      <span className="en">{l.en}</span>
                    </Link>
                  </motion.div>
                );
              })}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    toggle();
                    setOpen(false);
                  }}
                  className="border border-text-1/25 px-4 py-2.5 text-[0.8rem] font-bold tracking-wider text-text-1"
                >
                  {lang === "ar" ? "English" : "العربية"}
                </button>
                {!user && (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="border border-text-1/25 px-5 py-2.5 text-[0.85rem] font-semibold tracking-wide text-text-1"
                  >
                    <span className="ar">دخول</span>
                    <span className="en">Login</span>
                  </Link>
                )}
                <Link
                  href={user ? dashboardHref : "/register"}
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
                >
                  <span className="ar">{user ? "حسابي" : "انضمي إلينا"}</span>
                  <span className="en">{user ? "My Account" : "Join the Club"}</span>
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
