"use client";

import { motion } from "framer-motion";
import { CLUB_SOCIAL, InstagramIcon, FacebookIcon } from "@/components/brand/SocialIcons";
import { EASE_EMPHASIS } from "@/lib/motion";

export default function SocialSection() {
  return (
    <section className="relative bg-ink text-ivory overflow-hidden">
      <div aria-hidden className="absolute inset-0 chess-tex-lt opacity-40 pointer-events-none" />
      <div
        aria-hidden
        className="absolute -top-32 right-1/4 w-[420px] h-[420px] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(31,107,79,0.65) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-24">
        {/* Single-line opener — no eyebrow chrome, no italic accent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE_EMPHASIS }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 gap-x-12 items-baseline pb-7 border-b border-white/15"
        >
          <h2 className="lg:col-span-5 font-disp text-[clamp(1.6rem,2.6vw,2.1rem)] text-ivory leading-[1.18] tracking-tight">
            <span className="ar">القنوات الاجتماعية للنادي.</span>
            <span className="en">The club online.</span>
          </h2>
          <p className="lg:col-span-7 text-[0.92rem] sm:text-[1rem] leading-[1.8] text-ivory/65 max-w-xl">
            <span className="ar">
              تُحدَّث القنوات الرسمية أسبوعياً بصور البطولات، حصص التدريب، والفعاليات الثقافية.
            </span>
            <span className="en">
              The official accounts post weekly: tournament photographs,
              training sessions, and cultural programmes.
            </span>
          </p>
        </motion.div>

        {/* Social handles — single dense row, no oversized cards */}
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-0"
        >
          <SocialRow
            href={CLUB_SOCIAL.instagram.url}
            handle={CLUB_SOCIAL.instagram.handle}
            networkAr="إنستغرام"
            networkEn="Instagram"
            descAr="الصور والفيديو من الفعاليات"
            descEn="Photographs and video from events"
            icon={<InstagramIcon size={22} />}
          />
          <SocialRow
            href={CLUB_SOCIAL.facebook.url}
            handle={CLUB_SOCIAL.facebook.handle}
            networkAr="فيسبوك"
            networkEn="Facebook"
            descAr="الإعلانات الرسمية وأخبار النادي"
            descEn="Official announcements and club news"
            icon={<FacebookIcon size={22} />}
            isLast
          />
        </motion.ul>

        {/* Quiet footer — nothing centered, no logo signature, no marquee */}
        <div className="mt-10 pt-7 border-t border-white/15 flex flex-wrap items-baseline justify-between gap-3 text-[0.7rem] text-ivory/45">
          <span className="tracking-[0.18em] uppercase font-semibold">
            <span className="ar">يُحدَّث أسبوعياً</span>
            <span className="en">Updated weekly</span>
          </span>
          <span className="italic">
            <span className="ar">— الإدارة الرقمية للنادي</span>
            <span className="en">— managed by the club&rsquo;s digital office</span>
          </span>
        </div>
      </div>
    </section>
  );
}

function SocialRow({
  href, handle, networkAr, networkEn, descAr, descEn, icon, isLast = false,
}: {
  href: string;
  handle: string;
  networkAr: string;  networkEn: string;
  descAr: string;     descEn: string;
  icon: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <motion.li
      variants={{
        hidden:  { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_EMPHASIS } },
      }}
      className={`relative ${isLast ? "" : "md:border-r border-white/12"}`}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block py-9 sm:py-10 px-1 md:px-8 lg:px-10 transition-colors duration-280 ease-standard hover:bg-white/[0.02]"
      >
        <div className="flex items-baseline justify-between gap-4 mb-5">
          <span className="text-[0.6rem] uppercase tracking-[0.28em] font-bold text-[#1F6B4F]">
            <span className="ar">{networkAr}</span>
            <span className="en">{networkEn}</span>
          </span>
          <span className="text-ivory/40 transition-colors duration-280 group-hover:text-[#1F6B4F]">
            {icon}
          </span>
        </div>
        <div className="font-disp text-[1.6rem] sm:text-[1.85rem] text-ivory leading-tight tracking-tight mb-3 group-hover:text-[#1F6B4F] transition-colors duration-280">
          {handle}
        </div>
        <div className="text-[0.88rem] text-ivory/60 leading-snug">
          <span className="ar">{descAr}</span>
          <span className="en">{descEn}</span>
        </div>
      </a>
    </motion.li>
  );
}
