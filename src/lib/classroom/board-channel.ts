import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { CLASSROOM_CHANNEL, type BoardPushPayload } from "./types";

export interface BoardChannel {
  channel: RealtimeChannel;
  push: (payload: BoardPushPayload) => Promise<void>;
  onPush: (cb: (payload: BoardPushPayload) => void) => () => void;
  unsubscribe: () => Promise<void>;
}

export function joinBoardChannel(
  supabase: SupabaseClient,
  sessionId: string,
): BoardChannel {
  const channel = supabase.channel(CLASSROOM_CHANNEL.board(sessionId), {
    config: { broadcast: { self: false, ack: false } },
  });

  const listeners = new Set<(payload: BoardPushPayload) => void>();

  channel.on("broadcast", { event: "push" }, ({ payload }) => {
    for (const cb of listeners) cb(payload as BoardPushPayload);
  });

  channel.subscribe();

  return {
    channel,
    async push(payload) {
      await channel.send({ type: "broadcast", event: "push", payload });
    },
    onPush(cb) {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    async unsubscribe() {
      await channel.unsubscribe();
    },
  };
}

/** Persist the current board state to session_board_states. Coach-only. */
export async function persistBoardSnapshot(
  supabase: SupabaseClient,
  sessionId: string,
  fen: string,
  lastMove: string | undefined,
  ply: number,
  profileId: string,
): Promise<void> {
  await supabase.from("session_board_states").insert({
    session_id: sessionId,
    fen,
    last_move: lastMove ?? null,
    ply,
    pushed_by: profileId,
  });
}

export async function loadLatestBoardSnapshot(
  supabase: SupabaseClient,
  sessionId: string,
): Promise<{ fen: string; lastMove: string | null; ply: number } | null> {
  const { data } = await supabase
    .from("session_board_states")
    .select("fen,last_move,ply")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  return {
    fen: data.fen as string,
    lastMove: (data.last_move as string | null) ?? null,
    ply: (data.ply as number) ?? 0,
  };
}
