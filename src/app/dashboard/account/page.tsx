"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { ROLE_DASHBOARD, DEFAULT_DASHBOARD } from "@/lib/auth";

const FIELD =
  "w-full rounded-[2px] border border-line bg-white px-4 py-3 text-[0.95rem] text-text-1 outline-none transition-colors placeholder:text-text-4 focus:border-forest-700 focus:ring-2 focus:ring-forest-700/20 disabled:opacity-60";
const LABEL =
  "mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.16em] text-text-3";

export default function AccountPage() {
  const supabase = createClient();
  const router = useRouter();
  const { session, role, loading, profile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !session) router.replace("/login");
  }, [loading, session, router]);

  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name);
  }, [profile?.full_name]);

  if (loading || !session)
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100 text-3xl text-text-4">
        ♟
      </div>
    );

  const home = (role && ROLE_DASHBOARD[role]) || DEFAULT_DASHBOARD;

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() })
      .eq("id", session!.user.id);
    setBusy(false);
    if (error) {
      setMsg({ ok: false, text: error.message });
      return;
    }
    await refreshProfile();
    setMsg({ ok: true, text: "Name updated." });
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (pw.length < 8) {
      setMsg({ ok: false, text: "Password must be at least 8 characters." });
      return;
    }
    if (pw !== pw2) {
      setMsg({ ok: false, text: "Passwords do not match." });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) {
      setMsg({ ok: false, text: error.message });
      return;
    }
    setPw("");
    setPw2("");
    setMsg({ ok: true, text: "Password changed." });
  }

  return (
    <div className="min-h-screen bg-cream-100 px-4 py-16">
      <div className="mx-auto w-full max-w-[520px]">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-disp t-h3 text-text-1">
            <span className="ar">حسابي</span>
            <span className="en">My Account</span>
          </h1>
          <Link
            href={home}
            className="text-[0.82rem] font-semibold text-forest-700 hover:underline"
          >
            <span className="ar">→ لوحة التحكم</span>
            <span className="en">← Dashboard</span>
          </Link>
        </div>

        {msg && (
          <div
            role={msg.ok ? "status" : "alert"}
            className={`mb-5 rounded-[2px] border px-4 py-3 text-[0.85rem] ${
              msg.ok
                ? "border-forest-700/25 bg-forest-700/[0.07] text-forest-700"
                : "border-scarlet-400/25 bg-scarlet-400/[0.07] text-scarlet-600"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form
          onSubmit={saveName}
          className="mb-6 rounded-[3px] border border-line bg-white p-7 shadow-card"
        >
          <h2 className="mb-4 font-disp text-lg font-bold text-text-1">
            <span className="ar">الملف الشخصي</span>
            <span className="en">Profile</span>
          </h2>
          <label className={LABEL}>
            <span className="ar">الاسم الكامل</span>
            <span className="en">Full name</span>
          </label>
          <input
            className={FIELD}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={busy}
          />
          <p className="mt-3 text-[0.78rem] text-text-4">
            {session.user.email} ·{" "}
            <span className="ar">الدور: {role}</span>
            <span className="en">role: {role}</span>
          </p>
          <button
            type="submit"
            disabled={busy}
            className="mt-4 inline-flex h-11 items-center rounded-[2px] bg-forest-700 px-6 text-[0.85rem] font-semibold text-white transition-colors hover:bg-forest-600 disabled:opacity-60"
          >
            <span className="ar">حفظ الاسم</span>
            <span className="en">Save name</span>
          </button>
        </form>

        <form
          onSubmit={changePassword}
          className="rounded-[3px] border border-line bg-white p-7 shadow-card"
        >
          <h2 className="mb-1 font-disp text-lg font-bold text-text-1">
            <span className="ar">تغيير كلمة المرور</span>
            <span className="en">Change password</span>
          </h2>
          <p className="mb-4 text-[0.82rem] text-text-3">
            <span className="ar">
              إن سُجِّل حسابك من قِبل الإدارة بكلمة مرور مؤقتة، غيّريها الآن.
            </span>
            <span className="en">
              If an admin created your account with a temporary password,
              change it here.
            </span>
          </p>
          <label className={LABEL}>
            <span className="ar">كلمة المرور الجديدة</span>
            <span className="en">New password</span>
          </label>
          <input
            className={FIELD}
            type="password"
            autoComplete="new-password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            disabled={busy}
          />
          <label className={`${LABEL} mt-4`}>
            <span className="ar">تأكيد كلمة المرور</span>
            <span className="en">Confirm password</span>
          </label>
          <input
            className={FIELD}
            type="password"
            autoComplete="new-password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            disabled={busy}
          />
          <button
            type="submit"
            disabled={busy}
            className="mt-5 inline-flex h-11 items-center rounded-[2px] bg-forest-700 px-6 text-[0.85rem] font-semibold text-white transition-colors hover:bg-forest-600 disabled:opacity-60"
          >
            <span className="ar">{busy ? "…" : "تحديث كلمة المرور"}</span>
            <span className="en">{busy ? "…" : "Update password"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
