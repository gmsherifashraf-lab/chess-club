import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const appRole = (user.user_metadata?.role ?? "parent") as UserRole;
  if (appRole !== "admin" && appRole !== "coach") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Coaches can only flip sessions they own. Admin can flip any.
  const { data: session } = await supabase
    .from("class_sessions")
    .select("id,coach_id,state")
    .eq("id", sessionId)
    .maybeSingle();
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (appRole === "coach") {
    const { data: coachRow } = await supabase
      .from("coaches")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!coachRow || coachRow.id !== session.coach_id) {
      return NextResponse.json({ error: "Not your session" }, { status: 403 });
    }
  }

  if (session.state === "completed") {
    return NextResponse.json({ ok: true, sessionId });
  }

  const { error } = await supabase
    .from("class_sessions")
    .update({ state: "completed" })
    .eq("id", sessionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, sessionId });
}
