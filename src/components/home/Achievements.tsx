"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import { EASE_EMPHASIS } from "@/lib/motion";

interface Achievement {
  ar:    string;
  en:    string;
  arDsc: string;
  enDsc: string;
  arWhen?: string;
  enWhen?: string;
}

const FEATURED: Achievement = {
  ar:    "بطولات الإمارات النسائية",
  en:    "UAE women's championships",
  arDsc: "حضور مستمر على منصات التتويج في بطولات الشطرنج النسائية الرئيسية بالدولة، عبر أكثر من ثلاثة عقود من المنافسة المتواصلة.",
  enDsc: "Sustained podium presence in the UAE&rsquo;s leading women&rsquo;s chess championships, across more than three decades of continuous competition.",
  arWhen: "1992 — حتى اليوم",
  enWhen: "1992 — present",
};

const LEDGER: Achievement[] = [
  {
    ar:    "اعتماد الجودة ISO 9001",
    en:    "ISO 9001 quality certification",
    arDsc: "اعتماد دولي يؤكد التزام النادي بمعايير الإدارة والتشغيل، يُجدَّد كل ثلاث سنوات.",
    enDsc: "International accreditation confirming the club&rsquo;s management and operating standards. Renewed on a three-year cycle.",
    arWhen: "منذ 2018",
    enWhen: "since 2018",
  },
  {
    ar:    "تكريمات حكومية",
    en:    "Government recognition",
    arDsc: "تقديرات رسمية متعددة من جهات حكومية ورياضية في إمارة الشارقة وعلى مستوى الدولة.",
    enDsc: "Repeated official recognition from sporting and governmental bodies in Sharjah and at the federal level.",
  },
  {
    ar:    "البرامج المدرسية الوطنية",
    en:    "National schools programme",
    arDsc: "مبادرات منتظمة لنقل الشطرنج إلى الفتيات في المدارس والمراكز المجتمعية في عدة إمارات.",
    enDsc: "Regular outreach taking the game to girls in schools and community centres across several emirates.",
    arWhen: "2014 — حتى اليوم",
    enWhen: "2014 — present",
  },
  {
    ar:    "المخيم الصيفي السنوي",
    en:    "Annual summer camp",
    arDsc: "برنامج تطوير صيفي مكثّف يستقبل لاعبات من داخل النادي وخارجه، ضمن منهج معدّ على مدار العام.",
    enDsc: "An intensive summer development programme open to club members and external players, built on a year-round curriculum.",
    arWhen: "كل صيف",
    enWhen: "every summer",
  },
  {
    ar:    "الفعاليات الثقافية",
    en:    "Cultural participation",
    arDsc: "مشاركة فاعلة في فعاليات ثقافية وبرامج مجتمعية في الشارقة، من معرض الكتاب إلى أيام التراث.",
    enDsc: "Active participation in cultural and community programmes across Sharjah, from the book fair to heritage days.",
  },
];

