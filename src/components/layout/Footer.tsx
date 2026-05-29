"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import Logo from "@/components/brand/Logo";
import { SocialRow } from "@/components/brand/SocialIcons";
import { buttonVariants } from "@/components/ui/Button";
import { useLang } from "@/context/LangContext";
import { localeHref } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const COL_BROWSE = [
  { href: "/about", ar: "عن النادي", en: "About the Club" },
  { href: "/board", ar: "مجلس الإدارة", en: "Board Members" },
  { href: "/events", ar: "فعالياتنا", en: "Our Events" },
  { href: "/tournaments", ar: "البطولات", en: "Tournaments" },
  { href: "/news", ar: "الأخبار", en: "News" },
  { href: "/contact", ar: "اتصلي بنا", en: "Contact Us" },
];

const COL_MEMBERS = [
  { href: "/register", ar: "التسجيل في النادي", en: "Register with the Club" },
  { href: "/login", ar: "بوابة الإدارة", en: "Staff Portal" },
];

// Institutional partners — representative wordmarks; replace with the
// club's confirmed affiliations and logos when available.
const PARTNERS = [
  { ar: "مجلس الشارقة الرياضي", en: "Sharjah Sports Council" },
  { ar: "اتحاد الإمارات للشطرنج", en: "UAE Chess Federation" },
  { ar: "مكتب الشارقة لرياضة المرأة", en: "Sharjah Women's Sport" },
  { ar: "الاتحاد الآسيوي للشطرنج", en: "Asian Chess Federation" },
];

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setStatus("error");
      return;
    }
    // UI is wired and validated; connect to the club's email provider
    // (e.g. a /api/subscribe route) to persist the address.
    setStatus("ok");
    setEmail("");
  };

  if (status === "ok") {
    return (
      <p
        role="status"
        className="flex items-center gap-2.5 text-[0.92rem] text-forest-400"
      >
        <span aria-hidden className="text-lg">✓</span>
        <span className="ar">تم تسجيلك. شكراً لمتابعتك النادي.</span>
        <span className="en">You&rsquo;re subscribed. Thank you.</span>
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="max-w-sm">
      <label
        htmlFor="footer-newsletter"
        className="mb-3 block text-[0.6rem] font-bold uppercase tracking-[0.28em] text-white/40"
      >
        <span className="ar">النشرة البريدية</span>
        <span className="en">Newsletter</span>
      </label>
      <div className="flex items-stretch border border-white/15 transition-colors focus-within:border-forest-400">
        <input
          id="footer-newsletter"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="name@email.com"
          aria-invalid={status === "error"}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[0.92rem] text-white placeholder:text-white/30 focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 bg-forest-700 px-5 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-forest-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-400"
        >
          <span className="ar">اشتراك</span>
          <span className="en">Join</span>
        </button>
      </div>
      <p
        role={status === "error" ? "alert" : undefined}
        className={`mt-2.5 text-[0.78rem] ${
          status === "error" ? "text-scarlet-300" : "text-white/40"
        }`}
      >
        {status === "error" ? (
          <>
            <span className="ar">يرجى إدخال بريد إلكتروني صحيح.</span>
            <span className="en">Please enter a valid email address.</span>
          </>
        ) : (
          <>
            <span className="ar">أخبار الموسم والبطولات. دون إزعاج.</span>
            <span className="en">Season news and fixtures. No spam.</span>
          </>
        )}
      </p>
    </form>
  );
}

function BackToTop({ reduce }: { reduce: boolean | null }) {
  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
      }
      aria-label="Back to top"
      className="group inline-flex items-center gap-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-400"
    >
      <span className="ar">إلى الأعلى</span>
      <span className="en">Back to top</span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-forest-400">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
          <path
            d="M12 19V5M5 12l7-7 7 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}

