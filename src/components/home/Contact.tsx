"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import { EASE_EMPHASIS } from "@/lib/motion";

interface ContactItem {
  labelAr: string;
  labelEn: string;
  valueAr: string;
  valueEn: string;
  href?:  string;
  noteAr?: string;
  noteEn?: string;
}

const ITEMS: ContactItem[] = [
  {
    labelAr: "العنوان",        labelEn: "Address",
    valueAr: "إمارة الشارقة، الإمارات العربية المتحدة",
    valueEn: "Sharjah, United Arab Emirates",
    noteAr:  "بحضور موعد مسبق",
    noteEn:  "by prior appointment",
  },
  {
    labelAr: "البريد الإلكتروني", labelEn: "Email",
    valueAr: "info@sharjah-women-chess.ae",
    valueEn: "info@sharjah-women-chess.ae",
    href:    "mailto:info@sharjah-women-chess.ae",
    noteAr:  "للاستفسارات الرسمية",
    noteEn:  "for official correspondence",
  },
  {
    labelAr: "ساعات العمل",     labelEn: "Office hours",
    valueAr: "9 صباحاً — 6 مساءً",
    valueEn: "9:00 — 18:00",
    noteAr:  "الأحد إلى الخميس · بتوقيت الإمارات (GMT+4)",
    noteEn:  "Sunday — Thursday · Gulf Standard Time (GMT+4)",
  },
];

export default function Contact() {
  return (
    <section className="relative overflow-hidden bg-ivory2">
      <div aria-hidden className="absolute inset-0 grain-emerald pointer-events-none" />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 py-24 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT — editorial intro */}
          <Reveal className="lg:col-span-6">
            <div className="text-[0.6rem] uppercase tracking-[0.32em] text-ink3 font-bold mb-5 flex items-center gap-3">
              <span className="block w-7 h-px bg-ink3" />
              <span className="ar">للتواصل</span>
              <span className="en">Contact</span>
            </div>

            <h2 className="font-disp text-[clamp(2.4rem,5vw,4rem)] text-ink leading-[1.06] tracking-tight max-w-2xl">
              <span className="ar">القنوات الرسمية للنادي.</span>
              <span className="en">The club&rsquo;s official channels.</span>
            </h2>

            <p className="mt-7 text-[1rem] sm:text-[1.05rem] leading-[1.85] text-ink2 max-w-md">
              <span className="ar">
                للاستفسارات، طلبات الانضمام، أو فرص الشراكة المؤسسية. نحرص على الردّ خلال يومي عمل من تلقّي الرسالة.
              </span>
              <span className="en">
                For inquiries, membership requests, or institutional partnership
                opportunities. We aim to reply within two working days of
                receiving a message.
              </span>
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/register" className="ds-btn ds-btn-primary">
                <span className="ar">طلب الانضمام</span>
                <span className="en">Apply to join</span>
                <span aria-hidden>→</span>
              </Link>
              <a href="mailto:info@sharjah-women-chess.ae" className="ds-btn ds-btn-ghost">
                <span className="ar">إرسال بريد</span>
                <span className="en">Send an email</span>
              </a>
            </div>
          </Reveal>

          {/* RIGHT — contact ledger, table-like */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
            className="lg:col-span-6"
          >
            <dl className="border-t-2 border-ink/85">
              {ITEMS.map((it, i) => {
                const Wrapper = it.href
                  ? ({ children, className }: { children: React.ReactNode; className?: string }) => (
                      <a href={it.href} className={className}>{children}</a>
                    )
                  : ({ children, className }: { children: React.ReactNode; className?: string }) => (
                      <div className={className}>{children}</div>
                    );
                return (
                  <motion.div
                    key={i}
                    variants={{
                      hidden:  { opacity: 0, y: 14 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_EMPHASIS } },
                    }}
                    className="group grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-x-6 gap-y-1 py-7 border-b border-stone"
                  >
                    <dt className="text-[0.6rem] uppercase tracking-[0.28em] text-ink3 font-bold sm:pt-1">
                      <span className="ar">{it.labelAr}</span>
                      <span className="en">{it.labelEn}</span>
                    </dt>
                    <dd>
                      <Wrapper className={it.href ? "block group-hover:text-[#0B3D2E] transition-colors duration-280 ease-standard" : "block"}>
                        <div className="font-disp text-[1.15rem] sm:text-[1.25rem] text-ink leading-snug">
                          <span className="ar">{it.valueAr}</span>
                          <span className="en">{it.valueEn}</span>
                        </div>
                      </Wrapper>
                      {(it.noteAr || it.noteEn) && (
                        <div className="mt-1 text-[0.78rem] text-ink3 italic">
                          <span className="ar">{it.noteAr}</span>
                          <span className="en">{it.noteEn}</span>
                        </div>
                      )}
                    </dd>
                  </motion.div>
                );
              })}
            </dl>

            {/* Footnote — feels like a real letterhead detail */}
            <p className="mt-7 text-[0.78rem] text-ink3/85 leading-[1.7] max-w-md">
              <span className="ar">
                الرسائل الرسمية تُوجَّه إلى الأمانة العامة. الردود المؤسسية تصدر عن المكتب التنفيذي.
              </span>
              <span className="en">
                Official correspondence is directed to the Secretariat;
                institutional responses are issued by the Executive Office.
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
