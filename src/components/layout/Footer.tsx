"use client";

import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { SocialRow, CLUB_SOCIAL } from "@/components/brand/SocialIcons";

const NAV_PRIMARY = [
  { href: "/about",       ar: "عن النادي",  en: "About"          },
  { href: "/news",        ar: "الأخبار",    en: "News & Media"   },
  { href: "/tournaments", ar: "البطولات",   en: "Tournaments"    },
];

const NAV_SECONDARY = [
  { href: "/register",  ar: "انضمي للنادي", en: "Become a Member" },
  { href: "/login",     ar: "بوابة الدخول", en: "Member Portal"   },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative lux-dark lux-section overflow-hidden">
      {/* Top emerald glow */}
      <div
        aria-hidden
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(31,107,79,0.7) 0%, transparent 70%)" }}
      />

      {/* UAE flag accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#C8102E] via-white to-[#1F6B4F] opacity-90" />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
        {/* Brand row — large logo + name */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 mb-12 sm:mb-14">
          <Logo size={104} glow ring tone="white" />
          <div className="leading-tight">
            <div className="font-disp text-white text-[1.5rem] sm:text-[1.75rem] font-bold tracking-tight">
              <span className="ar">نادي الشطرنج والثقافة للفتيات بالشارقة</span>
              <span className="en">Chess &amp; Culture Club for Women</span>
            </div>
            <div className="text-[0.62rem] uppercase tracking-[0.28em] text-[#1F6B4F] font-bold mt-3">
              <span className="ar">الشارقة • الإمارات العربية المتحدة • تأسس 1991</span>
              <span className="en">Sharjah · United Arab Emirates · Est. 1991</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Identity / about */}
          <div className="md:col-span-5">
            <p className="text-[0.92rem] text-white/55 leading-[1.85] max-w-md mb-6">
              <span className="ar">
                مؤسسة رياضية وثقافية رائدة لتطوير لاعبات الشطرنج في الإمارات وتمكين الفتيات
                من خلال المنافسة، الثقافة، والقيادة.
              </span>
              <span className="en">
                A leading sports &amp; cultural institution developing female chess players
                in the UAE and empowering girls through competition, culture, and leadership.
              </span>
            </p>

            <div className="text-[0.6rem] uppercase tracking-[0.28em] text-white/45 font-semibold mb-3">
              <span className="ar">تابعينا</span>
              <span className="en">Follow the club</span>
            </div>
            <SocialRow variant="light" size={18} />
          </div>

          {/* Explore */}
          <div className="md:col-span-3">
            <div className="text-[0.6rem] uppercase tracking-[0.28em] text-white/45 mb-4 font-semibold">
              <span className="ar">روابط</span>
              <span className="en">Explore</span>
            </div>
            <nav className="flex flex-col gap-2.5">
              {NAV_PRIMARY.map((l) => (
                <Link key={l.href} href={l.href} className="text-[0.92rem] text-white/75 hover:text-[#1F6B4F] transition-colors w-fit">
                  <span className="ar">{l.ar}</span>
                  <span className="en">{l.en}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Membership */}
          <div className="md:col-span-2">
            <div className="text-[0.6rem] uppercase tracking-[0.28em] text-white/45 mb-4 font-semibold">
              <span className="ar">العضوية</span>
              <span className="en">Membership</span>
            </div>
            <nav className="flex flex-col gap-2.5">
              {NAV_SECONDARY.map((l) => (
                <Link key={l.href} href={l.href} className="text-[0.92rem] text-white/75 hover:text-[#1F6B4F] transition-colors w-fit">
                  <span className="ar">{l.ar}</span>
                  <span className="en">{l.en}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <div className="text-[0.6rem] uppercase tracking-[0.28em] text-white/45 mb-4 font-semibold">
              <span className="ar">تواصل</span>
              <span className="en">Contact</span>
            </div>
            <div className="text-[0.85rem] text-white/75 leading-relaxed space-y-1.5">
              <a href={CLUB_SOCIAL.instagram.url} target="_blank" rel="noopener" className="block hover:text-[#1F6B4F] transition-colors">
                {CLUB_SOCIAL.instagram.handle}
              </a>
              <div className="text-white/55">
                <span className="ar">الشارقة، الإمارات</span>
                <span className="en">Sharjah, UAE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.7rem] text-white/40 tracking-wider">
            © {year}{" "}
            <span className="ar">نادي الشطرنج والثقافة للفتيات بالشارقة</span>
            <span className="en">Chess &amp; Culture Club for Women, Sharjah</span>.{" "}
            <span className="ar">جميع الحقوق محفوظة.</span>
            <span className="en">All rights reserved.</span>
          </p>
          <div className="flex items-center gap-3 text-[0.7rem] text-white/40 tracking-wider">
            <span>UAE</span>
            <span className="block w-6 h-[2px] bg-gradient-to-r from-[#C8102E] via-white to-[#1F6B4F]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
