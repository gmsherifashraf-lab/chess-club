"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Room, RoomEvent, Track, ConnectionQuality } from "livekit-client";
import { connectToRoom, createClassroomRoom, mintClassroomToken } from "@/lib/classroom/livekit";
import { grantsFor } from "@/lib/classroom/permissions";
import { useClassroomSession } from "@/lib/classroom/use-classroom-session";
import { track } from "@/lib/analytics/track";
import type { ClassroomIdentity, ClassroomSessionInfo } from "@/lib/classroom/types";
import { StageBoard } from "./StageBoard";
import { VideoRail } from "./VideoRail";
import { ChatPanel } from "./ChatPanel";
import { ControlBar } from "./ControlBar";
import { CoachControlDeck } from "../coach/CoachControlDeck";
import { StudentControls } from "../student/StudentControls";
import { AttentionState } from "../student/AttentionState";
import { ConnectionMeter } from "../shared/ConnectionMeter";
import { ShareScreenTile } from "../shared/ShareScreenTile";

interface Props {
  identity: ClassroomIdentity;
  session: ClassroomSessionInfo;
  initialMic: boolean;
  initialCam: boolean;
}

type Quality = "excellent" | "good" | "poor" | "lost" | "unknown";

function mapQuality(q: ConnectionQuality): Quality {
  switch (q) {
    case ConnectionQuality.Excellent: return "excellent";
    case ConnectionQuality.Good: return "good";
    case ConnectionQuality.Poor: return "poor";
    case ConnectionQuality.Lost: return "lost";
    default: return "unknown";
  }
}

