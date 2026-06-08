import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

interface Body {
  action: "join" | "leave" | "heartbeat";
  handRaises?: number;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const body = (await req.json().catch(() => ({}))) as Body;

  if (!body.action) {
    return NextResponse.json({ error: "Missing action" }, { status: 400 });
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
    .select("id,class_id")
    .eq("id", sessionId)
    .maybeSingle();
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const { data: player } = await supabase
    .from("players")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!player) {
    return NextResponse.json({ ok: true, skipped: "not a player" });
  }

  const playerId = player.id as string;
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date().toISOString();

  if (body.action === "join") {
    await supabase.from("attendance").upsert(
      {
        player_id: playerId,
        date: today,
        session_id: sessionId,
        joined_at: now,
        status: "present",
      },
      { onConflict: "player_id,session_id" },
    );
  } else if (body.action === "leave") {
    const { data: row } = await supabase
      .from("attendance")
      .select("joined_at,active_seconds,hand_raises")
      .eq("player_id", playerId)
      .eq("session_id", sessionId)
      .maybeSingle();
    let activeSeconds = (row?.active_seconds as number | undefined) ?? 0;
    if (row?.joined_at) {
      const delta = Math.max(0, (Date.now() - new Date(row.joined_at as string).getTime()) / 1000);
      activeSeconds += Math.round(delta);
    }
    await supabase
      .from("attendance")
      .update({
        left_at: now,
        active_seconds: activeSeconds,
        hand_raises: body.handRaises ?? (row?.hand_raises as number | undefined) ?? 0,
      })
      .eq("player_id", playerId)
      .eq("session_id", sessionId);
  } else if (body.action === "heartbeat") {
    await supabase
      .from("attendance")
      .update({ hand_raises: body.handRaises ?? 0 })
      .eq("player_id", playerId)
      .eq("session_id", sessionId);
  }

  return NextResponse.json({ ok: true });
}
