"use client";

import Link from "next/link";

const NAV = [
  { href: "/news",        ar: "الأخبار",   en: "News" },
  { href: "/tournaments", ar: "البطولات",   en: "Tournaments" },
  { href: "/about",       ar: "من نحن",     en: "About" },
  { href: "/login",       ar: "دخول",       en: "Login" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="h-[3px] w-full bg-gradient-to-r from-red via-white to-green2" />

      <div className="max-w-wrap mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          <div className="md:col-span-1">
            <div className="font-disp text-lg mb-3 leading-tight">
              <span className="ar">نادي الشطرنج والثقافة للفتيات</span>
              <span className="en">Chess &amp; Culture Club for Girls</span>
            </div>
            <p className="text-sm text-ivory/55 leading-relaxed max-w-xs">
              <span className="ar">الشارقة، الإمارات — منذ 2017</span>
              <span className="en">Sharjah, United Arab Emirates — since 2017</span>
            </p>
          </div>

          <div>
            <div className="text-[0.6rem] uppercase tracking-[0.22em] text-ivory/40 mb-4 font-semibold">
              <span className="ar">روابط</span>
              <span className="en">Explore</span>
            </div>
            <nav className="flex flex-col gap-2.5">
              {NAV.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-ivory/75 hover:text-red transition-colors w-fit"
                >
                  <span className="ar">{l.ar}</span>
                  <span className="en">{l.en}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <div className="text-[0.6rem] uppercase tracking-[0.22em] text-ivory/40 mb-4 font-semibold">
              <span className="ar">تواصل</span>
              <span className="en">Contact</span>
            </div>
            <p className="text-sm text-ivory/75 leading-relaxed">
              info@chesssharjah.ae<br />
              +971 6 000 0000
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-ivory/10 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.7rem] text-ivory/40 tracking-wider">
            © {new Date().getFullYear()} Chess &amp; Culture Club, Sharjah.
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
