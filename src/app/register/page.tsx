"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signUp } from "@/lib/auth";
import { useLang } from "@/context/LangContext";
import { LOGO_URI } from "@/lib/logo";

/**
 * Public player signup. Coach and admin accounts are created from the
 * admin dashboard — this page only ever creates `role = 'player'` rows.
 */
export default function RegisterPage() {
  const { lang } = useLang();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !password) {
      setError(lang === "ar" ? "يرجى ملء جميع الحقول" : "Please fill in all fields");
      return;
    }
    if (password.length < 8) {
      setError(lang === "ar" ? "كلمة المرور يجب ألا تقل عن 8 أحرف" : "Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError(lang === "ar" ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
      return;
    }

    setLoading(true);
    const { error: authError } = await signUp(supabase, {
      email,
      password,
      role: "player",
      fullName,
    });

    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: "linear-gradient(135deg,#EDE9E2 0%,#F8F5F0 60%,#FAF7F2 100%)" }}>
        <div className="max-w-[460px] text-center">
          <div className="text-6xl mb-4">📨</div>
          <h2 className="font-disp t-h3 mb-3" style={{ color: "#141414" }}>
            <span className="ar">تحقق من بريدك الإلكتروني</span>
            <span className="en">Check your email</span>
          </h2>
          <p style={{ fontSize: ".9rem", color: "#555", lineHeight: 1.85, fontFamily: "'Noto Sans Arabic','DM Sans',sans-serif" }}>
            <span className="ar">لقد أرسلنا رابط التأكيد إلى {email}. اضغط الرابط لتفعيل حسابك ثم سجّل الدخول.</span>
            <span className="en">We&apos;ve sent a confirmation link to {email}. Click it to activate your account, then sign in.</span>
          </p>
          <div className="flag-h mx-auto my-6" style={{ width: 72 }} />
          <Link href="/login" className="btn btn-primary" style={{ justifyContent: "center" }}>
            <span className="ar">الذهاب لتسجيل الدخول</span>
            <span className="en">Go to login</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: "linear-gradient(135deg,#EDE9E2 0%,#F8F5F0 60%,#FAF7F2 100%)" }}>
      <div className="w-full max-w-[460px]">
        <div className="text-center mb-8">
          <img src={LOGO_URI} alt="Logo" className="mx-auto mb-4" style={{ height: 72 }} />
          <div className="flag-h mx-auto mb-4" style={{ width: 60 }} />
          <h2 className="font-disp t-h3 mb-1" style={{ color: "#141414" }}>
            <span className="ar">إنشاء حساب لاعب</span>
            <span className="en">Create a Player Account</span>
          </h2>
          <p className="text-[0.85rem]" style={{ color: "#555", fontFamily: "'Noto Sans Arabic','DM Sans',sans-serif" }}>
            <span className="ar">لتلقي المهام ومتابعة تقدمك في النادي</span>
            <span className="en">To receive tasks and track your progress at the club</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white border" style={{ borderColor: "#D6D0C4", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {error && (
              <div className="text-[0.82rem]" style={{ background: "rgba(212,43,60,.08)", border: "1px solid rgba(212,43,60,.25)", padding: ".75rem 1rem", color: "#B02030", fontFamily: "'Noto Sans Arabic','DM Sans',sans-serif" }}>
                {error}
              </div>
            )}

            <div>
              <label className="form-lbl">
                <span className="ar">الاسم الكامل</span>
                <span className="en">Full Name</span>
              </label>
              <input className="form-inp" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading} required />
            </div>

            <div>
              <label className="form-lbl">
                <span className="ar">البريد الإلكتروني</span>
                <span className="en">Email</span>
              </label>
              <input className="form-inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
            </div>

            <div>
              <label className="form-lbl">
                <span className="ar">كلمة المرور (8 أحرف على الأقل)</span>
                <span className="en">Password (min. 8 chars)</span>
              </label>
              <input className="form-inp" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required />
            </div>

            <div>
              <label className="form-lbl">
                <span className="ar">تأكيد كلمة المرور</span>
                <span className="en">Confirm Password</span>
              </label>
              <input className="form-inp" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} disabled={loading} required />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full" style={{ justifyContent: "center", opacity: loading ? .7 : 1 }}>
              <span className="ar">{loading ? "جاري الإنشاء…" : "إنشاء حساب"}</span>
              <span className="en">{loading ? "Creating…"      : "Create Account"}</span>
            </button>

            <p className="text-center text-[0.78rem]" style={{ color: "#555", fontFamily: "'Noto Sans Arabic','DM Sans',sans-serif" }}>
              <span className="ar">لديك حساب بالفعل؟ <Link href="/login" style={{ color: "#D42B3C", textDecoration: "none" }}>سجّل الدخول</Link></span>
              <span className="en">Already have an account? <Link href="/login" style={{ color: "#D42B3C", textDecoration: "none" }}>Sign in</Link></span>
            </p>
          </div>
        </form>

        <div className="text-center mt-5">
          <Link href="/" className="text-[0.78rem]" style={{ color: "rgba(85,85,85,.45)", fontFamily: "'DM Sans',sans-serif", textDecoration: "none" }}>
            <span className="ar">← العودة للموقع</span>
            <span className="en">← Back to website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
