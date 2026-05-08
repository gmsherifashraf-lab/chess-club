"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signIn, type UserRole } from "@/lib/auth";
import { useLang } from "@/context/LangContext";
import { LOGO_URI } from "@/lib/logo";

// Three-role visual cards on the login screen.
const ROLES: { key: UserRole; icon: string; ar: string; en: string; descAr: string; descEn: string }[] = [
  { key: "admin",  icon: "🛡", ar: "المدير",  en: "Admin",  descAr: "صلاحيات كاملة",  descEn: "Full Access"     },
  { key: "coach",  icon: "🎓", ar: "المدرب",  en: "Coach",  descAr: "بوابة التدريب",  descEn: "Teaching Portal" },
  { key: "player", icon: "♟", ar: "اللاعب",  en: "Player", descAr: "المهام والتقدم", descEn: "Tasks & Progress" },
];

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const { lang }     = useLang();
  const searchParams = useSearchParams();
  const supabase     = createClient();

  const nextPath = searchParams.get("next") ?? "";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [selected, setSelected] = useState<UserRole | null>(null);

  useEffect(() => { setError(null); }, [email, password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError(lang === "ar" ? "يرجى إدخال البريد وكلمة المرور" : "Please enter your email and password");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: authError, dashboard } = await signIn(supabase, { email, password });
      if (authError) {
        setError(friendlyError(authError, lang));
        setLoading(false);
        return;
      }

      const target = nextPath || dashboard || "/dashboard/player";
      window.location.assign(target);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[login] signIn threw:", err);
      setError(friendlyError(msg, lang));
      setLoading(false);
    }
  }

  function handleRoleSelect(role: UserRole) {
    setSelected(role);
    // Demo credentials autofill — remove for production.
    setEmail(`${role}@chesssharjah.ae`);
    setPassword("Demo1234!");
    setError(null);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: "linear-gradient(135deg,#EDE9E2 0%,#F8F5F0 60%,#FAF7F2 100%)" }}>
      <div className="w-full max-w-[460px]">
        {/* Logo + heading */}
        <div className="text-center mb-10">
          <img src={LOGO_URI} alt="Club Logo" className="mx-auto mb-5" style={{ height: 88, width: "auto" }} />
          <div className="flag-h mx-auto mb-5" style={{ width: 72 }} />
          <h2 className="font-disp t-h3 mb-1" style={{ color: "#141414" }}>
            <span className="ar">بوابة الدخول</span>
            <span className="en">Portal Login</span>
          </h2>
          <p className="text-[0.85rem]" style={{ color: "#555", fontFamily: "'Noto Sans Arabic', 'DM Sans', sans-serif" }}>
            <span className="ar">اختر دورك أو سجّل الدخول مباشرةً</span>
            <span className="en">Select your role or sign in directly</span>
          </p>
        </div>

        {/* Role cards (3) */}
        <div className="grid grid-cols-3 gap-2 mb-7">
          {ROLES.map((role) => (
            <button
              key={role.key}
              onClick={() => handleRoleSelect(role.key)}
              className="role-card"
              style={{
                background: "#fff",
                border: selected === role.key ? "2px solid #D42B3C" : "1px solid #D6D0C4",
                padding: "1rem .75rem",
                cursor: "pointer",
                textAlign: "center",
                transition: "all .2s",
                transform: selected === role.key ? "translateY(-3px)" : "none",
                boxShadow: selected === role.key ? "0 14px 40px -18px rgba(212,43,60,.45)" : "none",
              }}
            >
              <div className="text-xl mb-1.5">{role.icon}</div>
              <div className="font-disp text-[0.85rem] mb-0.5" style={{ color: "#141414" }}>
                <span className="ar">{role.ar}</span>
                <span className="en">{role.en}</span>
              </div>
              <div className="label-xs" style={{ opacity: .5, fontSize: ".5rem" }}>
                <span className="ar">{role.descAr}</span>
                <span className="en">{role.descEn}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: "#D6D0C4" }} />
          <span className="label-xs" style={{ opacity: .4 }}>
            <span className="ar">أو</span>
            <span className="en">or</span>
          </span>
          <div className="flex-1 h-px" style={{ background: "#D6D0C4" }} />
        </div>

        {/* Sign-in form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white border" style={{ borderColor: "#D6D0C4", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {error && (
              <div className="text-[0.82rem]" style={{ background: "rgba(212,43,60,.08)", border: "1px solid rgba(212,43,60,.25)", padding: ".75rem 1rem", color: "#B02030", fontFamily: "'Noto Sans Arabic','DM Sans',sans-serif" }}>
                {error}
              </div>
            )}

            <div>
              <label className="form-lbl">
                <span className="ar">البريد الإلكتروني</span>
                <span className="en">Email Address</span>
              </label>
              <input className="form-inp" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
            </div>

            <div>
              <label className="form-lbl">
                <span className="ar">كلمة المرور</span>
                <span className="en">Password</span>
              </label>
              <input className="form-inp" type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full" style={{ justifyContent: "center", opacity: loading ? .7 : 1 }}>
              <span className="ar">{loading ? "جاري الدخول…" : "دخول"}</span>
              <span className="en">{loading ? "Signing in…"  : "Sign In"}</span>
            </button>

            <p className="text-center text-[0.78rem]" style={{ color: "#555", fontFamily: "'Noto Sans Arabic','DM Sans',sans-serif" }}>
              <span className="ar">
                ليس لديك حساب؟{" "}
                <Link href="/register" style={{ color: "#D42B3C", textDecoration: "none" }}>سجّل الآن</Link>
              </span>
              <span className="en">
                No account?{" "}
                <Link href="/register" style={{ color: "#D42B3C", textDecoration: "none" }}>Create one</Link>
              </span>
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

function friendlyError(msg: string, lang: string): string {
  const m    = msg.toLowerCase();
  const isAr = lang === "ar";

  if (m.includes("invalid login credentials") || m.includes("invalid email or password"))
    return isAr ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Incorrect email or password";

  if (m.includes("email not confirmed"))
    return isAr ? "يرجى تأكيد بريدك الإلكتروني أولاً — تحقق من صندوق الوارد" : "Please confirm your email first — check your inbox";

  if (m.includes("too many requests") || m.includes("rate limit"))
    return isAr ? "محاولات كثيرة. يرجى الانتظار دقيقة ثم المحاولة مجدداً" : "Too many attempts. Please wait a minute and try again";

  if (m.includes("network") || m.includes("fetch"))
    return isAr ? "خطأ في الاتصال. تحقق من الإنترنت وحاول مجدداً" : "Connection error. Check your internet and retry";

  return isAr ? `خطأ: ${msg}` : `Error: ${msg}`;
}
