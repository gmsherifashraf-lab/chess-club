"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/context/AuthContext";
import { ROLE_NAV } from "@/lib/rbac";
import { ROLE_COLOR, ROLE_LABEL } from "@/lib/auth";
import PlayerTasks from "@/components/player/PlayerTasks";
import PlayerProfile from "@/components/player/PlayerProfile";

export default function PlayerDashboard() {
  const { loading } = useRequireAuth("player");
  const { profile } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("overview");

  // "play" is an external route (the chess workspace), not an in-page tab.
  const handleTab = (key: string) =>
    key === "play" ? router.push("/play") : setTab(key);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100 text-3xl text-text-4">
        ♟
      </div>
    );

  const name = profile?.full_name ?? profile?.email ?? "Player";
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <DashboardShell
      roleAr={ROLE_LABEL.player.ar}
      roleEn={ROLE_LABEL.player.en}
      roleColor={ROLE_COLOR.player}
      userInitial={initial}
      navItems={ROLE_NAV.player}
      activeTab={tab}
      onTab={handleTab}
    >
      {tab === "overview" && (
        <div className="rounded-[4px] border border-line bg-white p-8 shadow-card sm:p-10">
          <div className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-forest-700">
            <span className="ar">منطقة اللاعبة</span>
            <span className="en">Player Workspace</span>
          </div>
          <h2 className="mt-3 font-disp text-2xl font-bold text-text-1">
            <span className="ar">أهلاً، {name}</span>
            <span className="en">Welcome, {name}</span>
          </h2>
          <p className="mt-2 max-w-lg text-[0.95rem] leading-relaxed text-text-3">
            <span className="ar">
              تابعي مهامك، أرسلي إجاباتك، واطّلعي على ملاحظات المدرّبة
              وتقدّمك.
            </span>
            <span className="en">
              Track your tasks, submit your answers, and review coach
              feedback and your progress.
            </span>
          </p>
        </div>
      )}
      {tab === "tasks" && <PlayerTasks />}
      {tab === "history" && (
        <div className="rounded-[4px] border border-line bg-white p-10 text-center text-text-3 shadow-card">
          <span className="ar">سجل التسليمات متاح ضمن كل مهمة.</span>
          <span className="en">Submission history is available within each task.</span>
        </div>
      )}
      {tab === "profile" && <PlayerProfile />}
    </DashboardShell>
  );
}
