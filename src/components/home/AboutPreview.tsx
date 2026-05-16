"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_EMPHASIS } from "@/lib/motion";

export default function AboutPreview() {
  const reduce = useReducedMotion();
  const enter = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: reduce ? 0 : 0.8, delay: reduce ? 0 : delay, ease: EASE_EMPHASIS },
  });

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(170deg,#0C1310_0%,#0A1F16_55%,#070B09_100%)] text-white">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#C8102E_33.3%,#fff_33.3%_66.6%,#117A4F_66.6%)]"
      />
      <div aria-hidden className="chess-tex-lt absolute inset-0 opacity-[0.14]" />

      <div className="relative mx-auto max-w-wrap-md px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
        <motion.div {...enter()} className="max-w-3xl">
          <span className="mb-7 inline-flex items-center gap-3 text-[0.8125rem] font-semibold uppercase tracking-[0.2em] text-forest-400">
            <span aria-hidden className="block h-[2px] w-8 bg-scarlet-400" />
            <span className="ar">عن النادي</span>
            <span className="en">About the Club</span>
          </span>

          <h2 className="font-disp t-h1 leading-[1.08] tracking-tight text-white">
            <span className="ar">
              مؤسسة رياضية وثقافية نسائية في الشارقة، تعمل منذ 1991.
            </span>
            <span className="en">
              A women&rsquo;s sporting and cultural institution in Sharjah,
              operating since 1991.
            </span>
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-10 sm:mt-20 lg:grid-cols-12 lg:gap-x-16">
          <motion.div {...enter()} className="lg:col-span-7">
            <p className="text-[1.0625rem] leading-relaxed text-white/80 sm:text-[1.15rem]">
              <span className="ar">
                يُعدّ نادي الشطرنج والثقافة للفتيات بالشارقة من أوائل
                المؤسسات النسائية المتخصصة في رياضة الشطرنج في الإمارات
                العربية المتحدة، وقد رافق إنشاؤه نهضة إماراتية أوسع في
                تمكين المرأة على المستويين الرياضي والثقافي.
              </span>
              <span className="en">
                The Chess &amp; Culture Club for Women in Sharjah was among
                the first women&rsquo;s institutions in the UAE dedicated to
                the sport, established alongside a wider national movement to
                advance women&rsquo;s participation in sport and cultural
                life.
              </span>
            </p>
            <p className="mt-6 text-[1rem] leading-relaxed text-white/60 sm:text-[1.05rem]">
              <span className="ar">
                نُديره مجلسٌ من القياديات الإماراتيات، وتنفّذه فِرق متخصصة
                من المدربات والإداريات، ضمن إطار حوكمة معتمد بشهادة الجودة
                الدولية ISO 9001.
              </span>
              <span className="en">
                The club is governed by a board of senior Emirati women and
                operated by specialised teams of coaches and administrators,
                within a governance framework certified to ISO 9001
                standards.
              </span>
            </p>
          </motion.div>

          <motion.aside {...enter(0.12)} className="lg:col-span-5 lg:pt-1">
            <dl className="grid grid-cols-1 gap-y-5 text-[0.95rem]">
              <FactRow labelAr="التأسيس" labelEn="Established" valueAr="1991 · إمارة الشارقة" valueEn="1991 · Emirate of Sharjah" />
              <FactRow labelAr="الحوكمة" labelEn="Governance" valueAr="مجلس إدارة من سبع عضوات" valueEn="Seven-member governing board" />
              <FactRow labelAr="الاعتماد" labelEn="Accreditation" valueAr="ISO 9001:2015 · منذ 2018" valueEn="ISO 9001:2015 · since 2018" />
              <FactRow labelAr="الانتساب" labelEn="Affiliation" valueAr="اتحاد الإمارات للشطرنج" valueEn="UAE Chess Federation" />
            </dl>

            <Link
              href="/about"
              className="group mt-9 inline-flex items-center gap-2 border-b-2 border-white/25 pb-1 text-[0.8rem] font-bold uppercase tracking-[0.18em] text-white/80 transition-colors hover:border-forest-400 hover:text-white"
            >
              <span className="ar">قراءة المزيد عن النادي</span>
              <span className="en">More on the club</span>
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
              >
                →
              </span>
            </Link>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

function FactRow({
  labelAr,
  labelEn,
  valueAr,
  valueEn,
}: {
  labelAr: string;
  labelEn: string;
  valueAr: string;
  valueEn: string;
}) {
  return (
    <div className="grid grid-cols-[7rem_1fr] items-baseline gap-4 border-b border-white/10 pb-4 last:border-b-0 sm:grid-cols-[8rem_1fr]">
      <dt className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-forest-400">
        <span className="ar">{labelAr}</span>
        <span className="en">{labelEn}</span>
      </dt>
      <dd className="leading-snug text-white/80">
        <span className="ar">{valueAr}</span>
        <span className="en">{valueEn}</span>
      </dd>
    </div>
  );
}
