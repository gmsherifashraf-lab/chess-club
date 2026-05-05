"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ivory2">
      <div className="chess-tex hero-mask absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #D42B3C 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-32 w-[460px] h-[460px] rounded-full blur-3xl opacity-15"
        style={{ background: "radial-gradient(circle, #007A38 0%, transparent 70%)" }}
      />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="block w-8 h-[1.5px] bg-red" />
            <span className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.22em] text-red font-semibold">
              <span className="ar">نادي الشطرنج والثقافة للفتيات</span>
              <span className="en">Chess &amp; Culture Club — Sharjah</span>
            </span>
          </div>

          <h1 className="font-disp text-ink text-[2.6rem] sm:text-[3.4rem] lg:text-[4.6rem] leading-[1.05] tracking-tight mb-6">
            <span className="ar block">حيث تصنع الفتاة <span className="text-red">قرارها</span></span>
            <span className="en block">Where every girl <span className="text-red">makes her move.</span></span>
          </h1>

          <div className="h-[3px] w-24 bg-gradient-to-r from-red via-white to-green2 mb-7" />

          <p className="text-base sm:text-lg leading-relaxed text-ink3 max-w-2xl mb-9 font-noto-ar [dir=ltr]:font-dm">
            <span className="ar">
              منذ 2017، نُمكّن أكثر من 180 لاعبة في الشارقة من خلال برامج الشطرنج
              والثقافة والقيادة — من المبتدئات حتى البطولات الدولية.
            </span>
            <span className="en">
              Since 2017, we have empowered 180+ girls in Sharjah through chess,
              culture, and leadership — from first moves to international titles.
            </span>
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/register/academy"
              className="inline-flex items-center gap-2 h-12 px-7 bg-red text-white text-sm font-semibold tracking-wide hover:bg-red-dk transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(212,43,60,0.35)]"
            >
              <span className="ar">سجّلي الآن ←</span>
              <span className="en">Enroll Now →</span>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 h-12 px-7 border border-ink text-ink text-sm font-semibold tracking-wide hover:bg-ink hover:text-ivory transition-colors"
            >
              <span className="ar">تعرّفي علينا</span>
              <span className="en">About the Club</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
