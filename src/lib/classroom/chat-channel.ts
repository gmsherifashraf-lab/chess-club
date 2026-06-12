import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { CLASSROOM_CHANNEL, type ChatMessage } from "./types";

export interface ChatChannel {
  channel: RealtimeChannel;
  send: (msg: Omit<ChatMessage, "id" | "createdAt">) => Promise<void>;
  onMessage: (cb: (msg: ChatMessage) => void) => () => void;
  unsubscribe: () => Promise<void>;
}

export function joinChatChannel(
  supabase: SupabaseClient,
  sessionId: string,
): ChatChannel {
  const channel = supabase.channel(CLASSROOM_CHANNEL.chat(sessionId), {
    config: { broadcast: { self: true, ack: false } },
  });

  const listeners = new Set<(msg: ChatMessage) => void>();

  channel.on("broadcast", { event: "message" }, ({ payload }) => {
    for (const cb of listeners) cb(payload as ChatMessage);
  });

  channel.subscribe();

  return {
    channel,
    async send(msg) {
      const full: ChatMessage = {
        ...msg,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      await channel.send({ type: "broadcast", event: "message", payload: full });
      await supabase.from("session_chat_messages").insert({
        session_id: msg.sessionId,
        author_id: msg.authorId,
        author_name: msg.authorName,
        kind: msg.kind,
        body: msg.body,
      });
    },
    onMessage(cb) {
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

export async function loadChatHistory(
  supabase: SupabaseClient,
  sessionId: string,
  limit = 100,
): Promise<ChatMessage[]> {
  const { data } = await supabase
    .from("session_chat_messages")
    .select("id,session_id,author_id,author_name,kind,body,created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (!data) return [];
  return data.map((row) => ({
    id: row.id as string,
    sessionId: row.session_id as string,
    authorId: (row.author_id as string | null) ?? null,
    authorName: row.author_name as string,
    kind: row.kind as ChatMessage["kind"],
    body: row.body as string,
    createdAt: row.created_at as string,
  }));
}
