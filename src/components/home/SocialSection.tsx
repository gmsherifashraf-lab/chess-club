"use client";

import { motion } from "framer-motion";
import { CLUB_SOCIAL, InstagramIcon, FacebookIcon } from "@/components/brand/SocialIcons";
import Logo from "@/components/brand/Logo";

const HASHTAGS = [
  "#ChessAndCultureClub",
  "#نادي_الشطرنج_والثقافة",
  "#SharjahLadiesChess",
  "#فتيات_الشارقة_للشطرنج",
  "#ChessUAE",
  "#WomenInChess",
  "#EmiratiChampions",
];

export default function SocialSection() {
  return (
    <section className="relative lux-dark lux-tex lux-section">
      {/* Glow background */}
      <div
        aria-hidden
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(31,107,79,0.65) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-[460px] h-[460px] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,16,46,0.55) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-14 sm:mb-20"
        >
          <span className="eyebrow-lux mb-5">
            <span className="dot" />
            <span className="ar">المجتمع الرقمي</span>
            <span className="en">Digital Community</span>
          </span>

          <h2 className="font-disp t-mega text-white mb-6 mt-6">
            <span className="ar">انضمي إلى مجتمعنا</span>
            <span className="en">Join our community.</span>
          </h2>
          <div className="h-[2px] w-32 mx-auto bg-gradient-to-r from-[#1F6B4F] via-white to-[#C8102E] mb-7" />
          <p className="text-base sm:text-lg text-white/65 leading-[1.85]">
            <span className="ar">
              تابعينا على القنوات الرسمية للنادي للحظات من البطولات، حصص التدريب، والفعاليات
              الثقافية، وكوني جزءاً من الحركة النسائية الرائدة للشطرنج في الإمارات.
            </span>
            <span className="en">
              Follow our official channels for moments from tournaments, training,
              and cultural events — and be part of the leading women&rsquo;s chess
              movement in the UAE.
            </span>
          </p>
        </motion.div>

        {/* Social cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 mb-16">
          <SocialCard
            href={CLUB_SOCIAL.instagram.url}
            handle={CLUB_SOCIAL.instagram.handle}
            networkAr="إنستجرام"
            networkEn="Instagram"
            ctaAr="تابعينا"
            ctaEn="Follow us"
            taglineAr="لقطات حية من رحلة النادي"
            taglineEn="Live moments from the club's journey"
            accent="emerald"
            icon={<InstagramIcon size={28} />}
          />
          <SocialCard
            href={CLUB_SOCIAL.facebook.url}
            handle={CLUB_SOCIAL.facebook.handle}
            networkAr="فيسبوك"
            networkEn="Facebook"
            ctaAr="انضمي للصفحة"
            ctaEn="Like our page"
            taglineAr="فعالياتنا الرسمية وأخبار النادي"
            taglineEn="Official events &amp; club news"
            accent="red"
            icon={<FacebookIcon size={28} />}
          />
        </div>

        {/* Hashtag marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {HASHTAGS.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
              className="text-[0.72rem] sm:text-[0.78rem] text-white/55 tracking-wide border border-white/10 px-3 py-1.5 hover:border-[#1F6B4F] hover:text-white transition-colors"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* Logo signature */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="flex justify-center mt-16"
        >
          <Logo size={76} glow tone="white" />
        </motion.div>
      </div>
    </section>
  );
}

function SocialCard({
  href, handle, networkAr, networkEn, ctaAr, ctaEn, taglineAr, taglineEn, accent, icon,
}: {
  href:    string;
  handle:  string;
  networkAr: string;  networkEn: string;
  ctaAr:   string;    ctaEn:   string;
  taglineAr: string;  taglineEn: string;
  accent:  "emerald" | "red";
  icon:    React.ReactNode;
}) {
  const isEmerald = accent === "emerald";
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7 }}
      whileHover={{ y: -6 }}
      className="group relative block bg-white/[0.03] border border-white/10 backdrop-blur p-8 sm:p-10 overflow-hidden"
    >
      {/* Hover glow */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: isEmerald
            ? "radial-gradient(circle at 30% 0%, rgba(31,107,79,0.35) 0%, transparent 60%)"
            : "radial-gradient(circle at 30% 0%, rgba(200,16,46,0.30) 0%, transparent 60%)",
        }}
      />

      {/* Top accent strip */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: isEmerald ? "#1F6B4F" : "#C8102E" }}
      />

      <div className="relative flex items-start justify-between gap-5">
        <div className="flex-1">
          <div className="text-[0.6rem] uppercase tracking-[0.28em] font-bold mb-3" style={{ color: isEmerald ? "#1F6B4F" : "#C8102E" }}>
            <span className="ar">{networkAr}</span>
            <span className="en">{networkEn}</span>
          </div>
          <div className="font-disp text-2xl sm:text-3xl text-white mb-3 leading-tight">
            {handle}
          </div>
          <p className="text-[0.92rem] text-white/65 leading-relaxed mb-6">
            <span className="ar">{taglineAr}</span>
            <span className="en" dangerouslySetInnerHTML={{ __html: taglineEn }} />
          </p>
          <div className="inline-flex items-center gap-2 text-[0.78rem] uppercase tracking-[0.18em] font-semibold text-white group-hover:gap-3 transition-all">
            <span className="ar">{ctaAr}</span>
            <span className="en">{ctaEn}</span>
            <span aria-hidden style={{ color: isEmerald ? "#1F6B4F" : "#C8102E" }}>→</span>
          </div>
        </div>

        <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 inline-flex items-center justify-center border border-white/10 text-white/85 group-hover:scale-110 group-hover:border-current transition-all duration-500" style={{ color: isEmerald ? "#1F6B4F" : "#C8102E" }}>
          {icon}
        </div>
      </div>
    </motion.a>
  );
}
