"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/context/LangContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const FIELD =
  "w-full rounded-[2px] border border-line bg-white px-4 py-3 text-[0.95rem] text-text-1 outline-none transition-colors placeholder:text-text-4 focus:border-forest-700 focus:ring-2 focus:ring-forest-700/20 disabled:opacity-60";
const LABEL =
  "mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.16em] text-text-3";

/**
 * Public club registration. No account is created — the form is
 * submitted to the club (enrollments table) and staff follow up by
 * email. Membership accounts/portals are staff-managed.
 */
export default function RegisterPage() {
  const { lang } = useLang();
  const supabase = createClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [school, setSchool] = useState("");
  const [chessLevel, setChessLevel] = useState("beginner");
  const [program, setProgram] = useState("rising-stars");

  const [motherName, setMotherName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!firstName || !lastName || !email) {
      setError(
        lang === "ar"
          ? "يرجى ملء الحقول الإلزامية: الاسم الأول واسم العائلة والبريد الإلكتروني"
          : "Please fill the required fields: first name, last name, and email",
      );
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(
        lang === "ar"
          ? "صيغة البريد الإلكتروني غير صحيحة"
          : "Invalid email address",
      );
      return;
    }

    setLoading(true);
    const { error: insErr } = await supabase.from("enrollments").insert({
      child_first_name: firstName,
      child_last_name: lastName,
      child_dob: dob || null,
      nationality: nationality || null,
      school: school || null,
      chess_level: chessLevel,
      program,
      mother_name: motherName || null,
      father_name: fatherName || null,
      guardian_email: email,
      guardian_phone: phone || null,
      notes: notes || null,
    });

    if (insErr) {
      setError(friendlyError(insErr.message, lang));
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHeader
          kickerAr="الانضمام"
          kickerEn="Membership"
          titleAr="التسجيل في النادي"
          titleEn="Register with the Club"
          leadAr="لا حاجة لإنشاء حساب — قدّمي الطلب وستتواصل معك إدارة النادي."
          leadEn="No account needed — submit the form and the club administration will be in touch."
          crumbs={[{ href: "/register", ar: "التسجيل", en: "Register" }]}
        />

        <section className="border-t border-line bg-cream-100">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
            {success ? (
              <div className="rounded-[4px] border border-line bg-white p-10 text-center shadow-card sm:p-14">
                <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-forest-700/20 bg-forest-700/[0.07] text-forest-700">
                  <svg viewBox="0 0 24 24" className="h-7 w-7">
                    <path
                      d="M5 13l4 4L19 7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h2 className="font-disp t-h3 text-text-1">
                  <span className="ar">تم استلام طلبك</span>
                  <span className="en">Application received</span>
                </h2>
                <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-text-3">
                  <span className="ar">
                    شكراً لتسجيلك في نادي الشطرنج والثقافة للفتيات. ستتواصل
                    معك إدارة النادي قريباً عبر البريد الإلكتروني للخطوات
                    التالية.
                  </span>
                  <span className="en">
                    Thank you for registering with the Chess &amp; Culture
                    Club for Women. The club administration will contact you
                    shortly by email with the next steps.
                  </span>
                </p>
                <div
                  aria-hidden
                  className="mx-auto my-7 h-[3px] w-[72px] bg-[linear-gradient(90deg,#C8102E_33.3%,#fff_33.3%_66.6%,#117A4F_66.6%)]"
                />
                <Link
                  href="/"
                  className={cn(buttonVariants({ variant: "primary", size: "md" }))}
                >
                  <span className="ar">العودة إلى الرئيسية</span>
                  <span className="en">Back to Home</span>
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="overflow-hidden rounded-[4px] border border-line bg-white shadow-card"
              >
                <div className="border-b border-line p-7 sm:p-9">
                  <div
                    aria-hidden
                    className="mb-5 h-[3px] w-16 bg-[linear-gradient(90deg,#C8102E_33.3%,#fff_33.3%_66.6%,#117A4F_66.6%)]"
                  />
                  <h2 className="font-disp t-h4 text-text-1">
                    <span className="ar">نموذج التسجيل في النادي</span>
                    <span className="en">Club Registration Form</span>
                  </h2>
                  <p className="mt-2 text-[0.88rem] text-text-3">
                    <span className="ar">
                      لا حاجة لإنشاء حساب — ستتواصل إدارة النادي بعد مراجعة
                      الطلب.
                    </span>
                    <span className="en">
                      No account needed — club staff will contact you after
                      reviewing your application.
                    </span>
                  </p>
                </div>

                <div className="flex flex-col gap-5 p-7 sm:p-9">
                  {error && (
                    <div
                      role="alert"
                      className="rounded-[2px] border border-scarlet-400/25 bg-scarlet-400/[0.07] px-4 py-3 text-[0.85rem] text-scarlet-600"
                    >
                      {error}
                    </div>
                  )}

                  <div className="border-b border-line pb-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-scarlet-500">
                    <span className="ar">بيانات اللاعبة *</span>
                    <span className="en">Applicant Details *</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field labelAr="الاسم الأول *" labelEn="First Name *">
                      <input className={FIELD} type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} />
                    </Field>
                    <Field labelAr="اسم العائلة *" labelEn="Last Name *">
                      <input className={FIELD} type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} />
                    </Field>
                    <Field labelAr="تاريخ الميلاد" labelEn="Date of Birth">
                      <input className={FIELD} type="date" value={dob} onChange={(e) => setDob(e.target.value)} disabled={loading} />
                    </Field>
                    <Field labelAr="الجنسية" labelEn="Nationality">
                      <input className={FIELD} type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} disabled={loading} />
                    </Field>
                  </div>

                  <Field labelAr="المدرسة / جهة العمل" labelEn="School / Employer">
                    <input className={FIELD} type="text" value={school} onChange={(e) => setSchool(e.target.value)} disabled={loading} />
                  </Field>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field labelAr="مستوى الشطرنج" labelEn="Chess Level">
                      <select className={FIELD} value={chessLevel} onChange={(e) => setChessLevel(e.target.value)} disabled={loading}>
                        <option value="beginner">مبتدئة تماماً / Complete Beginner</option>
                        <option value="knows-rules">تعرف القواعد / Knows Rules</option>
                        <option value="club-player">لاعبة نادٍ / Club Player</option>
                        <option value="rated">مصنّفة / Rated Player</option>
                      </select>
                    </Field>
                    <Field labelAr="البرنامج" labelEn="Program">
                      <select className={FIELD} value={program} onChange={(e) => setProgram(e.target.value)} disabled={loading}>
                        <option value="little-queens">الملكات الصغيرات (5–7)</option>
                        <option value="rising-stars">النجوم الصاعدات (8–12)</option>
                        <option value="competitive">الجيل التنافسي (13–16)</option>
                        <option value="elite">فريق النخبة (17+)</option>
                      </select>
                    </Field>
                  </div>

                  <div className="mt-1 border-b border-line pb-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-forest-700">
                    <span className="ar">بيانات التواصل / ولي الأمر *</span>
                    <span className="en">Contact / Guardian *</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field labelAr="اسم الأم" labelEn="Mother's Name">
                      <input className={FIELD} type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} disabled={loading} />
                    </Field>
                    <Field labelAr="اسم الأب" labelEn="Father's Name">
                      <input className={FIELD} type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} disabled={loading} />
                    </Field>
                    <Field labelAr="البريد الإلكتروني *" labelEn="Email Address *">
                      <input className={FIELD} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
                    </Field>
                    <Field labelAr="رقم الهاتف" labelEn="Phone Number">
                      <input className={FIELD} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} />
                    </Field>
                  </div>

                  <Field labelAr="ملاحظات إضافية" labelEn="Additional Notes">
                    <textarea className={cn(FIELD, "resize-y")} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} disabled={loading} />
                  </Field>

                  <div className="mt-1 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={loading}
                      className={cn(
                        buttonVariants({ variant: "primary", size: "md", block: true }),
                        "sm:flex-1",
                      )}
                    >
                      <span className="ar">{loading ? "جاري الإرسال…" : "تقديم الطلب"}</span>
                      <span className="en">{loading ? "Submitting…" : "Submit Application"}</span>
                    </button>
                    <Link
                      href="/"
                      className={cn(buttonVariants({ variant: "secondary", size: "md" }))}
                    >
                      <span className="ar">إلغاء</span>
                      <span className="en">Cancel</span>
                    </Link>
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Field({
  labelAr,
  labelEn,
  children,
}: {
  labelAr: string;
  labelEn: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={LABEL}>
        <span className="ar">{labelAr}</span>
        <span className="en">{labelEn}</span>
      </label>
      {children}
    </div>
  );
}

function friendlyError(msg: string, lang: string): string {
  const m = msg.toLowerCase();
  const isAr = lang === "ar";

  if (m.includes("network") || m.includes("fetch") || m.includes("failed to fetch"))
    return isAr
      ? "خطأ في الاتصال. تحقق من الإنترنت وحاول مجدداً"
      : "Connection error. Check your internet and retry";

  if (m.includes("violates row-level security"))
    return isAr
      ? "تعذّر تقديم الطلب. يرجى المحاولة لاحقاً أو التواصل مع النادي مباشرة"
      : "Could not submit your application. Please try again later or contact the club directly";

  return isAr ? `خطأ: ${msg}` : `Error: ${msg}`;
}
