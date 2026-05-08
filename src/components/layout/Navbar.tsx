"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { ROLE_DASHBOARD, DEFAULT_DASHBOARD } from "@/lib/auth";
import Logo from "@/components/brand/Logo";
import { SocialRow } from "@/components/brand/SocialIcons";

const LINKS = [
  { href: "/",            ar: "الرئيسية",   en: "Home"        },
  { href: "/about",       ar: "عن النادي",   en: "About"       },
  { href: "/news",        ar: "الأخبار",     en: "News"        },
  { href: "/tournaments", ar: "البطولات",    en: "Tournaments" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, role } = useAuth();
  const { lang, toggle } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Sticky-transparent → solid black on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const dashboardHref = (role && ROLE_DASHBOARD[role]) || DEFAULT_DASHBOARD;

  return (
    <header className={`fixed top-0 inset-x-0 z-50 nav-floating ${scrolled ? "is-scrolled" : ""}`}>
      {/* UAE flag accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#C8102E] via-white to-[#1F6B4F] opacity-80" />

      <div className="max-w-wrap mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-4 lg:gap-8 h-[78px]">
          {/* Logo + Wordmark */}
          <Link href="/" className="flex items-center gap-3 lg:gap-4 group min-w-0">
            <Logo size={48} glow ring />
            <div className="hidden sm:flex flex-col leading-none min-w-0">
              <span className="font-disp text-white text-[1rem] lg:text-[1.18rem] font-bold tracking-tight">
                <span className="ar">نادي الشطرنج والثقافة للفتيات</span>
                <span className="en">Chess &amp; Culture Club for Women</span>
              </span>
              <span className="text-[0.55rem] uppercase tracking-[0.28em] text-[#1F6B4F] font-semibold mt-1.5">
                <span className="ar">الشارقة • تأسس 1991</span>
                <span className="en">Sharjah · Est. 1991</span>
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative text-[0.92rem] font-medium tracking-wide transition-colors ${
                    active ? "text-white" : "text-white/65 hover:text-white"
                  }`}
                >
                  <span className="ar">{l.ar}</span>
                  <span className="en">{l.en}</span>
                  <motion.span
                    layout
                    initial={false}
                    animate={{ scaleX: active ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                    className="absolute -bottom-2 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-[#1F6B4F] to-[#C8102E]"
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Social icons (hidden on small screens to save room) */}
            <div className="hidden lg:block">
              <SocialRow variant="light" size={16} />
            </div>

            {/* Lang toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle language"
              className="hidden sm:inline-flex items-center justify-center min-w-[2.5rem] h-9 px-2.5 text-[0.78rem] font-semibold tracking-wider border border-white/15 text-white/80 hover:bg-white hover:text-ink hover:border-white transition-colors"
            >
              {lang === "ar" ? "EN" : "ع"}
            </button>

            {/* Auth CTA */}
            {user ? (
              <Link href={dashboardHref} className="hidden sm:inline-flex items-center gap-1.5 h-10 px-5 text-[0.85rem] font-semibold tracking-wide bg-[#0B3D2E] text-white hover:bg-[#1F6B4F] transition-all hover:shadow-[0_8px_24px_rgba(31,107,79,0.45)]">
                <span className="ar">حسابي</span>
                <span className="en">My Account</span>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:inline-flex items-center gap-1.5 h-10 px-5 text-[0.85rem] font-semibold tracking-wide border border-white/20 text-white/85 hover:border-white hover:text-white transition-colors">
                  <span className="ar">دخول</span>
                  <span className="en">Login</span>
                </Link>
                <Link href="/register" className="inline-flex items-center gap-1.5 h-10 px-5 text-[0.85rem] font-semibold tracking-wide bg-[#0B3D2E] text-white hover:bg-[#1F6B4F] transition-all hover:shadow-[0_8px_24px_rgba(31,107,79,0.45)]">
                  <span className="ar">انضمي</span>
                  <span className="en">Join Club</span>
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="md:hidden inline-flex flex-col justify-center items-center w-10 h-10 gap-[5px] border border-white/20 hover:border-white transition-colors"
            >
              <span className={`block w-5 h-[2px] bg-white transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`block w-5 h-[2px] bg-white transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-[2px] bg-white transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Animated mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 top-[80px] z-40 bg-black/95 backdrop-blur-xl"
          >
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1], delay: 0.05 }}
              className="flex flex-col p-6 sm:p-8 gap-1.5 max-w-wrap mx-auto"
            >
              {LINKS.map((l, i) => {
                const active = pathname === l.href;
                return (
                  <motion.div
                    key={l.href}
                    initial={{ x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.35, delay: 0.1 + i * 0.06 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`block py-4 px-2 text-[1.45rem] font-disp border-b transition-colors ${
                        active ? "text-white border-[#1F6B4F]" : "text-white/70 border-white/8 hover:text-white"
                      }`}
                    >
                      <span className="ar">{l.ar}</span>
                      <span className="en">{l.en}</span>
                    </Link>
                  </motion.div>
                );
              })}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => { toggle(); setOpen(false); }}
                  className="text-[0.78rem] font-semibold tracking-wider px-4 py-2.5 border border-white/20 text-white/85"
                >
                  {lang === "ar" ? "EN" : "العربية"}
                </button>
                {!user && (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="text-[0.85rem] font-semibold tracking-wide px-5 py-2.5 border border-white/20 text-white/85"
                  >
                    <span className="ar">دخول</span>
                    <span className="en">Login</span>
                  </Link>
                )}
                <Link
                  href={user ? dashboardHref : "/register"}
                  onClick={() => setOpen(false)}
                  className="text-[0.85rem] font-semibold tracking-wide px-5 py-2.5 bg-[#0B3D2E] text-white"
                >
                  <span className="ar">{user ? "حسابي" : "انضمي"}</span>
                  <span className="en">{user ? "My Account" : "Join Club"}</span>
                </Link>
              </div>

              <div className="mt-10 pt-6 border-t border-white/10">
                <div className="text-[0.6rem] uppercase tracking-[0.28em] text-white/45 font-semibold mb-4">
                  <span className="ar">تابعينا</span>
                  <span className="en">Follow us</span>
                </div>
                <SocialRow variant="light" size={20} />
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