export default function Achievements() {
  return (
    <section className="relative bg-ivory2 overflow-hidden">
      <div aria-hidden className="absolute inset-0 chess-tex opacity-25 pointer-events-none" />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 py-24 sm:py-28">
        {/* Header — restrained, dateline left, deck right */}
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14 sm:mb-16">
            <div className="lg:col-span-7">
              <div className="text-[0.6rem] uppercase tracking-[0.32em] text-ink3 font-bold mb-5 flex items-center gap-3">
                <span className="block w-7 h-px bg-ink3" />
                <span className="ar">الإنجازات</span>
                <span className="en">Selected work, 1991 — 2025</span>
              </div>
              <h2 className="font-disp text-[clamp(2.4rem,5vw,4rem)] text-ink leading-[1.06] tracking-tight max-w-3xl">
                <span className="ar">سجلٌ يُحاسب نفسه على نتائجه.</span>
                <span className="en">A record we are willing to be measured against.</span>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pb-2">
              <p className="text-[0.95rem] sm:text-[1.05rem] leading-[1.85] text-ink2 max-w-md">
                <span className="ar">
                  ما يلي ليس حصراً كاملاً، بل اختيار من الإنجازات التي تُعرّف عمل النادي
                  المستمر في الرياضة، الحوكمة، والمجتمع.
                </span>
                <span className="en">
                  Not a complete inventory — a selection of milestones that
                  define the club&rsquo;s ongoing work in sport, governance,
                  and community.
                </span>
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Featured panel — anchor item, no number, no emoji */}
          <Reveal delay={0.08} className="lg:col-span-5">
            <article className="relative h-full bg-white border border-stone shadow-card">
              {/* Hairline scarlet rule top — restrained */}
              <div aria-hidden className="absolute top-0 left-0 right-0 h-[2px] bg-[#C8102E]" />

              <div className="relative p-8 sm:p-10 lg:p-12 h-full flex flex-col">
                <div className="text-[0.6rem] uppercase tracking-[0.32em] text-[#C8102E] font-bold mb-7">
                  <span className="ar">الإنجاز الأبرز</span>
                  <span className="en">Anchor record</span>
                </div>

                <h3 className="font-disp text-[clamp(1.8rem,3vw,2.4rem)] text-ink leading-[1.14] tracking-tight mb-7">
                  <span className="ar">{FEATURED.ar}</span>
                  <span className="en">{FEATURED.en}</span>
                </h3>

                <p className="text-[1rem] sm:text-[1.05rem] leading-[1.85] text-ink2 mb-9">
                  <span className="ar">{FEATURED.arDsc}</span>
                  <span className="en" dangerouslySetInnerHTML={{ __html: FEATURED.enDsc }} />
                </p>

                <dl className="mt-auto pt-6 border-t border-stone grid grid-cols-2 gap-x-6 gap-y-3 text-[0.78rem]">
                  <dt className="text-[0.58rem] uppercase tracking-[0.22em] text-ink3 font-bold">
                    <span className="ar">السنوات</span>
                    <span className="en">Span</span>
                  </dt>
                  <dd className="text-ink2">
                    <span className="ar">{FEATURED.arWhen}</span>
                    <span className="en">{FEATURED.enWhen}</span>
                  </dd>
                  <dt className="text-[0.58rem] uppercase tracking-[0.22em] text-ink3 font-bold">
                    <span className="ar">الفئة</span>
                    <span className="en">Category</span>
                  </dt>
                  <dd className="text-ink2">
                    <span className="ar">رياضة تنافسية</span>
                    <span className="en">Competitive sport</span>
                  </dd>
                </dl>
              </div>
            </article>
          </Reveal>

          {/* Ledger — table-like, no numbered indices, no emojis */}
          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } } }}
            className="lg:col-span-7 flex flex-col border-t border-stone"
          >
            {LEDGER.map((a, i) => (
              <motion.li
                key={i}
                variants={{
                  hidden:  { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_EMPHASIS } },
                }}
                className="group relative grid grid-cols-1 sm:grid-cols-[1fr_9rem] gap-x-8 gap-y-2 py-7 sm:py-8 border-b border-stone last:border-b-0 transition-colors duration-280 ease-standard hover:bg-white/55"
              >
                <div className="min-w-0">
                  <h4 className="font-disp text-xl sm:text-2xl text-ink leading-snug mb-2 tracking-tight">
                    <span className="ar">{a.ar}</span>
                    <span className="en">{a.en}</span>
                  </h4>
                  <p className="text-[0.92rem] leading-[1.8] text-ink2 max-w-[60ch]">
                    <span className="ar">{a.arDsc}</span>
                    <span className="en" dangerouslySetInnerHTML={{ __html: a.enDsc }} />
                  </p>
                </div>
                {(a.arWhen || a.enWhen) && (
                  <div className="text-[0.62rem] uppercase tracking-[0.22em] font-bold text-ink3 sm:text-right sm:pt-1.5">
                    <span className="ar">{a.arWhen}</span>
                    <span className="en">{a.enWhen}</span>
                  </div>
                )}
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
