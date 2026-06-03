"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_EMPHASIS } from "@/lib/motion";
import { useLang } from "@/context/LangContext";
import { withLocale } from "@/lib/i18n";
import AmbientImage from "@/components/media/AmbientImage";
import { PHOTOS } from "@/lib/homepageMedia";

/* The club's official values — from the 2022–2026 institutional strategy. */
const VALUES = [
  { ar: "الأخلاق الرياضية", en: "Sportsmanship" },
  { ar: "جودة الحياة", en: "Quality of life" },
  { ar: "المواطنة الإيجابية", en: "Positive citizenship" },
  { ar: "الشفافية", en: "Transparency" },
  { ar: "الابتكار", en: "Innovation" },
  { ar: "الاحترافية", en: "Professionalism" },
];

export default function AboutPreview() {
  const reduce = useReducedMotion();
  const { lang } = useLang();
  const enter = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: reduce ? 0 : 0.8, delay: reduce ? 0 : delay, ease: EASE_EMPHASIS },
  });

  return (
    <section className="tex-grain relative overflow-hidden bg-[linear-gradient(170deg,#0C1310_0%,#0A1F16_55%,#070B09_100%)] text-white">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#C8102E_33.3%,#fff_33.3%_66.6%,#117A4F_66.6%)]"
      />
      <div aria-hidden className="chess-tex-lt absolute inset-0 opacity-[0.14]" />

      {/* Ambient sense-of-place — the Sharjah waterfront, blurred + masked
          into the trailing edge so the dark band reads as a real location. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 end-0 w-[70%] [mask-image:radial-gradient(ellipse_70%_85%_at_100%_50%,#000_5%,transparent_70%)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PHOTOS.venue.src}
          alt=""
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover opacity-[0.20] ${reduce ? "" : "ken-burns"}`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,#0A1F16_8%,transparent_60%)]" />
      </div>
      {/* Emerald ambient bloom anchored where the photo sits */}
      <div
        aria-hidden
        className="pointer-events-none absolute -end-[8%] top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(17,122,79,0.22),transparent_68%)] blur-2xl"
      />

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
            <div className="group mb-9">
              <AmbientImage
                src={PHOTOS.clubWall.src}
                alt={lang === "ar" ? PHOTOS.clubWall.altAr : PHOTOS.clubWall.altEn}
                ratio={16 / 10}
                frame="dark"
                zoom
                focus="50% 26%"
                captionAr={PHOTOS.clubWall.tagAr}
                captionEn={PHOTOS.clubWall.tagEn}
              />
            </div>

            <dl className="grid grid-cols-1 gap-y-5 text-[0.95rem]">
              <FactRow labelAr="التأسيس" labelEn="Established" valueAr="1991 · إمارة الشارقة" valueEn="1991 · Emirate of Sharjah" />
              <FactRow labelAr="الحوكمة" labelEn="Governance" valueAr="مجلس إدارة من سبع عضوات" valueEn="Seven-member governing board" />
              <FactRow labelAr="الاعتماد" labelEn="Accreditation" valueAr="ISO 9001:2015 · منذ 2023" valueEn="ISO 9001:2015 · since 2023" />
              <FactRow labelAr="الانتساب" labelEn="Affiliation" valueAr="اتحاد الإمارات للشطرنج" valueEn="UAE Chess Federation" />
            </dl>

            <Link
              href={withLocale(lang, "/about")}
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

        {/* Vision · Mission · Values — from the club's 2022–2026 strategy */}
        <motion.div
          {...enter(0.1)}
          className="mt-16 grid grid-cols-1 gap-x-16 gap-y-10 border-t border-white/10 pt-12 sm:mt-20 lg:grid-cols-12"
        >
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7">
            <div>
              <div className="mb-3 flex items-center gap-3 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-forest-400">
                <span aria-hidden className="h-[2px] w-6 bg-scarlet-400" />
                <span className="ar">الرؤية</span>
                <span className="en">Vision</span>
              </div>
              <p className="text-[1rem] leading-relaxed text-white/80">
                <span className="ar">
                  أن يتبوّأ الشطرنج النسائي الإماراتي في الشارقة موقعاً ريادياً
                  عربياً وعالمياً.
                </span>
                <span className="en">
                  For Emirati women&rsquo;s chess in Sharjah to hold a leading
                  position across the Arab world and the international stage.
                </span>
              </p>
            </div>
            <div>
              <div className="mb-3 flex items-center gap-3 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-forest-400">
                <span aria-hidden className="h-[2px] w-6 bg-scarlet-400" />
                <span className="ar">الرسالة</span>
                <span className="en">Mission</span>
              </div>
              <p className="text-[1rem] leading-relaxed text-white/80">
                <span className="ar">
                  تعزيز ثقافة الشطرنج ونشرها في المحافل الرياضية عربياً وعالمياً،
                  وتأهيل جيل رياضي نسائي ريادي محترف قادر على تحقيق إنجازات عالمية.
                </span>
                <span className="en">
                  To advance and spread the culture of chess across regional and
                  international arenas, and to develop a professional, pioneering
                  generation of women athletes capable of world-class achievement.
                </span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="mb-4 flex items-center gap-3 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-forest-400">
              <span aria-hidden className="h-[2px] w-6 bg-scarlet-400" />
              <span className="ar">قيمنا</span>
              <span className="en">Our values</span>
            </div>
            <ul className="flex flex-wrap gap-2.5">
              {VALUES.map((v) => (
                <li
                  key={v.en}
                  className="rounded-[3px] border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-[0.82rem] font-medium text-white/85 backdrop-blur-[2px] transition-colors duration-300 hover:border-forest-400/50 hover:text-white"
                >
                  <span className="ar">{v.ar}</span>
                  <span className="en">{v.en}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
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
