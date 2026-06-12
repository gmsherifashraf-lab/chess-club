import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { CLASSROOM_CHANNEL, type PresenceState } from "./types";

export interface PresenceWrapper {
  channel: RealtimeChannel;
  track: (state: PresenceState) => Promise<void>;
  update: (patch: Partial<PresenceState>) => Promise<void>;
  unsubscribe: () => Promise<void>;
  snapshot: () => PresenceState[];
  onChange: (cb: (states: PresenceState[]) => void) => () => void;
}

export function joinPresence(
  supabase: SupabaseClient,
  sessionId: string,
  me: PresenceState,
): PresenceWrapper {
  const channel = supabase.channel(CLASSROOM_CHANNEL.presence(sessionId), {
    config: { presence: { key: me.userId } },
  });

  const listeners = new Set<(states: PresenceState[]) => void>();
  let currentState: PresenceState = me;

  function emit() {
    const raw = channel.presenceState() as Record<string, PresenceState[]>;
    const flat: PresenceState[] = [];
    for (const key of Object.keys(raw)) {
      const arr = raw[key];
      if (arr && arr.length > 0) flat.push(arr[arr.length - 1]);
    }
    for (const cb of listeners) cb(flat);
  }

  channel
    .on("presence", { event: "sync" }, emit)
    .on("presence", { event: "join" }, emit)
    .on("presence", { event: "leave" }, emit);

  channel.subscribe(async (status) => {
    if (status === "SUBSCRIBED") {
      await channel.track(currentState);
    }
  });

  return {
    channel,
    async track(state) {
      currentState = state;
      await channel.track(state);
    },
    async update(patch) {
      currentState = { ...currentState, ...patch };
      await channel.track(currentState);
    },
    async unsubscribe() {
      await channel.unsubscribe();
    },
    snapshot() {
      const raw = channel.presenceState() as Record<string, PresenceState[]>;
      const flat: PresenceState[] = [];
      for (const key of Object.keys(raw)) {
        const arr = raw[key];
        if (arr && arr.length > 0) flat.push(arr[arr.length - 1]);
      }
      return flat;
    },
    onChange(cb) {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
  };
}
