"use client";

import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { SocialRow, CLUB_SOCIAL } from "@/components/brand/SocialIcons";

const NAV_PRIMARY = [
  { href: "/about",       ar: "عن النادي",  en: "About the club" },
  { href: "/news",        ar: "الأخبار",    en: "News" },
  { href: "/tournaments", ar: "البطولات",   en: "Tournaments" },
];

const NAV_SECONDARY = [
  { href: "/register",  ar: "انضمي للنادي", en: "Apply to join" },
  { href: "/login",     ar: "بوابة الدخول", en: "Member portal" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-ink text-ivory overflow-hidden">
      <div aria-hidden className="absolute inset-0 chess-tex-lt opacity-30 pointer-events-none" />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-24 pb-10">
        {/* Top — wordmark + tagline column, restrained */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 gap-x-10 pb-14 sm:pb-16 border-b border-white/12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-7">
              <Logo size={64} glow tone="white" />
              <div className="leading-tight">
                <div className="font-disp text-ivory text-[1.05rem] sm:text-[1.15rem] tracking-tight">
                  <span className="ar">نادي الشطرنج والثقافة للفتيات</span>
                  <span className="en">Chess &amp; Culture Club for Women</span>
                </div>
                <div className="text-[0.6rem] uppercase tracking-[0.28em] text-ivory/45 font-semibold mt-1.5">
                  <span className="ar">الشارقة · تأسس 1991</span>
                  <span className="en">Sharjah · Est. 1991</span>
                </div>
              </div>
            </div>

            <p className="text-[0.95rem] text-ivory/60 leading-[1.85] max-w-md mb-6">
              <span className="ar">
                مؤسسة رياضية وثقافية نسائية في الشارقة. نُدرّب لاعبات من سن السابعة، ونمثّل الإمارات في البطولات الإقليمية والدولية.
              </span>
              <span className="en">
                A women&rsquo;s sporting and cultural institution in Sharjah.
                We train players from age seven and represent the UAE in
                regional and international competition.
              </span>
            </p>
          </div>

          {/* Navigation columns — denser, no decorative chrome */}
          <nav className="lg:col-span-2">
            <div className="text-[0.6rem] uppercase tracking-[0.28em] text-ivory/40 mb-4 font-bold">
              <span className="ar">روابط</span>
              <span className="en">Browse</span>
            </div>
            <ul className="flex flex-col gap-3">
              {NAV_PRIMARY.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[0.92rem] text-ivory/80 hover:text-[#1F6B4F] transition-colors duration-280 ease-standard">
                    <span className="ar">{l.ar}</span>
                    <span className="en">{l.en}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-2">
            <div className="text-[0.6rem] uppercase tracking-[0.28em] text-ivory/40 mb-4 font-bold">
              <span className="ar">العضوية</span>
              <span className="en">Members</span>
            </div>
            <ul className="flex flex-col gap-3">
              {NAV_SECONDARY.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[0.92rem] text-ivory/80 hover:text-[#1F6B4F] transition-colors duration-280 ease-standard">
                    <span className="ar">{l.ar}</span>
                    <span className="en">{l.en}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact — discrete, real */}
          <div className="lg:col-span-3">
            <div className="text-[0.6rem] uppercase tracking-[0.28em] text-ivory/40 mb-4 font-bold">
              <span className="ar">تواصل</span>
              <span className="en">Contact</span>
            </div>
            <ul className="flex flex-col gap-3 text-[0.92rem] text-ivory/80">
              <li>
                <a href="mailto:info@sharjah-women-chess.ae" className="hover:text-[#1F6B4F] transition-colors duration-280 ease-standard break-all">
                  info@sharjah-women-chess.ae
                </a>
              </li>
              <li>
                <a href="tel:+971600000000" className="hover:text-[#1F6B4F] transition-colors duration-280 ease-standard">
                  <span dir="ltr">+971 6 000 0000</span>
                </a>
              </li>
              <li className="text-ivory/55">
                <span className="ar">الشارقة، الإمارات العربية المتحدة</span>
                <span className="en">Sharjah, United Arab Emirates</span>
              </li>
            </ul>

            <div className="mt-7">
              <SocialRow variant="light" size={16} />
            </div>
          </div>
        </div>

        {/* Bottom rule — institutional credit line */}
        <div className="mt-9 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 text-[0.7rem] text-ivory/35">
          <p className="leading-[1.6]">
            © {year}{" "}
            <span className="ar">نادي الشطرنج والثقافة للفتيات بالشارقة.</span>
            <span className="en">Chess &amp; Culture Club for Women, Sharjah.</span>{" "}
            <span className="ar">جميع الحقوق محفوظة.</span>
            <span className="en">All rights reserved.</span>
          </p>
          <div className="flex items-center gap-5 tracking-[0.18em] uppercase font-semibold">
            <Link href={`mailto:${CLUB_SOCIAL.instagram.handle ? "info@sharjah-women-chess.ae" : ""}`} className="hover:text-ivory/70 transition-colors duration-280">
              <span className="ar">سياسة الخصوصية</span>
              <span className="en">Privacy</span>
            </Link>
            <span className="text-ivory/20">·</span>
            <span className="font-disp not-italic tracking-normal normal-case text-ivory/45 italic">
              <span className="ar">معتمد ISO 9001 منذ 2018</span>
              <span className="en">ISO 9001 certified since 2018</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
