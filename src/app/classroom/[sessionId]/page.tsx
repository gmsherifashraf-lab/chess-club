import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { classroomRoleFor } from "@/lib/classroom/permissions";
import type { UserRole } from "@/lib/auth";
import { ClassroomGateClient } from "./ClassroomGateClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function ClassroomPage({ params }: PageProps) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/classroom/${sessionId}`);
  }

  const { data: session } = await supabase
    .from("class_sessions")
    .select(
      "id,class_id,state,starts_at,ends_at,coach_id,classes(title),coaches(profiles(full_name))",
    )
    .eq("id", sessionId)
    .maybeSingle();

  if (!session) notFound();

  const appRole = (user.user_metadata?.role ?? "parent") as UserRole;
  const role = classroomRoleFor(appRole);
  const displayName =
    (user.user_metadata?.full_name as string | undefined)?.split("—")[0]?.trim() ||
    user.email ||
    "Participant";

  const classTitle =
    (session.classes as { title?: string } | null)?.title ?? "Live class";
  const coachName =
    ((session.coaches as { profiles?: { full_name?: string } } | null)
      ?.profiles?.full_name as string | undefined)?.split("—")[0]?.trim() ?? "your coach";

  const startsAt = session.starts_at as string;
  const endsAt = session.ends_at as string;
  const state = session.state as "scheduled" | "in_progress" | "completed" | "cancelled";

  if (state === "completed" || state === "cancelled") {
    return (
      <div className="eca-classroom" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="eca-cr-waiting">
          <div className="eca-cr-waiting-meta">Class is over</div>
          <h1>{classTitle}</h1>
          <p style={{ color: "#5C6B88" }}>
            This session has ended. Your coach will follow up with the recap.
          </p>
          <Link href="/dashboard" className="eca-cr-primary" style={{ textDecoration: "none", textAlign: "center" }}>
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ClassroomGateClient
      identity={{
        userId: user.id,
        profileId: user.id,
        displayName,
        role,
        appRole,
      }}
      session={{
        sessionId,
        classId: session.class_id as string,
        classTitle,
        coachName,
        startsAt,
        endsAt,
        state,
      }}
    />
  );
}
