"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EASE_EMPHASIS } from "@/lib/motion";

export default function AboutPreview() {
  return (
    <section className="relative bg-ink text-ivory overflow-hidden">
      <div aria-hidden className="chess-tex-lt absolute inset-0 opacity-50 pointer-events-none" />
      <div
        aria-hidden
        className="absolute -top-32 -left-40 w-[480px] h-[480px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1F6B4F 0%, transparent 70%)" }}
      />

      <div className="relative max-w-wrap-md mx-auto px-4 sm:px-6 lg:px-10 py-24 sm:py-32">
        {/* Editorial intro — single column, restrained */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: EASE_EMPHASIS }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-3 mb-8 text-[0.62rem] tracking-[0.32em] uppercase font-bold text-[#1F6B4F]">
            <span aria-hidden className="block w-7 h-px bg-[#1F6B4F]" />
            <span className="ar">عن النادي</span>
            <span className="en">About</span>
          </span>

          <h2 className="font-disp text-[clamp(2.4rem,5vw,4.5rem)] text-ivory leading-[1.04] tracking-tight">
            <span className="ar">
              مؤسسة رياضية وثقافية نسائية في الشارقة، تعمل منذ 1991.
            </span>
            <span className="en">
              A women&rsquo;s sporting and cultural institution in Sharjah,
              operating since 1991.
            </span>
          </h2>
        </motion.div>

        {/* Body — two-column editorial, deliberately uneven widths */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-12 lg:gap-x-16">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: EASE_EMPHASIS }}
            className="lg:col-span-7"
          >
            <p className="text-[1.05rem] sm:text-[1.15rem] leading-[1.85] text-ivory/85">
              <span className="ar">
                يُعدّ نادي الشطرنج والثقافة للفتيات بالشارقة من أوائل المؤسسات
                النسائية المتخصصة في رياضة الشطرنج في الإمارات العربية المتحدة،
                وقد رافق إنشاؤه نهضة إماراتية أوسع في تمكين المرأة على المستويين
                الرياضي والثقافي.
              </span>
              <span className="en">
                The Chess &amp; Culture Club for Women in Sharjah was among the
                first women&rsquo;s institutions in the UAE dedicated to the
                sport, established alongside a wider national movement to
                advance women&rsquo;s participation in sport and cultural life.
              </span>
            </p>
            <p className="mt-6 text-[0.98rem] sm:text-[1.05rem] leading-[1.85] text-ivory/65">
              <span className="ar">
                نُديره مجلسٌ من القياديات الإماراتيات، وتنفّذه فِرق متخصصة من
                المدربات والإداريات، ضمن إطار حوكمة معتمد بشهادة الجودة الدولية
                ISO 9001.
              </span>
              <span className="en">
                The club is governed by a board of senior Emirati women and
                operated by specialised teams of coaches and administrators,
                within a governance framework certified to ISO 9001 standards.
              </span>
            </p>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.12, ease: EASE_EMPHASIS }}
            className="lg:col-span-5 lg:pt-1"
          >
            {/* Editorial fact block — labelled, dense, real-feeling */}
            <dl className="grid grid-cols-1 gap-y-5 text-[0.92rem]">
              <FactRow
                labelAr="التأسيس" labelEn="Established"
                valueAr="1991 · إمارة الشارقة" valueEn="1991 · Emirate of Sharjah"
              />
              <FactRow
                labelAr="الحوكمة" labelEn="Governance"
                valueAr="مجلس إدارة من سبع عضوات" valueEn="Seven-member governing board"
              />
              <FactRow
                labelAr="الاعتماد" labelEn="Accreditation"
                valueAr="ISO 9001:2015 · منذ 2018" valueEn="ISO 9001:2015 · since 2018"
              />
              <FactRow
                labelAr="الانتساب" labelEn="Affiliation"
                valueAr="اتحاد الإمارات للشطرنج" valueEn="UAE Chess Federation"
              />
            </dl>

            <Link href="/about" className="ds-link on-dark mt-9 inline-flex">
              <span className="ar">قراءة المزيد</span>
              <span className="en">More on the club</span>
              <span aria-hidden>→</span>
            </Link>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

function FactRow({ labelAr, labelEn, valueAr, valueEn }: {
  labelAr: string; labelEn: string; valueAr: string; valueEn: string;
}) {
  return (
    <div className="grid grid-cols-[7rem_1fr] sm:grid-cols-[8rem_1fr] gap-4 items-baseline border-b border-white/10 pb-4 last:border-b-0">
      <dt className="text-[0.62rem] uppercase tracking-[0.22em] text-[#1F6B4F]/85 font-bold">
        <span className="ar">{labelAr}</span>
        <span className="en">{labelEn}</span>
      </dt>
      <dd className="text-ivory/85 leading-snug">
        <span className="ar">{valueAr}</span>
        <span className="en">{valueEn}</span>
      </dd>
    </div>
  );
}
