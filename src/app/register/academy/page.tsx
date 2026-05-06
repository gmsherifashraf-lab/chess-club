"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/context/LangContext";
import { LOGO_URI } from "@/lib/logo";

export default function AcademyRegPage() {
  const { lang } = useLang();
  const supabase = createClient();

  // Child info
  const [childFirst,   setChildFirst]   = useState("");
  const [childLast,    setChildLast]    = useState("");
  const [childDob,     setChildDob]     = useState("");
  const [nationality,  setNationality]  = useState("");
  const [school,       setSchool]       = useState("");
  const [chessLevel,   setChessLevel]   = useState("beginner");
  const [program,      setProgram]      = useState("little-queens");

  // Guardian / contact info
  const [motherName,   setMotherName]   = useState("");
  const [fatherName,   setFatherName]   = useState("");
  const [email,        setEmail]        = useState("");
  const [phone,        setPhone]        = useState("");
  const [notes,        setNotes]        = useState("");

  const [error,        setError]        = useState<string | null>(null);
  const [success,      setSuccess]      = useState(false);
  const [loading,      setLoading]      = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!childFirst || !childLast || !email) {
      setError(lang === "ar"
        ? "يرجى ملء الحقول الإلزامية: اسم الطفلة وبريد ولي الأمر"
        : "Please fill the required fields: child name and guardian email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(lang === "ar" ? "صيغة البريد الإلكتروني غير صحيحة" : "Invalid email address");
      return;
    }

    setLoading(true);

    const { error: insErr } = await supabase.from("enrollments").insert({
      child_first_name: childFirst,
      child_last_name:  childLast,
      child_dob:        childDob || null,
      nationality:      nationality || null,
      school:           school || null,
      chess_level:      chessLevel,
      program,
      mother_name:      motherName || null,
      father_name:      fatherName || null,
      guardian_email:   email,
      guardian_phone:   phone || null,
      notes:            notes || null,
    });

    if (insErr) {
      setError(friendlyError(insErr.message, lang));
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "#EDE9E2", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
          <h2 className="font-disp t-h3" style={{ color: "#141414", marginBottom: "1rem" }}>
            <span className="ar">تم استلام طلبك!</span>
            <span className="en">Application Received!</span>
          </h2>
          <p style={{ fontSize: ".9rem", lineHeight: 1.85, color: "#555", marginBottom: "2rem", fontFamily: "'Noto Sans Arabic','DM Sans',sans-serif" }}>
            <span className="ar">
              شكراً لتقديم طلب الانضمام إلى أكاديمية نادي الشطرنج والثقافة. ستتواصل معك إدارة النادي قريباً عبر البريد الإلكتروني للخطوات التالية.
            </span>
            <span className="en">
              Thank you for applying to the Chess &amp; Culture Club Academy. The club administration will contact you shortly by email with the next steps.
            </span>
          </p>
          <div className="flag-h" style={{ marginBottom: "1.5rem" }} />
          <Link href="/" className="btn btn-primary" style={{ justifyContent: "center" }}>
            <span className="ar">العودة إلى الرئيسية</span>
            <span className="en">Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#EDE9E2", padding: "2rem 1rem", paddingTop: "5rem" }}>
      <div style={{ maxWidth: 760, margin: "0 auto 2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <img src={LOGO_URI} alt="Logo" style={{ height: 52 }} />
        <div>
          <div className="sec-tag" style={{ marginBottom: ".2rem" }}>
            <span className="ar">التسجيل في الأكاديمية</span>
            <span className="en">Academy Enrollment</span>
          </div>
          <h1 className="font-disp t-h3" style={{ color: "#141414" }}>
            <span className="ar">ابدئي رحلتك معنا</span>
            <span className="en">Begin Your Journey</span>
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ background: "#fff", border: "1px solid #D6D0C4" }}>
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #D6D0C4" }}>
            <div style={{ height: 3, background: "linear-gradient(90deg,#007A38 33%,#fff 33% 66%,#D42B3C 66%)", marginBottom: "1.1rem" }} />
            <h2 className="font-disp t-h3" style={{ color: "#141414" }}>
              <span className="ar">نموذج الانضمام للأكاديمية</span>
              <span className="en">Academy Enrollment Form</span>
            </h2>
            <p style={{ fontSize: ".82rem", color: "#555", marginTop: ".5rem", fontFamily: "'Noto Sans Arabic','DM Sans',sans-serif" }}>
              <span className="ar">لا حاجة لإنشاء حساب — إدارة النادي ستتواصل معك بعد مراجعة طلبك.</span>
              <span className="en">No account needed — club staff will contact you after reviewing your application.</span>
            </p>
          </div>

          <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {error && (
              <div style={{ background: "rgba(212,43,60,.08)", border: "1px solid rgba(212,43,60,.25)", padding: ".75rem 1rem", fontSize: ".82rem", color: "#B02030", fontFamily: "'Noto Sans Arabic','DM Sans',sans-serif" }}>
                {error}
              </div>
            )}

            {/* ── Section: Child ── */}
            <div className="eyebrow" style={{ color: "#D42B3C", paddingBottom: ".5rem", borderBottom: "1px solid rgba(212,43,60,.1)" }}>
              <span className="ar">بيانات الطفلة *</span>
              <span className="en">Child&apos;s Information *</span>
            </div>

            <div className="g2" style={{ gap: "1rem" }}>
              <Field label={{ ar: "الاسم الأول *", en: "First Name *" }}>
                <input className="form-inp" type="text" required value={childFirst} onChange={e => setChildFirst(e.target.value)} disabled={loading} />
              </Field>
              <Field label={{ ar: "اسم العائلة *", en: "Last Name *" }}>
                <input className="form-inp" type="text" required value={childLast} onChange={e => setChildLast(e.target.value)} disabled={loading} />
              </Field>
            </div>

            <div className="g2" style={{ gap: "1rem" }}>
              <Field label={{ ar: "تاريخ الميلاد", en: "Date of Birth" }}>
                <input className="form-inp" type="date" value={childDob} onChange={e => setChildDob(e.target.value)} disabled={loading} />
              </Field>
              <Field label={{ ar: "الجنسية", en: "Nationality" }}>
                <input className="form-inp" type="text" value={nationality} onChange={e => setNationality(e.target.value)} disabled={loading} />
              </Field>
            </div>

            <Field label={{ ar: "المدرسة الحالية", en: "Current School" }}>
              <input className="form-inp" type="text" value={school} onChange={e => setSchool(e.target.value)} disabled={loading} />
            </Field>

            <div className="g2" style={{ gap: "1rem" }}>
              <Field label={{ ar: "مستوى الشطرنج", en: "Chess Level" }}>
                <select className="form-inp" value={chessLevel} onChange={e => setChessLevel(e.target.value)} disabled={loading}>
                  <option value="beginner">مبتدئة تماماً / Complete Beginner</option>
                  <option value="knows-rules">تعرف القواعد / Knows Rules</option>
                  <option value="club-player">لاعبة نادي / Club Player</option>
                  <option value="rated">مصنّفة / Rated Player</option>
                </select>
              </Field>
              <Field label={{ ar: "البرنامج", en: "Program" }}>
                <select className="form-inp" value={program} onChange={e => setProgram(e.target.value)} disabled={loading}>
                  <option value="little-queens">الملكات الصغيرات (5–7)</option>
                  <option value="rising-stars">النجوم الصاعدات (8–12)</option>
                  <option value="competitive">الجيل التنافسي (13–16)</option>
                  <option value="elite">فريق النخبة (17+)</option>
                </select>
              </Field>
            </div>

            {/* ── Section: Guardian / Contact ── */}
            <div className="eyebrow" style={{ color: "#007A38", paddingBottom: ".5rem", borderBottom: "1px solid rgba(0,122,56,.1)", marginTop: ".5rem" }}>
              <span className="ar">بيانات ولي الأمر *</span>
              <span className="en">Parent / Guardian *</span>
            </div>

            <div className="g2" style={{ gap: "1rem" }}>
              <Field label={{ ar: "اسم الأم", en: "Mother's Name" }}>
                <input className="form-inp" type="text" value={motherName} onChange={e => setMotherName(e.target.value)} disabled={loading} />
              </Field>
              <Field label={{ ar: "اسم الأب", en: "Father's Name" }}>
                <input className="form-inp" type="text" value={fatherName} onChange={e => setFatherName(e.target.value)} disabled={loading} />
              </Field>
            </div>

            <div className="g2" style={{ gap: "1rem" }}>
              <Field label={{ ar: "البريد الإلكتروني *", en: "Email Address *" }}>
                <input
                  className="form-inp"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />
              </Field>
              <Field label={{ ar: "رقم الهاتف", en: "Phone Number" }}>
                <input className="form-inp" type="tel" value={phone} onChange={e => setPhone(e.target.value)} disabled={loading} />
              </Field>
            </div>

            <Field label={{ ar: "ملاحظات إضافية", en: "Additional Notes" }}>
              <textarea
                className="form-inp"
                rows={3}
                style={{ resize: "vertical" }}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                disabled={loading}
              />
            </Field>

            {/* ── Actions ── */}
            <div style={{ display: "flex", gap: ".75rem", marginTop: ".5rem" }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-green"
                style={{ flex: 1, justifyContent: "center", opacity: loading ? .7 : 1 }}
              >
                <span className="ar">{loading ? "جاري الإرسال…" : "تقديم الطلب"}</span>
                <span className="en">{loading ? "Submitting…"    : "Submit Application"}</span>
              </button>
              <Link href="/" className="btn btn-secondary">
                <span className="ar">إلغاء</span>
                <span className="en">Cancel</span>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: { ar: string; en: string };
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="form-lbl">
        <span className="ar">{label.ar}</span>
        <span className="en">{label.en}</span>
      </label>
      {children}
    </div>
  );
}

function friendlyError(msg: string, lang: string): string {
  const m    = msg.toLowerCase();
  const isAr = lang === "ar";

  if (m.includes("network") || m.includes("fetch") || m.includes("failed to fetch"))
    return isAr ? "خطأ في الاتصال. تحقق من الإنترنت وحاول مجدداً" : "Connection error. Check your internet and retry";

  if (m.includes("violates row-level security"))
    return isAr
      ? "تعذّر تقديم الطلب. يرجى المحاولة لاحقاً أو التواصل مع النادي مباشرة"
      : "Could not submit your application. Please try again later or contact the club directly";

  return isAr ? `خطأ: ${msg}` : `Error: ${msg}`;
}
