"use client";

import Link from "next/link";

export default function AboutPreview() {
  return (
    <section className="relative bg-ink text-ivory overflow-hidden">
      <div className="chess-tex-lt absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="absolute -top-40 -left-32 w-[480px] h-[480px] rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(circle, #D42B3C 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -right-32 w-[420px] h-[420px] rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #007A38 0%, transparent 70%)" }}
      />

      <div className="relative max-w-wrap-md mx-auto px-4 sm:px-6 lg:px-10 section-pad-lg">
        <div className="sec-tag inline-flex items-center gap-3 mb-6 text-ivory">
          <span className="block w-9 h-[2px] bg-red" />
          <span>
            <span className="ar">من نحن</span>
            <span className="en">About Us</span>
          </span>
        </div>

        <h2 className="font-disp t-h1 text-ivory mb-7">
          <span className="ar">أكثر من نادٍ — <span className="text-red">مدرسة قيادة</span></span>
          <span className="en">More than a club — <span className="text-red">a leadership school.</span></span>
        </h2>

        <div className="h-[3px] w-28 bg-gradient-to-r from-red via-white to-green2 mb-10" />

        <p className="text-lg sm:text-xl leading-[1.8] text-ivory/80 max-w-2xl mb-12">
          <span className="ar">
            نُؤمن بأن كل نقلة على الرقعة هي تدريب على قرار في الحياة. منذ تأسيسنا
            عام 2017، خرّجنا بطلات يمثلن الإمارات في المحافل الإقليمية والدولية،
            وبنينا مجتمعاً من الأمهات والمدربات يدعم كل لاعبة في رحلتها.
          </span>
          <span className="en">
            We believe every move on the board trains a decision in life. Since
            2017 we have graduated champions representing the UAE on regional
            and international stages, and built a community of mothers and
            coaches that supports every player&apos;s journey.
          </span>
        </p>

        <Link
          href="/about"
          className="inline-flex items-center gap-2 h-14 px-9 border-2 border-ivory/50 text-ivory text-base font-semibold tracking-wide hover:bg-ivory hover:text-ink transition-colors"
        >
          <span className="ar">قصتنا الكاملة ←</span>
          <span className="en">Read Our Story →</span>
        </Link>
      </div>
    </section>
  );
}
