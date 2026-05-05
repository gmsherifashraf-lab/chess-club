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

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad-lg">
        <div className="max-w-4xl">
          <div className="sec-tag inline-flex items-center gap-3 mb-7 text-red">
            <span className="block w-10 h-[2px] bg-red" />
            <span>
              <span className="ar">نادي الشطرنج والثقافة للفتيات</span>
              <span className="en">Chess &amp; Culture Club — Sharjah</span>
            </span>
          </div>

          <h1 className="font-disp text-ink t-hero mb-8">
            <span className="ar block">حيث تصنع الفتاة <span className="text-red">قرارها</span></span>
            <span className="en block">Where every girl <span className="text-red">makes her move.</span></span>
          </h1>

          <div className="h-[3px] w-28 bg-gradient-to-r from-red via-white to-green2 mb-8" />

          <p className="text-lg sm:text-xl leading-[1.75] text-ink2 max-w-2xl mb-10">
            <span className="ar">
              منذ 2017، نُمكّن أكثر من 180 لاعبة في الشارقة من خلال برامج الشطرنج
              والثقافة والقيادة — من المبتدئات حتى البطولات الدولية.
            </span>
            <span className="en">
              Since 2017, we have empowered 180+ girls in Sharjah through chess,
              culture, and leadership — from first moves to international titles.
            </span>
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/register/academy"
              className="inline-flex items-center gap-2 h-14 px-9 bg-red text-white text-base font-semibold tracking-wide hover:bg-red-dk transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(212,43,60,0.4)]"
            >
              <span className="ar">انضمي للنادي ←</span>
              <span className="en">Join the Club →</span>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 h-14 px-9 border-2 border-ink text-ink text-base font-semibold tracking-wide hover:bg-ink hover:text-ivory transition-colors"
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
