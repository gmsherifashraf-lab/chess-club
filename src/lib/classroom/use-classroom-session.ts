"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { createClient } from "@/lib/supabase/client";
import { joinBoardChannel, loadLatestBoardSnapshot, persistBoardSnapshot } from "./board-channel";
import { joinChatChannel, loadChatHistory } from "./chat-channel";
import { joinPresence } from "./presence";
import {
  type BoardPushPayload,
  type ChatMessage,
  type ClassroomIdentity,
  type PresenceState,
  type RaiseHandEntry,
} from "./types";

interface UseClassroomArgs {
  sessionId: string;
  identity: ClassroomIdentity;
}

export interface ClassroomState {
  fen: string;
  lastMove: string | null;
  ply: number;
  pushBoard: (fen: string, lastMove?: string) => Promise<void>;

  chat: ChatMessage[];
  sendChat: (body: string) => Promise<void>;

  participants: PresenceState[];
  myPresence: PresenceState;
  updatePresence: (patch: Partial<PresenceState>) => Promise<void>;

  hands: RaiseHandEntry[];
  raiseHand: () => Promise<void>;
  lowerHand: (entryId?: string) => Promise<void>;
  answerHand: (entryId: string) => Promise<void>;

  ready: boolean;
  error: string | null;
}

const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function useClassroomSession({ sessionId, identity }: UseClassroomArgs): ClassroomState {
  const supabase = useMemo(() => createClient(), []);

  const [fen, setFen] = useState(STARTING_FEN);
  const [lastMove, setLastMove] = useState<string | null>(null);
  const [ply, setPly] = useState(0);

  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<PresenceState[]>([]);
  const [hands, setHands] = useState<RaiseHandEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const myPresenceRef = useRef<PresenceState>({
    userId: identity.userId,
    displayName: identity.displayName,
    role: identity.role,
    joinedAt: Date.now(),
    micOn: false,
    camOn: false,
    handRaised: false,
  });

  const boardRef = useRef<ReturnType<typeof joinBoardChannel> | null>(null);
  const chatRef = useRef<ReturnType<typeof joinChatChannel> | null>(null);
  const presenceRef = useRef<ReturnType<typeof joinPresence> | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [snapshot, history] = await Promise.all([
          loadLatestBoardSnapshot(supabase, sessionId),
          loadChatHistory(supabase, sessionId),
        ]);
        if (cancelled) return;
        if (snapshot) {
          setFen(snapshot.fen);
          setLastMove(snapshot.lastMove);
          setPly(snapshot.ply);
        }
        setChat(history);

        const board = joinBoardChannel(supabase, sessionId);
        board.onPush((payload) => {
          setFen(payload.fen);
          setLastMove(payload.lastMove ?? null);
          setPly(payload.ply);
        });
        boardRef.current = board;

        const chatChan = joinChatChannel(supabase, sessionId);
        chatChan.onMessage((msg) => {
          setChat((prev) => (prev.find((m) => m.id === msg.id) ? prev : [...prev, msg]));
        });
        chatRef.current = chatChan;

        const presence = joinPresence(supabase, sessionId, myPresenceRef.current);
        presence.onChange((states) => setParticipants(states));
        presenceRef.current = presence;

        const { data: handRows } = await supabase
          .from("raise_hand_events")
          .select("id,student_id,raised_at,answered_at")
          .eq("session_id", sessionId)
          .is("answered_at", null)
          .order("raised_at", { ascending: true });

        if (handRows && !cancelled) {
          const studentIds = Array.from(new Set(handRows.map((r) => r.student_id as string)));
          const namesById = new Map<string, string>();
          if (studentIds.length > 0) {
            const { data: profiles } = await supabase
              .from("profiles")
              .select("id,full_name")
              .in("id", studentIds);
            for (const p of profiles ?? []) {
              namesById.set(p.id as string, (p.full_name as string) ?? "Student");
            }
          }
          setHands(
            handRows.map((row) => ({
              id: row.id as string,
              studentId: row.student_id as string,
              studentName: namesById.get(row.student_id as string) ?? "Student",
              raisedAt: new Date(row.raised_at as string).getTime(),
              answered: false,
            })),
          );
        }

        const handSub = supabase
          .channel(`classroom:${sessionId}:hand-db`)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "raise_hand_events", filter: `session_id=eq.${sessionId}` },
            (payload) => {
              if (payload.eventType === "INSERT") {
                const row = payload.new as { id: string; student_id: string; raised_at: string };
                setHands((prev) => [
                  ...prev,
                  {
                    id: row.id,
                    studentId: row.student_id,
                    studentName: "Student",
                    raisedAt: new Date(row.raised_at).getTime(),
                    answered: false,
                  },
                ]);
              } else if (payload.eventType === "UPDATE") {
                const row = payload.new as { id: string; answered_at: string | null };
                if (row.answered_at) {
                  setHands((prev) => prev.filter((h) => h.id !== row.id));
                }
              }
            },
          )
          .subscribe();

        setReady(true);

        return () => {
          handSub.unsubscribe();
        };
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    })();

    return () => {
      cancelled = true;
      boardRef.current?.unsubscribe();
      chatRef.current?.unsubscribe();
      presenceRef.current?.unsubscribe();
    };
  }, [sessionId, supabase]);

  const pushBoard = useCallback(
    async (nextFen: string, mv?: string) => {
      const chess = new Chess(nextFen);
      const nextPly = chess.history().length;
      const payload: BoardPushPayload = {
        fen: nextFen,
        lastMove: mv,
        ply: nextPly,
        pushedBy: identity.userId,
        at: Date.now(),
      };
      setFen(nextFen);
      setLastMove(mv ?? null);
      setPly(nextPly);
      await boardRef.current?.push(payload);
      await persistBoardSnapshot(supabase, sessionId, nextFen, mv, nextPly, identity.profileId);
    },
    [identity.profileId, identity.userId, sessionId, supabase],
  );

  const sendChat = useCallback(
    async (body: string) => {
      const trimmed = body.trim();
      if (!trimmed) return;
      await chatRef.current?.send({
        sessionId,
        authorId: identity.userId,
        authorName: identity.displayName,
        kind: "message",
        body: trimmed.slice(0, 2000),
      });
    },
    [identity.displayName, identity.userId, sessionId],
  );

  const updatePresence = useCallback(async (patch: Partial<PresenceState>) => {
    myPresenceRef.current = { ...myPresenceRef.current, ...patch };
    await presenceRef.current?.update(patch);
  }, []);

  const raiseHand = useCallback(async () => {
    await updatePresence({ handRaised: true, handRaisedAt: Date.now() });
    await supabase.from("raise_hand_events").insert({
      session_id: sessionId,
      student_id: identity.userId,
    });
  }, [identity.userId, sessionId, supabase, updatePresence]);

  const lowerHand = useCallback(
    async (entryId?: string) => {
      await updatePresence({ handRaised: false, handRaisedAt: undefined });
      if (entryId) {
        await supabase
          .from("raise_hand_events")
          .update({ answered_at: new Date().toISOString(), answered_by: identity.userId })
          .eq("id", entryId);
      } else {
        await supabase
          .from("raise_hand_events")
          .update({ answered_at: new Date().toISOString() })
          .eq("session_id", sessionId)
          .eq("student_id", identity.userId)
          .is("answered_at", null);
      }
    },
    [identity.userId, sessionId, supabase, updatePresence],
  );

  const answerHand = useCallback(
    async (entryId: string) => {
      await supabase
        .from("raise_hand_events")
        .update({ answered_at: new Date().toISOString(), answered_by: identity.userId })
        .eq("id", entryId);
    },
    [identity.userId, supabase],
  );

  return {
    fen,
    lastMove,
    ply,
    pushBoard,
    chat,
    sendChat,
    participants,
    myPresence: myPresenceRef.current,
    updatePresence,
    hands,
    raiseHand,
    lowerHand,
    answerHand,
    ready,
    error,
  };
}
