import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import ContactForm from "@/components/contact/ContactForm";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SocialRow } from "@/components/brand/SocialIcons";
import { getPartners } from "@/lib/queries/home";

export const revalidate = 60;

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Chess & Culture Club for Women, Sharjah — enquiries, membership, partnerships, location, and office hours.",
};

const EMAIL = "info@sharjah-women-chess.ae";
const PHONE_DISPLAY = "+971 6 000 0000";
const PHONE_TEL = "+97160000000";

/* Direct contact channels shown alongside the enquiry form. */
const HOURS = [
  { ar: "الأحد – الخميس", en: "Sunday – Thursday", valueAr: "9:00 ص – 6:00 م", valueEn: "9:00 AM – 6:00 PM" },
  { ar: "الجمعة – السبت", en: "Friday – Saturday", valueAr: "مغلق", valueEn: "Closed" },
];

export default async function ContactPage() {
  const partners = await getPartners();

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHeader
          kickerAr="تواصلي معنا"
          kickerEn="Get in Touch"
          titleAr="اتصلي بنا"
          titleEn="Contact Us"
          leadAr="نسعد بتواصلك معنا — للاستفسارات العامة، أو العضوية، أو الشراكات، أو طلبات الإعلام."
          leadEn="We would be glad to hear from you — for general enquiries, membership, partnerships, or media requests."
          crumbs={[{ href: "/contact", ar: "اتصلي بنا", en: "Contact Us" }]}
        />

        {/* ── Enquiry form + direct channels ───────────────────────── */}
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-wrap px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Form */}
              <div className="lg:col-span-7">
                <SectionTitle
                  eyebrowAr="نموذج التواصل"
                  eyebrowEn="Send a Message"
                  titleAr="اكتبي إلينا"
                  titleEn="Write to us"
                  size="h3"
                />
                <p className="mb-9 mt-4 max-w-xl text-[1rem] leading-relaxed text-text-3">
                  <span className="ar">
                    أكملي النموذج أدناه وسيتولّى الفريق المعني الرد عليك في
                    أقرب وقت ممكن.
                  </span>
                  <span className="en">
                    Complete the form below and the relevant team will get
                    back to you as soon as possible.
                  </span>
                </p>
                <ContactForm />
              </div>

              {/* Direct channels */}
              <aside className="lg:col-span-5">
                <div className="rounded-[4px] border border-line bg-cream-100 p-8 sm:p-9">
                  <div className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-forest-700">
                    <span className="ar">للتواصل المباشر</span>
                    <span className="en">Reach us directly</span>
                  </div>

                  <div className="mt-7 flex flex-col gap-7">
                    <div>
                      <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-text-4">
                        <span className="ar">البريد الإلكتروني</span>
                        <span className="en">Email</span>
                      </div>
                      <a
                        href={`mailto:${EMAIL}`}
                        className="mt-1.5 inline-block font-disp text-[1.05rem] font-bold tracking-tight text-text-1 transition-colors hover:text-forest-700"
                        dir="ltr"
                      >
                        {EMAIL}
                      </a>
                    </div>
                    <div>
                      <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-text-4">
                        <span className="ar">الهاتف</span>
                        <span className="en">Telephone</span>
                      </div>
                      <a
                        href={`tel:${PHONE_TEL}`}
                        className="mt-1.5 inline-block font-disp text-[1.05rem] font-bold tracking-tight text-text-1 transition-colors hover:text-forest-700"
                        dir="ltr"
                      >
                        {PHONE_DISPLAY}
                      </a>
                    </div>
                    <div>
                      <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-text-4">
                        <span className="ar">الموقع</span>
                        <span className="en">Location</span>
                      </div>
                      <p className="mt-1.5 text-[1rem] leading-snug text-text-2">
                        <span className="ar">الشارقة، الإمارات العربية المتحدة</span>
                        <span className="en">Sharjah, United Arab Emirates</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-line pt-7">
                    <div className="mb-3.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-text-4">
                      <span className="ar">تابعينا</span>
                      <span className="en">Follow the club</span>
                    </div>
                    <SocialRow variant="dark" size={18} />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ── Visit the club ───────────────────────────────────────── */}
        <section className="border-t border-line bg-cream-100">
          <div className="mx-auto max-w-wrap px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
            <SectionTitle
              eyebrowAr="الزيارة"
              eyebrowEn="Visit Us"
              titleAr="مقرّ النادي وساعات العمل"
              titleEn="Visiting the club"
              leadAr="يرحّب النادي بالزائرات خلال ساعات العمل الرسمية في إمارة الشارقة."
              leadEn="The club welcomes visitors during official office hours in the Emirate of Sharjah."
              size="h2"
            />

            <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Address */}
              <div className="rounded-[4px] border border-line bg-white p-8 sm:p-9 lg:col-span-5">
                <div className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-forest-700">
                  <span className="ar">العنوان</span>
                  <span className="en">Address</span>
                </div>
                <p className="mt-4 font-disp text-[1.5rem] font-bold leading-[1.25] tracking-tight text-text-1">
                  <span className="ar">نادي الشطرنج والثقافة للفتيات</span>
                  <span className="en">Chess &amp; Culture Club for Women</span>
                </p>
                <p className="mt-2 text-[1rem] leading-relaxed text-text-3">
                  <span className="ar">إمارة الشارقة، الإمارات العربية المتحدة</span>
                  <span className="en">Emirate of Sharjah, United Arab Emirates</span>
                </p>
                <p className="mt-6 text-[0.82rem] italic text-text-4">
                  <span className="ar">— سيُحدَّث العنوان التفصيلي قريباً.</span>
                  <span className="en">
                    — The full street address will be published shortly.
                  </span>
                </p>
              </div>

              {/* Office hours */}
              <div className="rounded-[4px] border border-line bg-white p-8 sm:p-9 lg:col-span-7">
                <div className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-forest-700">
                  <span className="ar">ساعات العمل</span>
                  <span className="en">Office hours</span>
                </div>
                <dl className="mt-5 flex flex-col">
                  {HOURS.map((h, i) => (
                    <div
                      key={h.en}
                      className={`flex items-baseline justify-between gap-6 py-4 ${
                        i === 0 ? "" : "border-t border-line"
                      }`}
                    >
                      <dt className="font-disp text-[1.1rem] font-bold tracking-tight text-text-1">
                        <span className="ar">{h.ar}</span>
                        <span className="en">{h.en}</span>
                      </dt>
                      <dd className="text-[0.95rem] font-medium text-text-2">
                        <span className="ar">{h.valueAr}</span>
                        <span className="en">{h.valueEn}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 border-t border-line pt-5 text-[0.92rem] leading-relaxed text-text-3">
                  <span className="ar">
                    لتنسيق زيارة أو موعد، يُرجى التواصل عبر البريد الإلكتروني
                    أو الهاتف مسبقاً.
                  </span>
                  <span className="en">
                    To arrange a visit or appointment, please contact the club
                    by email or telephone in advance.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer partners={partners} />
    </>
  );
}