export default function Footer({ partners }: { partners?: { ar: string; en: string }[] }) {
  const reduce = useReducedMotion();
  const { lang } = useLang();
  const year = new Date().getFullYear();
  const PARTNER_LIST = partners && partners.length ? partners : PARTNERS;

  const group: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
  };
  const rise: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(170deg,#0C1310_0%,#0A1F16_55%,#070B09_100%)] text-white">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#C8102E_33.3%,#fff_33.3%_66.6%,#117A4F_66.6%)]"
      />
      <div aria-hidden className="chess-tex-lt absolute inset-0 opacity-[0.16]" />
      {/* Oversized editorial watermark — premium depth, not decoration */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-[6vw] start-1/2 -z-0 -translate-x-1/2 select-none whitespace-nowrap font-disp text-[24vw] font-bold leading-none tracking-tighter text-white/[0.02] rtl:translate-x-1/2"
      >
        SHJ CHESS
      </span>

      <div className="relative mx-auto max-w-wrap px-5 sm:px-8 lg:px-10">
        {/* ── Pre-footer CTA band ──────────────────────────────────── */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-8 border-b border-white/10 py-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-forest-400">
              <span className="h-[2px] w-8 bg-scarlet-400" />
              <span className="ar">انضمي إلى الإرث</span>
              <span className="en">Join the legacy</span>
            </div>
            <h2 className="font-disp text-[clamp(1.9rem,4vw,3.25rem)] font-bold leading-[1.1] tracking-tight">
              <span className="ar">
                أقدم مؤسسة شطرنج نسائية في دولة الإمارات.
              </span>
              <span className="en">
                The UAE&rsquo;s oldest women&rsquo;s chess institution.
              </span>
            </h2>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-4">
            <Link
              href={localeHref(lang, "/register")}
              className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
            >
              <span className="ar">طلب الانضمام</span>
              <span className="en">Apply to Join</span>
            </Link>
            <Link
              href={localeHref(lang, "/about")}
              className={cn(buttonVariants({ variant: "light", size: "lg" }))}
            >
              <span className="ar">عن النادي</span>
              <span className="en">About the Club</span>
            </Link>
          </div>
        </motion.div>

        {/* ── Partners strip ───────────────────────────────────────── */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0 }}
          whileInView={reduce ? undefined : { opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7 }}
          className="border-b border-white/10 py-12"
        >
          <div className="mb-7 text-center text-[0.6rem] font-bold uppercase tracking-[0.3em] text-white/35">
            <span className="ar">بالشراكة مع</span>
            <span className="en">In partnership with</span>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12">
            {PARTNER_LIST.map((p, i) => (
              <li key={p.en} className="flex items-center gap-x-8 sm:gap-x-12">
                {i > 0 && (
                  <span
                    aria-hidden
                    className="hidden h-1 w-1 rounded-full bg-white/20 sm:block"
                  />
                )}
                <span className="font-disp text-[0.95rem] tracking-tight text-white/45 transition-colors duration-300 hover:text-white sm:text-[1.05rem]">
                  <span className="ar">{p.ar}</span>
                  <span className="en">{p.en}</span>
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ── Main grid ────────────────────────────────────────────── */}
        <motion.div
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 gap-x-10 gap-y-12 border-b border-white/12 py-16 sm:grid-cols-2 lg:grid-cols-12"
        >
          {/* Club information */}
          <motion.div variants={rise} className="lg:col-span-4">
            <div className="mb-7 flex items-center gap-4">
              <Logo size={78} surface="dark" />
              <div className="flex flex-col leading-tight">
                <span className="font-ar text-[1.05rem] font-bold text-white">
                  نادي الشطرنج والثقافة للفتيات بالشارقة
                </span>
                <span className="mt-1 font-body text-[0.76rem] font-semibold text-white/65">
                  Chess &amp; Culture Club for Sharjah Women
                </span>
              </div>
            </div>
            <p className="mb-7 max-w-md text-[0.95rem] leading-relaxed text-white/55">
              <span className="ar">
                مؤسسة رياضية وثقافية نسائية في الشارقة. نُدرّب لاعبات من سن
                السابعة، ونمثّل دولة الإمارات في البطولات الإقليمية والدولية.
              </span>
              <span className="en">
                A women&rsquo;s sporting and cultural institution in Sharjah.
                We train players from age seven and represent the UAE in
                regional and international competition.
              </span>
            </p>
            <SocialRow variant="light" size={16} />
          </motion.div>

          {/* Quick links */}
          <motion.nav
            variants={rise}
            className="lg:col-span-2"
            aria-label="Footer browse"
          >
            <div className="mb-5 text-[0.6rem] font-bold uppercase tracking-[0.28em] text-white/40">
              <span className="ar">روابط</span>
              <span className="en">Explore</span>
            </div>
            <ul className="flex flex-col gap-3.5">
              {COL_BROWSE.map((l) => (
                <li key={l.href + l.en}>
                  <Link
                    href={localeHref(lang, l.href)}
                    className="group inline-flex items-center gap-2 text-[0.92rem] text-white/70 transition-colors hover:text-white"
                  >
                    <span
                      aria-hidden
                      className="h-px w-0 bg-forest-400 transition-all duration-300 group-hover:w-4"
                    />
                    <span className="ar">{l.ar}</span>
                    <span className="en">{l.en}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Membership */}
          <motion.nav
            variants={rise}
            className="lg:col-span-2"
            aria-label="Footer membership"
          >
            <div className="mb-5 text-[0.6rem] font-bold uppercase tracking-[0.28em] text-white/40">
              <span className="ar">العضوية</span>
              <span className="en">Members</span>
            </div>
            <ul className="flex flex-col gap-3.5">
              {COL_MEMBERS.map((l) => (
                <li key={l.href + l.en}>
                  <Link
                    href={localeHref(lang, l.href)}
                    className="group inline-flex items-center gap-2 text-[0.92rem] text-white/70 transition-colors hover:text-white"
                  >
                    <span
                      aria-hidden
                      className="h-px w-0 bg-forest-400 transition-all duration-300 group-hover:w-4"
                    />
                    <span className="ar">{l.ar}</span>
                    <span className="en">{l.en}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Contact + newsletter */}
          <motion.div variants={rise} className="lg:col-span-4">
            <div className="mb-5 text-[0.6rem] font-bold uppercase tracking-[0.28em] text-white/40">
              <span className="ar">تواصل</span>
              <span className="en">Contact</span>
            </div>
            <ul className="mb-8 flex flex-col gap-3 text-[0.92rem] text-white/70">
              <li>
                <a
                  href="mailto:info@sharjah-women-chess.ae"
                  className="break-all transition-colors hover:text-forest-400"
                >
                  info@sharjah-women-chess.ae
                </a>
              </li>
              <li>
                <a
                  href="tel:+97160000000"
                  className="transition-colors hover:text-forest-400"
                >
                  <span dir="ltr">+971 6 000 0000</span>
                </a>
              </li>
              <li className="text-white/45">
                <span className="ar">الشارقة، الإمارات العربية المتحدة</span>
                <span className="en">Sharjah, United Arab Emirates</span>
              </li>
            </ul>
            <NewsletterForm />
          </motion.div>
        </motion.div>

        {/* ── Bottom bar ───────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-9 text-[0.72rem] text-white/35">
          <p>
            © {year}{" "}
            <span className="ar">
              نادي الشطرنج والثقافة للفتيات بالشارقة. جميع الحقوق محفوظة.
            </span>
            <span className="en">
              Chess &amp; Culture Club for Women, Sharjah. All rights
              reserved.
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-5 font-semibold uppercase tracking-[0.16em]">
            <span className="text-white/40">
              <span className="ar">معتمد ISO 9001 منذ 2018</span>
              <span className="en">ISO 9001 certified since 2018</span>
            </span>
            <span aria-hidden className="text-white/20">·</span>
            <BackToTop reduce={reduce} />
          </div>
        </div>
      </div>
    </footer>
  );
}
