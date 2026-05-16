"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signIn } from "@/lib/auth";
import { useLang } from "@/context/LangContext";
import { LOGO_URI } from "@/lib/logo";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const FIELD =
  "w-full rounded-[2px] border border-line bg-white px-4 py-3 text-[0.95rem] text-text-1 outline-none transition-colors placeholder:text-text-4 focus:border-forest-700 focus:ring-2 focus:ring-forest-700/20 disabled:opacity-60";
const LABEL =
  "mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.18em] text-text-3";

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const nextPath = searchParams.get("next") ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(null);
  }, [email, password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError(
        lang === "ar"
          ? "يرجى إدخال البريد وكلمة المرور"
          : "Please enter your email and password",
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: authError, dashboard } = await signIn(supabase, {
        email,
        password,
      });
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-4 py-16">
      <div className="w-full max-w-[460px]">
        <div className="mb-9 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_URI}
            alt="Chess & Culture Club for Women — emblem"
            className="mx-auto mb-5"
            style={{ height: 84, width: "auto" }}
          />
          <div
            aria-hidden
            className="mx-auto mb-5 h-[3px] w-[72px] bg-[linear-gradient(90deg,#C8102E_33.3%,#fff_33.3%_66.6%,#117A4F_66.6%)]"
          />
          <h1 className="font-disp t-h3 text-text-1">
            <span className="ar">بوابة الدخول</span>
            <span className="en">Portal Login</span>
          </h1>
          <p className="mt-1.5 text-[0.9rem] text-text-3">
            <span className="ar">سجّلي الدخول للوصول إلى لوحة التحكم</span>
            <span className="en">Sign in to access your dashboard</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-4 rounded-[3px] border border-line bg-white p-7 shadow-card">
            {error && (
              <div
                role="alert"
                className="rounded-[2px] border border-scarlet-400/25 bg-scarlet-400/[0.07] px-4 py-3 text-[0.85rem] text-scarlet-600"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className={LABEL}>
                <span className="ar">البريد الإلكتروني</span>
                <span className="en">Email Address</span>
              </label>
              <input
                id="email"
                className={FIELD}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className={LABEL}>
                <span className="ar">كلمة المرور</span>
                <span className="en">Password</span>
              </label>
              <input
                id="password"
                className={FIELD}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                buttonVariants({ variant: "primary", size: "md", block: true }),
              )}
            >
              <span className="ar">{loading ? "جاري الدخول…" : "دخول"}</span>
              <span className="en">{loading ? "Signing in…" : "Sign In"}</span>
            </button>

            <p className="text-center text-[0.78rem] leading-relaxed text-text-4">
              <span className="ar">
                البوابة مخصّصة لإدارة النادي والمدربات والمحررات وأولياء
                الأمور.
              </span>
              <span className="en">
                This portal is for club staff, coaches, editors, and
                parents.
              </span>
            </p>
          </div>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <p className="text-[0.82rem] text-text-3">
            <span className="ar">
              ترغبين بالانضمام؟{" "}
              <Link
                href="/register"
                className="font-semibold text-forest-700 hover:underline"
              >
                سجّلي في النادي
              </Link>
            </span>
            <span className="en">
              Want to join?{" "}
              <Link
                href="/register"
                className="font-semibold text-forest-700 hover:underline"
              >
                Register with the club
              </Link>
            </span>
          </p>
          <Link
            href="/"
            className="text-[0.8rem] text-text-4 transition-colors hover:text-text-2"
          >
            <span className="ar">→ العودة للموقع</span>
            <span className="en">← Back to website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function friendlyError(msg: string, lang: string): string {
  const m = msg.toLowerCase();
  const isAr = lang === "ar";

  if (
    m.includes("invalid login credentials") ||
    m.includes("invalid email or password")
  )
    return isAr
      ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
      : "Incorrect email or password";

  if (m.includes("email not confirmed"))
    return isAr
      ? "يرجى تأكيد بريدك الإلكتروني أولاً — تحقق من صندوق الوارد"
      : "Please confirm your email first — check your inbox";

  if (m.includes("too many requests") || m.includes("rate limit"))
    return isAr
      ? "محاولات كثيرة. يرجى الانتظار دقيقة ثم المحاولة مجدداً"
      : "Too many attempts. Please wait a minute and try again";

  if (m.includes("network") || m.includes("fetch"))
    return isAr
      ? "خطأ في الاتصال. تحقق من الإنترنت وحاول مجدداً"
      : "Connection error. Check your internet and retry";

  return isAr ? `خطأ: ${msg}` : `Error: ${msg}`;
}
