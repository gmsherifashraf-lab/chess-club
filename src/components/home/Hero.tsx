"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ivory2 hero-section">
      {/* Animated chess texture */}
      <div className="chess-tex hero-mask absolute inset-0 opacity-50" />

      {/* Cinematic light orbs */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full blur-3xl opacity-20 hero-orb-1"
        style={{ background: "radial-gradient(circle, #D42B3C 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-32 w-[520px] h-[520px] rounded-full blur-3xl opacity-15 hero-orb-2"
        style={{ background: "radial-gradient(circle, #007A38 0%, transparent 70%)" }}
      />

      {/* UAE flag accent strip — subtle */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red via-white to-green2 opacity-90" />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad-lg">
        <div className="max-w-4xl">
          {/* Institutional eyebrow */}
          <div className="hero-fade-1 mb-7 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur border border-stone text-[0.65rem] uppercase tracking-[0.22em] text-ink font-semibold">
              <span className="block w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
              <span className="ar">مؤسسة رياضية وثقافية</span>
              <span className="en">A Sports &amp; Cultural Institution</span>
            </span>
            <span className="text-[0.65rem] uppercase tracking-[0.22em] text-red font-bold">
              <span className="ar">الشارقة • تأسس 1991</span>
              <span className="en">Sharjah · Est. 1991</span>
            </span>
          </div>

          {/* Cinematic headline */}
          <h1 className="font-disp text-ink t-hero mb-4 hero-fade-2">
            <span className="ar block">
              حيث تصنع الفتاة <span className="text-red">قرارها</span>
            </span>
            <span className="en block">
              Where every girl <span className="text-red">makes her move.</span>
            </span>
          </h1>

          <h2 className="font-disp text-ink2 text-2xl sm:text-3xl mb-8 hero-fade-3 max-w-3xl leading-tight">
            <span className="ar">نادي الشطرنج والثقافة للفتيات بالشارقة</span>
            <span className="en">Chess &amp; Culture Club for Women — Sharjah</span>
          </h2>

          <div className="h-[3px] w-32 bg-gradient-to-r from-red via-white to-green2 mb-8 hero-fade-3" />

          <p className="text-lg sm:text-xl leading-[1.8] text-ink2 max-w-2xl mb-10 hero-fade-4">
            <span className="ar">
              منذ عام 1991، نقود مسيرة الشطرنج النسائي في الإمارات — نُخرّج بطلات،
              ونبني قائدات، ونرسّخ ثقافة الإنجاز بين الفتيات الإماراتيات.
            </span>
            <span className="en">
              Since 1991, we have led the women&rsquo;s chess movement in the UAE —
              graduating champions, shaping leaders, and instilling a culture of
              excellence among Emirati girls and young women.
            </span>
          </p>

          <div className="flex flex-wrap gap-4 hero-fade-5">
            <Link
              href="/register/academy"
              className="inline-flex items-center gap-2 h-14 px-9 bg-red text-white text-base font-semibold tracking-wide hover:bg-red-dk transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(212,43,60,0.4)]"
            >
              <span className="ar">انضمي إلى الأكاديمية ←</span>
              <span className="en">Join the Academy →</span>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 h-14 px-9 border-2 border-ink text-ink text-base font-semibold tracking-wide hover:bg-ink hover:text-ivory transition-colors"
            >
              <span className="ar">عن النادي</span>
              <span className="en">About the Club</span>
            </Link>
          </div>

          {/* Quick metrics strip */}
          <div className="mt-16 grid grid-cols-3 gap-6 sm:gap-10 max-w-2xl hero-fade-5">
            <Metric value="34+" arLabel="سنة عطاء"   enLabel="Years" />
            <Metric value="180+" arLabel="لاعبة"      enLabel="Players"     accent />
            <Metric value="ISO"  arLabel="جودة معتمدة" enLabel="Certified" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ value, arLabel, enLabel, accent = false }: { value: string; arLabel: string; enLabel: string; accent?: boolean }) {
  return (
    <div className="border-l-2 border-stone pl-4" style={accent ? { borderColor: "#D42B3C" } : undefined}>
      <div className="font-disp text-2xl sm:text-3xl font-bold text-ink leading-none mb-1.5">{value}</div>
      <div className="text-[0.65rem] uppercase tracking-[0.18em] text-ink3 font-semibold">
        <span className="ar">{arLabel}</span>
        <span className="en">{enLabel}</span>
      </div>
    </div>
  );
}
