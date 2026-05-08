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
            <span className="ar">عن النادي</span>
            <span className="en">About the Club</span>
          </span>
        </div>

        <h2 className="font-disp t-h1 text-ivory mb-7">
          <span className="ar">إرث من <span className="text-red">القيادة النسائية</span> في الشطرنج الإماراتي</span>
          <span className="en">A legacy of <span className="text-red">women&rsquo;s leadership</span> in UAE chess.</span>
        </h2>

        <div className="h-[3px] w-28 bg-gradient-to-r from-red via-white to-green2 mb-10" />

        <p className="text-lg sm:text-xl leading-[1.85] text-ivory/80 max-w-2xl mb-8">
          <span className="ar">
            تأسس نادي الشطرنج والثقافة للفتيات بالشارقة عام 1991 ليكون أحد أعرق
            المؤسسات النسائية في الإمارات العربية المتحدة. على مدار أكثر من ثلاثة
            عقود، نهضنا بمسيرة الشطرنج النسائي محلياً وإقليمياً، وقدّمنا أجيالاً
            من البطلات والقائدات، وأسهمنا في رسم ملامح المشهد الرياضي والثقافي
            للفتاة الإماراتية.
          </span>
          <span className="en">
            Founded in 1991, the Chess &amp; Culture Club for Women in Sharjah is
            one of the oldest and most respected women&rsquo;s sporting institutions
            in the United Arab Emirates. For more than three decades we have
            advanced the women&rsquo;s chess movement locally and regionally,
            graduated generations of champions and leaders, and helped shape the
            sporting and cultural landscape for Emirati women.
          </span>
        </p>

        <p className="text-base sm:text-lg leading-[1.85] text-ivory/65 max-w-2xl mb-12">
          <span className="ar">
            من خلال برامج تدريبية احترافية، وأنشطة ثقافية، ومبادرات مجتمعية، نُمكّن
            الفتيات من تطوير قدراتهن الذهنية والقيادية في بيئة راقية تليق بالمرأة
            الإماراتية.
          </span>
          <span className="en">
            Through professional training programmes, cultural activities, and
            community initiatives, we empower girls to develop their intellectual
            and leadership capacities in an environment that befits the Emirati
            woman.
          </span>
        </p>

        <Link
          href="/about"
          className="inline-flex items-center gap-2 h-14 px-9 border-2 border-ivory/50 text-ivory text-base font-semibold tracking-wide hover:bg-ivory hover:text-ink transition-colors"
        >
          <span className="ar">قصة النادي الكاملة ←</span>
          <span className="en">Read Our Full Story →</span>
        </Link>
      </div>
    </section>
  );
}
