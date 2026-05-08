"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";

export default function Contact() {
  return (
    <section className="relative bg-ivory2 overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1F6B4F 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -right-32 w-[360px] h-[360px] rounded-full blur-3xl opacity-12 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C8102E 0%, transparent 70%)" }}
      />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <Reveal className="lg:col-span-5">
            <span className="eyebrow-light mb-4">
              <span className="dot-emerald" />
              <span className="ar">تواصل معنا</span>
              <span className="en">Contact</span>
            </span>
            <h2 className="font-disp t-mega text-ink mt-5 mb-6">
              <span className="ar">تشرّفنا بتواصلكم.</span>
              <span className="en">We&rsquo;d be honoured to hear from you.</span>
            </h2>
            <div className="h-[2px] w-32 bg-gradient-to-r from-[#1F6B4F] via-ink to-[#C8102E] mb-8" />
            <p className="text-base sm:text-lg leading-[1.85] text-ink3 mb-10">
              <span className="ar">للاستفسارات الرسمية، طلبات الانضمام، أو فرص الشراكة المؤسسية، يسعدنا استقبال تواصلكم عبر القنوات الرسمية أدناه.</span>
              <span className="en">For official inquiries, membership requests, or institutional partnership opportunities, we welcome your contact through the official channels below.</span>
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="btn-emerald">
                <span className="ar">انضمي إلى النادي ←</span>
                <span className="en">Become a Member →</span>
              </Link>
              <a href="mailto:info@sharjah-women-chess.ae" className="btn-outline-ink">
                <span className="ar">راسلنا</span>
                <span className="en">Email Us</span>
              </a>
            </div>
          </Reveal>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <ContactCard icon="📍" labelAr="العنوان"          labelEn="Address" valueAr="إمارة الشارقة، الإمارات العربية المتحدة" valueEn="Sharjah, United Arab Emirates" accent="emerald" />
            <ContactCard icon="📞" labelAr="الهاتف"           labelEn="Phone"   valueAr="‎+971 6 000 0000" valueEn="+971 6 000 0000" accent="scarlet" />
            <ContactCard icon="✉" labelAr="البريد الإلكتروني" labelEn="Email"   valueAr="info@sharjah-women-chess.ae" valueEn="info@sharjah-women-chess.ae" accent="ink" />
            <ContactCard icon="🕐" labelAr="ساعات العمل"      labelEn="Hours"   valueAr="الأحد – الخميس · 9 ص – 6 م" valueEn="Sunday – Thursday · 9 AM – 6 PM" accent="emerald" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const accentMap = { emerald: "#0B3D2E", scarlet: "#C8102E", ink: "#141414" } as const;

function ContactCard({
  icon, labelAr, labelEn, valueAr, valueEn, accent,
}: {
  icon: string;
  labelAr: string; labelEn: string;
  valueAr: string; valueEn: string;
  accent: "emerald" | "scarlet" | "ink";
}) {
  return (
    <motion.div
      variants={{
        hidden:  { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
      }}
      whileHover={{ y: -4 }}
      className="relative bg-white border border-stone p-7 transition-all duration-500 hover:shadow-[0_18px_44px_-22px_rgba(20,20,20,0.25)]"
    >
      <div aria-hidden className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: accentMap[accent] }} />
      <div className="text-2xl mb-3">{icon}</div>
      <div className="text-[0.6rem] uppercase tracking-[0.28em] font-bold mb-2" style={{ color: accentMap[accent] }}>
        <span className="ar">{labelAr}</span>
        <span className="en">{labelEn}</span>
      </div>
      <div className="font-disp text-base sm:text-lg text-ink leading-snug">
        <span className="ar">{valueAr}</span>
        <span className="en">{valueEn}</span>
      </div>
    </motion.div>
  );
}
