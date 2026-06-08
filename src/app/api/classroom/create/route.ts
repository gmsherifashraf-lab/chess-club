import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/auth";

export const runtime = "nodejs";

interface CreateBody {
  classId?: string;
  /** Optional override; defaults to the class's primary_coach_id. */
  coachId?: string;
  /** ISO timestamp. Defaults to now. */
  startsAt?: string;
  /** Minutes. Defaults to 60. */
  durationMinutes?: number;
  /** If true: flip the new session to in_progress immediately. */
  startNow?: boolean;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as CreateBody;

  if (!body.classId) {
    return NextResponse.json({ error: "Missing classId" }, { status: 400 });
  }

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

  // Resolve the class and its primary coach.
  const { data: cls } = await supabase
    .from("classes")
    .select("id,primary_coach_id,title,is_active")
    .eq("id", body.classId)
    .maybeSingle();
  if (!cls) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }
  if (!cls.is_active) {
    return NextResponse.json({ error: "Class is inactive" }, { status: 409 });
  }

  // Resolve coach scoping. Coaches can only create sessions for classes
  // where they are the primary coach (or have an active coach assignment).
  let coachId: string | null = (body.coachId as string | undefined) ?? null;
  if (!coachId) coachId = (cls.primary_coach_id as string | null) ?? null;

  if (appRole === "coach") {
    const { data: coachRow } = await supabase
      .from("coaches")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!coachRow) {
      return NextResponse.json({ error: "No coach profile for this account" }, { status: 403 });
    }
    if (cls.primary_coach_id !== coachRow.id) {
      // Allow if there's an active coach_assignments row for them.
      const { data: assignment } = await supabase
        .from("coach_assignments")
        .select("id")
        .eq("class_id", body.classId)
        .eq("coach_id", coachRow.id)
        .maybeSingle();
      if (!assignment) {
        return NextResponse.json({ error: "You are not assigned to this class" }, { status: 403 });
      }
    }
    // A coach always books themselves, regardless of the body override.
    coachId = coachRow.id as string;
  }

  // Time window. Clamp to a sane minimum so check (ends_at > starts_at) holds.
  const startsAt = body.startsAt ? new Date(body.startsAt) : new Date();
  const duration = Math.max(5, Math.min(360, body.durationMinutes ?? 60));
  const endsAt = new Date(startsAt.getTime() + duration * 60_000);

  const state = body.startNow ? "in_progress" : "scheduled";

  const { data: created, error } = await supabase
    .from("class_sessions")
    .insert({
      class_id: body.classId,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      coach_id: coachId,
      state,
    })
    .select("id,starts_at,ends_at,state")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    session: created,
    classTitle: cls.title as string,
  });
}
