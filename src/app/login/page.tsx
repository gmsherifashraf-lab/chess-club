"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signIn, ROLE_DASHBOARD, type UserRole } from "@/lib/auth";
import { useLang } from "@/context/LangContext";
import { LOGO_URI } from "@/lib/logo";

// ── Role cards shown on the login screen ────────────────────────────────────
const ROLES: { key: UserRole; icon: string; ar: string; en: string; descAr: string; descEn: string }[] = [
  { key: "admin",  icon: "🛡", ar: "المدير",        en: "Admin",  descAr: "صلاحيات كاملة",  descEn: "Full Access"     },
  { key: "coach",  icon: "🎓", ar: "المدربة",       en: "Coach",  descAr: "بوابة التدريب",  descEn: "Teaching Portal" },
  { key: "parent", icon: "👨‍👧", ar: "ولي الأمر",    en: "Parent", descAr: "متابعة الابنة",  descEn: "Child Progress"  },
  { key: "board",  icon: "📊", ar: "مجلس الإدارة", en: "Board",  descAr: "الحوكمة",         descEn: "Governance"      },
];

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const { lang } = useLang();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const supabase     = createClient();

  // "next" param lets middleware preserve the originally-requested URL
  const nextPath = searchParams.get("next") ?? "";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [selected, setSelected] = useState<UserRole | null>(null);

  // Clear error whenever the user edits
  useEffect(() => { setError(null); }, [email, password]);

  // ── Submit handler ───────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError(lang === "ar" ? "يرجى إدخال البريد وكلمة المرور" : "Please enter your email and password");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: authError, dashboard } = await signIn(supabase, { email, password });

    if (authError) {
      setError(friendlyError(authError, lang));
      setLoading(false);
      return;
    }

    // Redirect to the "next" param if middleware set one, else the role dashboard
    router.push(nextPath || dashboard || "/dashboard/parent");
    router.refresh(); // flush server-component cache so layout reads new session
  }

  // ── Role-card quick-select (pre-fills a demo account for that role) ───────
  function handleRoleSelect(role: UserRole) {
    setSelected(role);
    // In production remove these; they let testers click a role to autofill
    // demo credentials stored in your Supabase project.
    setEmail(`${role}@chesssharjah.ae`);
    setPassword("Demo1234!");
    setError(null);
  }

  return (
    <div className="min-h-screen" style={{ background: "#EDE9E2", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", paddingTop: "5rem" }}>
      <div style={{ maxWidth: 440, width: "100%" }}>

        {/* ── Logo + heading ── */}
        <div style={{ textAlign: "center", marginBottom: "2.75rem" }}>
          <img src={LOGO_URI} alt="Club Logo" style={{ height: 88, width: "auto", display: "block", margin: "0 auto 1.25rem" }} />
          <div className="flag-h" style={{ width: 72, margin: "0 auto 1.25rem" }} />
          <h2 className="font-disp t-h3" style={{ color: "#141414", marginBottom: ".35rem" }}>
            <span className="ar">بوابة الدخول</span>
            <span className="en">Portal Login</span>
          </h2>
          <p style={{ fontSize: ".82rem", color: "#555", fontFamily: "'Noto Sans Arabic', 'DM Sans', sans-serif" }}>
            <span className="ar">اختاري دورك أو سجّلي الدخول مباشرةً</span>
            <span className="en">Select your role or sign in directly</span>
          </p>
        </div>

        {/* ── Role cards ── */}
        <div className="g2" style={{ gap: ".75rem", marginBottom: "2rem" }}>
          {ROLES.map((role) => (
            <button
              key={role.key}
              onClick={() => handleRoleSelect(role.key)}
              style={{
                background: "#fff",
                border: selected === role.key
                  ? "2px solid #D42B3C"
                  : "1px solid #D6D0C4",
                padding: "1.25rem",
                cursor: "pointer",
                textAlign: lang === "ar" ? "right" : "left",
                transition: "all .2s",
                transform: selected === role.key ? "translateY(-2px)" : "none",
              }}
            >
              <div style={{ fontSize: "1.25rem", marginBottom: ".4rem" }}>{role.icon}</div>
              <div className="font-disp" style={{ fontSize: ".9rem", color: "#141414", marginBottom: ".2rem" }}>
                <span className="ar">{role.ar}</span>
                <span className="en">{role.en}</span>
              </div>
              <div className="label-xs" style={{ opacity: .45 }}>
                <span className="ar">{role.descAr}</span>
                <span className="en">{role.descEn}</span>
              </div>
            </button>
          ))}
        </div>

        {/* ── Divider ── */}
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.5rem" }}>
          <div style={{ flex: 1, height: 1, background: "#D6D0C4" }} />
          <span className="label-xs" style={{ opacity: .4 }}>
            <span className="ar">أو</span>
            <span className="en">or</span>
          </span>
          <div style={{ flex: 1, height: 1, background: "#D6D0C4" }} />
        </div>

        {/* ── Sign-in form ── */}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ background: "#fff", border: "1px solid #D6D0C4", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Error banner */}
            {error && (
              <div style={{ background: "rgba(212,43,60,.08)", border: "1px solid rgba(212,43,60,.25)", padding: ".75rem 1rem", fontSize: ".82rem", color: "#B02030", fontFamily: "'Noto Sans Arabic','DM Sans',sans-serif" }}>
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="form-lbl">
                <span className="ar">البريد الإلكتروني</span>
                <span className="en">Email Address</span>
              </label>
              <input
                className="form-inp"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="form-lbl">
                <span className="ar">كلمة المرور</span>
                <span className="en">Password</span>
              </label>
              <input
                className="form-inp"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
              style={{ justifyContent: "center", opacity: loading ? .7 : 1 }}
            >
              {loading ? (
                <span className="ar">جاري الدخول…</span>
              ) : (
                <span className="ar">دخول</span>
              )}
              {loading ? (
                <span className="en">Signing in…</span>
              ) : (
                <span className="en">Sign In</span>
              )}
            </button>

            {/* Register link */}
            <p style={{ textAlign: "center", fontSize: ".78rem", color: "#555", fontFamily: "'Noto Sans Arabic','DM Sans',sans-serif" }}>
              <span className="ar">
                ليس لديك حساب؟{" "}
                <Link href="/register/academy" style={{ color: "#D42B3C", textDecoration: "none" }}>سجّلي الآن</Link>
              </span>
              <span className="en">
                No account?{" "}
                <Link href="/register/academy" style={{ color: "#D42B3C", textDecoration: "none" }}>Enroll now</Link>
              </span>
            </p>
          </div>
        </form>

        {/* ── Back to site ── */}
        <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
          <Link href="/" style={{ fontSize: ".78rem", color: "rgba(85,85,85,.45)", fontFamily: "'DM Sans',sans-serif", textDecoration: "none" }}>
            <span className="ar">← العودة للموقع</span>
            <span className="en">← Back to website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Map raw Supabase errors → friendly bilingual messages ────────────────────
function friendlyError(msg: string, lang: string): string {
  const m = msg.toLowerCase();
  const isAr = lang === "ar";

  if (m.includes("invalid login credentials") || m.includes("invalid email or password"))
    return isAr ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Incorrect email or password";

  if (m.includes("email not confirmed"))
    return isAr
      ? "يرجى تأكيد بريدك الإلكتروني أولاً — تحقق من صندوق الوارد"
      : "Please confirm your email first — check your inbox";

  if (m.includes("too many requests") || m.includes("rate limit"))
    return isAr
      ? "محاولات كثيرة. يرجى الانتظار دقيقة ثم المحاولة مجدداً"
      : "Too many attempts. Please wait a minute and try again";

  if (m.includes("network") || m.includes("fetch"))
    return isAr ? "خطأ في الاتصال. تحقق من الإنترنت وحاول مجدداً" : "Connection error. Check your internet and retry";

  return isAr ? `خطأ: ${msg}` : `Error: ${msg}`;
}