export function ClassroomRoom({ identity, session, initialMic, initialCam }: Props) {
  const router = useRouter();
  const grants = grantsFor(identity.role);
  const classroom = useClassroomSession({ sessionId: session.sessionId, identity });

  const [room, setRoom] = useState<Room | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [micOn, setMicOn] = useState(initialMic && grants.canPublishAudio);
  const [camOn, setCamOn] = useState(initialCam && grants.canPublishVideo);
  const [screenOn, setScreenOn] = useState(false);
  const [deckOpen, setDeckOpen] = useState(false);
  const [chatOpenMobile, setChatOpenMobile] = useState(false);
  const [engineOn, setEngineOn] = useState(false);
  const [quality, setQuality] = useState<Quality>("unknown");
  const roomRef = useRef<Room | null>(null);

  // Connect to LiveKit.
  useEffect(() => {
    let cancelled = false;
    let r: Room | null = null;

    (async () => {
      try {
        const { token, url } = await mintClassroomToken(session.sessionId);
        if (cancelled) return;
        r = createClassroomRoom();
        roomRef.current = r;
        r.on(RoomEvent.ConnectionQualityChanged, (q, p) => {
          if (p && p.identity === identity.userId) setQuality(mapQuality(q));
        });
        r.on(RoomEvent.Disconnected, () => setQuality("lost"));
        await connectToRoom(r, url, token);
        if (cancelled) {
          await r.disconnect();
          return;
        }
        if (grants.canPublishAudio && initialMic) await r.localParticipant.setMicrophoneEnabled(true);
        if (grants.canPublishVideo && initialCam) await r.localParticipant.setCameraEnabled(true);
        setRoom(r);
        await fetch(`/api/classroom/${session.sessionId}/attendance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "join" }),
        });
        track("classroom_joined", {
          sessionId: session.sessionId,
          role: identity.role,
          mic: initialMic,
          cam: initialCam,
        });
      } catch (e) {
        const msg = (e as Error).message || "Failed to connect";
        if (!cancelled) setConnectError(msg);
      }
    })();

    return () => {
      cancelled = true;
      (async () => {
        try {
          await fetch(`/api/classroom/${session.sessionId}/attendance`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "leave" }),
            keepalive: true,
          });
          track("classroom_left", { sessionId: session.sessionId });
        } catch {
          /* best-effort */
        }
        await r?.disconnect();
      })();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.sessionId]);

  // Sync presence with mic/cam state.
  useEffect(() => {
    classroom.updatePresence({ micOn, camOn });
  }, [micOn, camOn, classroom]);

  const toggleMic = useCallback(async () => {
    if (!room || !grants.canPublishAudio) return;
    const next = !micOn;
    await room.localParticipant.setMicrophoneEnabled(next);
    setMicOn(next);
  }, [grants.canPublishAudio, micOn, room]);

  const toggleCam = useCallback(async () => {
    if (!room || !grants.canPublishVideo) return;
    const next = !camOn;
    await room.localParticipant.setCameraEnabled(next);
    setCamOn(next);
  }, [grants.canPublishVideo, camOn, room]);

  const toggleScreen = useCallback(async () => {
    if (!room || !grants.canShareScreen) return;
    const next = !screenOn;
    try {
      await room.localParticipant.setScreenShareEnabled(next);
      setScreenOn(next);
    } catch {
      setScreenOn(false);
    }
  }, [grants.canShareScreen, room, screenOn]);

  const toggleHand = useCallback(async () => {
    if (classroom.myPresence.handRaised) {
      await classroom.lowerHand();
    } else {
      await classroom.raiseHand();
    }
  }, [classroom]);

  const muteOne = useCallback(
    async (userId: string) => {
      if (!room || !grants.canMuteOthers) return;
      const p = Array.from(room.remoteParticipants.values()).find((rp) => rp.identity === userId);
      if (!p) return;
      const audioPub = Array.from(p.trackPublications.values()).find(
        (pub) => pub.source === Track.Source.Microphone,
      );
      if (audioPub) {
        await room.localParticipant.publishData(
          new TextEncoder().encode(JSON.stringify({ kind: "request-mute", target: userId })),
          { reliable: true },
        );
      }
    },
    [grants.canMuteOthers, room],
  );

  const muteAll = useCallback(async () => {
    if (!room || !grants.canMuteOthers) return;
    await room.localParticipant.publishData(
      new TextEncoder().encode(JSON.stringify({ kind: "request-mute-all" })),
      { reliable: true },
    );
  }, [grants.canMuteOthers, room]);

  // Listen for coach's mute requests as a student.
  useEffect(() => {
    if (!room) return;
    const handler = async (
      payload: Uint8Array,
      _participant?: unknown,
    ) => {
      try {
        const msg = JSON.parse(new TextDecoder().decode(payload)) as { kind: string; target?: string };
        if (msg.kind === "request-mute-all" || (msg.kind === "request-mute" && msg.target === identity.userId)) {
          await room.localParticipant.setMicrophoneEnabled(false);
          setMicOn(false);
        }
      } catch {
        /* ignore malformed */
      }
    };
    room.on(RoomEvent.DataReceived, handler);
    return () => {
      room.off(RoomEvent.DataReceived, handler);
    };
  }, [room, identity.userId]);

  const endSession = useCallback(async () => {
    if (!grants.canEndSession) return;
    if (typeof window !== "undefined" && !window.confirm("End the class for everyone?")) return;
    await fetch(`/api/classroom/${session.sessionId}/end`, { method: "POST" });
    leave();
  }, [grants.canEndSession, session.sessionId]);

  const leave = useCallback(() => {
    router.push(identity.role === "coach" ? "/dashboard/coach" : "/dashboard");
  }, [identity.role, router]);

  const sendReaction = useCallback(
    async (reaction: "agree" | "ask" | "got-it") => {
      const map = { agree: "👍", ask: "❓", "got-it": "✓" } as const;
      await classroom.sendChat(map[reaction]);
    },
    [classroom],
  );

  const handleMove = useCallback(
    async (nextFen: string, uci: string) => {
      await classroom.pushBoard(nextFen, uci);
    },
    [classroom],
  );

  if (connectError) {
    return (
      <div className="eca-classroom" style={{ alignItems: "center", justifyContent: "center" }}>
        <div className="eca-cr-waiting">
          <h1>Could not connect</h1>
          <p style={{ color: "#5C6B88" }}>{connectError}</p>
          <button className="eca-cr-secondary" onClick={leave}>Back to dashboard</button>
        </div>
      </div>
    );
  }

  const handsForCoach = classroom.hands;

  return (
    <div className="eca-classroom">
      <header className="eca-cr-top">
        <div>
          <div className="eca-cr-title">{session.classTitle}</div>
          <span className="eca-cr-title-sub">
            Live · Coach {session.coachName}  ·  {classroom.participants.length} in room
          </span>
        </div>
        <ConnectionMeter quality={quality} />
      </header>

      <main className="eca-cr-stage" style={{ position: "relative" }}>
        <div className="eca-cr-board-col">
          <StageBoard
            fen={classroom.fen}
            lastMove={classroom.lastMove}
            ply={classroom.ply}
            canMove={grants.canMoveBoard}
            onMove={handleMove}
            engineLine={engineOn ? { score: "+0.20", pv: "(turn on in coach deck)" } : null}
          />
          <ShareScreenTile room={room} />
          {identity.role === "student" && (
            <StudentControls
              onReact={sendReaction}
              handRaised={classroom.myPresence.handRaised}
              onToggleHand={toggleHand}
            />
          )}
          <AttentionState connectionQuality={quality} />
        </div>

        <aside className="eca-cr-rail eca-cr-chat-rail">
          <VideoRail room={room} participants={classroom.participants} />
          <ChatPanel
            messages={classroom.chat}
            onSend={classroom.sendChat}
            canSend={grants.canSendChat}
            selfId={identity.userId}
          />
        </aside>

        <aside
          className="eca-cr-chat-sheet"
          data-open={chatOpenMobile}
          aria-hidden={!chatOpenMobile}
        >
          <ChatPanel
            messages={classroom.chat}
            onSend={classroom.sendChat}
            canSend={grants.canSendChat}
            selfId={identity.userId}
          />
        </aside>
      </main>

      <ControlBar
        micOn={micOn}
        camOn={camOn}
        screenOn={screenOn}
        handRaised={classroom.myPresence.handRaised}
        chatOpenMobile={chatOpenMobile}
        grants={grants}
        onToggleMic={toggleMic}
        onToggleCam={toggleCam}
        onToggleScreen={toggleScreen}
        onToggleHand={toggleHand}
        onToggleChat={() => setChatOpenMobile((v) => !v)}
        onOpenDeck={() => setDeckOpen(true)}
        onLeave={leave}
      />

      {identity.role === "coach" && (
        <CoachControlDeck
          open={deckOpen}
          onClose={() => setDeckOpen(false)}
          participants={classroom.participants}
          hands={handsForCoach}
          onAnswerHand={classroom.answerHand}
          onMute={muteOne}
          onMuteAll={muteAll}
          onEndSession={endSession}
          engineOn={engineOn}
          onToggleEngine={setEngineOn}
          evaluation={null}
        />
      )}
    </div>
  );
}
