"use client";

import Link from "next/link";

const NAV_PRIMARY = [
  { href: "/about",       ar: "عن النادي",  en: "About the Club" },
  { href: "/news",        ar: "الأخبار",    en: "News & Media"   },
  { href: "/tournaments", ar: "البطولات",   en: "Tournaments"    },
];

const NAV_SECONDARY = [
  { href: "/register/academy", ar: "التسجيل في الأكاديمية", en: "Academy Enrollment" },
  { href: "/login",            ar: "بوابة الدخول",          en: "Member Portal"      },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-ivory">
      <div className="h-[3px] w-full bg-gradient-to-r from-red via-white to-green2" />

      <div className="max-w-wrap mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Identity block */}
          <div className="md:col-span-5">
            <div className="font-disp text-[1.25rem] mb-3 leading-tight">
              <span className="ar">نادي الشطرنج والثقافة للفتيات بالشارقة</span>
              <span className="en">Chess &amp; Culture Club for Women</span>
            </div>
            <div className="text-[0.62rem] uppercase tracking-[0.22em] text-red font-semibold mb-4">
              <span className="ar">الشارقة • الإمارات العربية المتحدة • تأسس 1991</span>
              <span className="en">Sharjah · United Arab Emirates · Est. 1991</span>
            </div>
            <p className="text-sm text-ivory/55 leading-relaxed max-w-md">
              <span className="ar">
                مؤسسة رياضية وثقافية رائدة لتطوير لاعبات الشطرنج في الإمارات وتمكين الفتيات
                من خلال المنافسة، الثقافة، والقيادة.
              </span>
              <span className="en">
                A leading sports &amp; cultural institution developing female chess players
                in the UAE and empowering girls through competition, culture, and leadership.
              </span>
            </p>
          </div>

          {/* Explore */}
          <div className="md:col-span-3">
            <div className="text-[0.6rem] uppercase tracking-[0.22em] text-ivory/40 mb-4 font-semibold">
              <span className="ar">روابط</span>
              <span className="en">Explore</span>
            </div>
            <nav className="flex flex-col gap-2.5">
              {NAV_PRIMARY.map((l) => (
                <Link key={l.href} href={l.href} className="text-sm text-ivory/75 hover:text-red transition-colors w-fit">
                  <span className="ar">{l.ar}</span>
                  <span className="en">{l.en}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Portal */}
          <div className="md:col-span-2">
            <div className="text-[0.6rem] uppercase tracking-[0.22em] text-ivory/40 mb-4 font-semibold">
              <span className="ar">البوابة</span>
              <span className="en">Portal</span>
            </div>
            <nav className="flex flex-col gap-2.5">
              {NAV_SECONDARY.map((l) => (
                <Link key={l.href} href={l.href} className="text-sm text-ivory/75 hover:text-red transition-colors w-fit">
                  <span className="ar">{l.ar}</span>
                  <span className="en">{l.en}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <div className="text-[0.6rem] uppercase tracking-[0.22em] text-ivory/40 mb-4 font-semibold">
              <span className="ar">تواصل</span>
              <span className="en">Contact</span>
            </div>
            <div className="text-sm text-ivory/75 leading-relaxed space-y-1.5">
              <div>info@sharjah-women-chess.ae</div>
              <div>+971 6 000 0000</div>
              <div className="text-ivory/50">
                <span className="ar">الشارقة، الإمارات</span>
                <span className="en">Sharjah, UAE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-ivory/10 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.7rem] text-ivory/40 tracking-wider">
            © {year} <span className="ar">نادي الشطرنج والثقافة للفتيات بالشارقة</span><span className="en">Chess &amp; Culture Club for Women, Sharjah</span>. <span className="ar">جميع الحقوق محفوظة.</span><span className="en">All rights reserved.</span>
          </p>
          <div className="flex items-center gap-3 text-[0.7rem] text-ivory/40 tracking-wider">
            <span>UAE</span>
            <span className="block w-6 h-[2px] bg-gradient-to-r from-red via-white to-green2" />
          </div>
        </div>
      </div>
    </footer>
  );
}
