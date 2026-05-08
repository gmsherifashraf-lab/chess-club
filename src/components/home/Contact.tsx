"use client";

import Link from "next/link";

export default function Contact() {
  return (
    <section className="relative bg-ivory2 overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full blur-3xl opacity-15"
        style={{ background: "radial-gradient(circle, #D42B3C 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full blur-3xl opacity-12"
        style={{ background: "radial-gradient(circle, #007A38 0%, transparent 70%)" }}
      />

      <div className="relative max-w-wrap mx-auto px-4 sm:px-6 lg:px-10 section-pad">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Heading */}
          <div className="lg:col-span-5">
            <div className="sec-tag inline-flex items-center gap-3 mb-4 text-red">
              <span className="block w-9 h-[2px] bg-red" />
              <span>
                <span className="ar">تواصل معنا</span>
                <span className="en">Contact</span>
              </span>
            </div>
            <h2 className="font-disp t-h2 text-ink mb-5">
              <span className="ar">تشرّفنا بتواصلكم</span>
              <span className="en">We would be honoured to hear from you</span>
            </h2>
            <div className="h-[3px] w-24 bg-gradient-to-r from-red via-white to-green2 mb-8" />
            <p className="text-base sm:text-lg leading-[1.85] text-ink3 mb-10">
              <span className="ar">
                للاستفسارات الرسمية، طلبات التسجيل، أو فرص الشراكة المؤسسية، يسعدنا
                استقبال تواصلكم عبر القنوات الرسمية أدناه.
              </span>
              <span className="en">
                For official inquiries, enrollment requests, or institutional
                partnership opportunities, we welcome your contact through the
                official channels below.
              </span>
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/register/academy"
                className="inline-flex items-center gap-2 h-13 px-7 bg-red text-white text-sm font-semibold tracking-wide hover:bg-red-dk transition-all hover:-translate-y-0.5"
                style={{ height: 52 }}
              >
                <span className="ar">التسجيل في الأكاديمية ←</span>
                <span className="en">Enroll Now →</span>
              </Link>
              <a
                href="mailto:info@sharjah-women-chess.ae"
                className="inline-flex items-center gap-2 h-13 px-7 border-2 border-ink text-ink text-sm font-semibold tracking-wide hover:bg-ink hover:text-ivory transition-colors"
                style={{ height: 52 }}
              >
                <span className="ar">راسلنا</span>
                <span className="en">Email Us</span>
              </a>
            </div>
          </div>

          {/* Contact card grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ContactCard
              icon="📍"
              labelAr="العنوان"
              labelEn="Address"
              valueAr="إمارة الشارقة، الإمارات العربية المتحدة"
              valueEn="Sharjah, United Arab Emirates"
              accent="red"
            />
            <ContactCard
              icon="📞"
              labelAr="الهاتف"
              labelEn="Phone"
              valueAr="‎+971 6 000 0000"
              valueEn="+971 6 000 0000"
              accent="green"
            />
            <ContactCard
              icon="✉"
              labelAr="البريد الإلكتروني"
              labelEn="Email"
              valueAr="info@sharjah-women-chess.ae"
              valueEn="info@sharjah-women-chess.ae"
              accent="ink"
            />
            <ContactCard
              icon="🕐"
              labelAr="ساعات العمل"
              labelEn="Hours"
              valueAr="الأحد – الخميس · 9 ص – 6 م"
              valueEn="Sunday – Thursday · 9 AM – 6 PM"
              accent="gold"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon, labelAr, labelEn, valueAr, valueEn, accent,
}: {
  icon: string;
  labelAr: string; labelEn: string;
  valueAr: string; valueEn: string;
  accent: "red" | "green" | "ink" | "gold";
}) {
  const accentBg = { red: "bg-red", green: "bg-green2", ink: "bg-ink", gold: "bg-gold" } as const;
  return (
    <div className="relative bg-white border border-stone p-6 transition-all hover:-translate-y-1 hover:shadow-[0_18px_44px_-22px_rgba(20,20,20,0.25)]">
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${accentBg[accent]}`} />
      <div className="text-2xl mb-3">{icon}</div>
      <div className="text-[0.6rem] uppercase tracking-[0.22em] text-ink3 font-bold mb-2">
        <span className="ar">{labelAr}</span>
        <span className="en">{labelEn}</span>
      </div>
      <div className="font-disp text-base sm:text-lg text-ink leading-snug">
        <span className="ar">{valueAr}</span>
        <span className="en">{valueEn}</span>
      </div>
    </div>
  );
}
