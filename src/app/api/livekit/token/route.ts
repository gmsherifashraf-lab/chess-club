import { NextResponse } from "next/server";
import { AccessToken, TrackSource } from "livekit-server-sdk";
import { createClient } from "@/lib/supabase/server";
import { classroomRoleFor, grantsFor } from "@/lib/classroom/permissions";
import type { UserRole } from "@/lib/auth";
import type { SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

interface Body {
  sessionId?: string;
}

/**
 * Confirm the caller belongs in this session before minting a room token.
 * This is an explicit gate that does not lean on the RLS read of the session
 * above — so an IDOR can't reach the token mint even if a SELECT policy
 * regresses. Editors have no classroom seat; admins join any room.
 */
async function isSessionMember(
  supabase: SupabaseClient,
  userId: string,
  appRole: UserRole,
  session: { class_id: string; coach_id: string | null },
): Promise<boolean> {
  if (appRole === "admin") return true;

  if (appRole === "coach") {
    const { data: coachRow } = await supabase
      .from("coaches")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    return !!coachRow && coachRow.id === session.coach_id;
  }

  if (appRole === "player") {
    const { data } = await supabase
      .from("class_enrollments")
      .select("id, players!inner(profile_id)")
      .eq("class_id", session.class_id)
      .eq("players.profile_id", userId)
      .maybeSingle();
    return !!data;
  }

  if (appRole === "parent") {
    const { data: kids } = await supabase
      .from("parent_player_relationships")
      .select("player_id")
      .eq("parent_id", userId);
    const childIds = (kids ?? []).map((k) => k.player_id as string);
    if (childIds.length === 0) return false;
    const { data } = await supabase
      .from("class_enrollments")
      .select("id, players!inner(profile_id)")
      .eq("class_id", session.class_id)
      .in("players.profile_id", childIds)
      .limit(1);
    return !!data && data.length > 0;
  }

  return false;
}

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_LIVEKIT_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!url || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        error:
          "LiveKit is not configured. Set NEXT_PUBLIC_LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET in .env.local.",
      },
      { status: 503 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as Body;
  const sessionId = body.sessionId;
  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: session } = await supabase
    .from("class_sessions")
    .select("id,class_id,coach_id,state,starts_at,ends_at")
    .eq("id", sessionId)
    .maybeSingle();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const appRole = (user.user_metadata?.role ?? "parent") as UserRole;
  const classroomRole = classroomRoleFor(appRole);
  const grants = grantsFor(classroomRole);

  const authorized = await isSessionMember(supabase, user.id, appRole, session);
  if (!authorized) {
    return NextResponse.json({ error: "Not authorized for this session" }, { status: 403 });
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined)?.split("—")[0]?.trim() ||
    (user.email ?? "Participant");

  const at = new AccessToken(apiKey, apiSecret, {
    identity: user.id,
    name: displayName,
    ttl: "2h",
  });

  at.addGrant({
    room: `eca-classroom-${sessionId}`,
    roomJoin: true,
    canPublish: grants.canPublishVideo || grants.canPublishAudio,
    canPublishData: true,
    canSubscribe: true,
    canPublishSources: [
      ...(grants.canPublishVideo ? [TrackSource.CAMERA] : []),
      ...(grants.canPublishAudio ? [TrackSource.MICROPHONE] : []),
      ...(grants.canShareScreen
        ? [TrackSource.SCREEN_SHARE, TrackSource.SCREEN_SHARE_AUDIO]
        : []),
    ],
  });

  const token = await at.toJwt();

  return NextResponse.json({ token, url });
}
