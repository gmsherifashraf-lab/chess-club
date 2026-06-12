"use client";

import { useMemo, useState } from "react";
import { Chess } from "chess.js";
import { StageBoard } from "@/components/classroom/room/StageBoard";
import { ChatPanel } from "@/components/classroom/room/ChatPanel";
import { ControlBar } from "@/components/classroom/room/ControlBar";
import { CoachControlDeck } from "@/components/classroom/coach/CoachControlDeck";
import { StudentControls } from "@/components/classroom/student/StudentControls";
import { ConnectionMeter } from "@/components/classroom/shared/ConnectionMeter";
import { SessionSummaryCard } from "@/components/classroom/analytics/SessionSummaryCard";
import { EngagementSpark } from "@/components/classroom/analytics/EngagementSpark";
import { AttendanceHeatmap } from "@/components/classroom/analytics/AttendanceHeatmap";
import { grantsFor } from "@/lib/classroom/permissions";
import type { ChatMessage, PresenceState, RaiseHandEntry } from "@/lib/classroom/types";

// Fixed anchor so SSR and CSR agree on every derived timestamp.
const ANCHOR_ISO = "2026-05-20T16:00:00.000Z";
const ANCHOR_MS = Date.parse(ANCHOR_ISO);

const PRESENCE: PresenceState[] = [
  { userId: "coach-1", displayName: "Sherif Ashraf", role: "coach", joinedAt: ANCHOR_MS - 600000, micOn: true, camOn: true, handRaised: false },
  { userId: "you", displayName: "You (preview)", role: "student", joinedAt: ANCHOR_MS - 540000, micOn: false, camOn: false, handRaised: false },
  { userId: "p2", displayName: "Yara Khaled", role: "student", joinedAt: ANCHOR_MS - 510000, micOn: false, camOn: false, handRaised: true, handRaisedAt: ANCHOR_MS - 30000 },
  { userId: "p3", displayName: "Omar Hassan", role: "student", joinedAt: ANCHOR_MS - 480000, micOn: false, camOn: false, handRaised: false },
  { userId: "p4", displayName: "Layla Mostafa", role: "student", joinedAt: ANCHOR_MS - 470000, micOn: false, camOn: false, handRaised: false },
  { userId: "p5", displayName: "Karim Nabil", role: "student", joinedAt: ANCHOR_MS - 460000, micOn: false, camOn: false, handRaised: false },
];

const SEED_CHAT: ChatMessage[] = [
  { id: "c1", sessionId: "preview", authorId: "coach-1", authorName: "Sherif Ashraf", kind: "message", body: "Welcome back. Today: the Ruy Lopez exchange variation.", createdAt: "2026-05-20T15:52:00.000Z" },
  { id: "c2", sessionId: "preview", authorId: "p3", authorName: "Omar Hassan", kind: "message", body: "ready coach", createdAt: "2026-05-20T15:53:00.000Z" },
  { id: "c3", sessionId: "preview", authorId: "p2", authorName: "Yara Khaled", kind: "message", body: "Quick question on move 4", createdAt: "2026-05-20T15:59:00.000Z" },
];

const HANDS: RaiseHandEntry[] = [
  { id: "h1", studentId: "p2", studentName: "Yara Khaled", raisedAt: ANCHOR_MS - 30000, answered: false },
];

const SUMMARY = {
  sessionId: "preview",
  classTitle: "Advanced Tactics · Cohort B",
  startsAt: "2026-05-20T15:50:00.000Z",
  endsAt: "2026-05-20T16:30:00.000Z",
  attendees: 6,
  avgActiveSeconds: 1320,
  raiseHandCount: 3,
  chatMessageCount: 14,
  boardPlyCount: 18,
} as const;

// Deterministic heatmap: anchored to the same fixed date so SSR and CSR
// produce identical cells. Hand-tuned counts (no Math.random).
const HEATMAP: { date: string; count: number }[][] = (() => {
  const weeks: { date: string; count: number }[][] = [];
  const anchor = new Date(ANCHOR_ISO);
  for (let w = 11; w >= 0; w--) {
    const wk: { date: string; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const dt = new Date(anchor);
      dt.setUTCDate(dt.getUTCDate() - (w * 7 + (6 - d)));
      const seed = (dt.getUTCDate() * 7 + dt.getUTCMonth() * 31) % 9;
      wk.push({ date: dt.toISOString().slice(0, 10), count: seed > 4 ? seed - 2 : 0 });
    }
    weeks.push(wk);
  }
  return weeks;
})();

type Role = "coach" | "student";

export function ClassroomPreviewClient() {
  const [role, setRole] = useState<Role>("coach");
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [lastMove, setLastMove] = useState<string | null>(null);
  const [ply, setPly] = useState(0);
  const [chat, setChat] = useState<ChatMessage[]>(SEED_CHAT);
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [screenOn, setScreenOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [chatOpenMobile, setChatOpenMobile] = useState(false);
  const [deckOpen, setDeckOpen] = useState(false);
  const [engineOn, setEngineOn] = useState(false);
  const [chatSeq, setChatSeq] = useState(SEED_CHAT.length);
  const grants = useMemo(() => grantsFor(role), [role]);

  function pushBoard(nextFen: string, uci: string) {
    const chess = new Chess(nextFen);
    setFen(nextFen);
    setLastMove(uci);
    setPly(chess.history().length);
  }

  function send(body: string) {
    // Use a real client-only timestamp here — only fires post-hydration so
    // there is no SSR mismatch surface.
    setChatSeq((n) => n + 1);
    setChat((prev) => [
      ...prev,
      {
        id: `c-live-${chatSeq + 1}`,
        sessionId: "preview",
        authorId: "you",
        authorName: role === "coach" ? "Sherif Ashraf" : "You (preview)",
        kind: "message",
        body,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  return (
    <div className="eca-classroom">
      <header className="eca-cr-top">
        <div>
          <div className="eca-cr-title">Advanced Tactics · Cohort B</div>
          <span className="eca-cr-title-sub">
            Live · Coach Sherif Ashraf · {PRESENCE.length} in room · Preview mode
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <ConnectionMeter quality="excellent" />
          <div
            style={{
              display: "inline-flex",
              border: "1px solid rgba(198, 204, 241, 0.18)",
              borderRadius: 5,
              overflow: "hidden",
              fontSize: ".72rem",
            }}
          >
            <button
              onClick={() => setRole("coach")}
              style={{
                padding: ".35rem .7rem",
                background: role === "coach" ? "var(--eca-royal)" : "transparent",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              View as Coach
            </button>
            <button
              onClick={() => setRole("student")}
              style={{
                padding: ".35rem .7rem",
                background: role === "student" ? "var(--eca-royal)" : "transparent",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              View as Student
            </button>
          </div>
        </div>
      </header>

      <main className="eca-cr-stage" style={{ position: "relative" }}>
        <div className="eca-cr-board-col">
          <StageBoard
            fen={fen}
            lastMove={lastMove}
            ply={ply}
            canMove={grants.canMoveBoard}
            onMove={pushBoard}
            engineLine={engineOn ? { score: "+0.42", pv: "Bxc6 dxc6 d3 Bd6" } : null}
          />
          {role === "student" && (
            <StudentControls
              onReact={(r) => send({ agree: "👍", ask: "❓", "got-it": "✓" }[r])}
              handRaised={handRaised}
              onToggleHand={() => setHandRaised((v) => !v)}
            />
          )}

          <div
            style={{
              marginTop: "1rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "0.75rem",
            }}
          >
            <SessionSummaryCard summary={SUMMARY} />
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
              <EngagementSpark
                values={[2, 4, 3, 6, 5, 7, 8, 6, 9, 8, 10, 9]}
                label="Engagement"
                trailingNumber="Strong"
              />
              <EngagementSpark
                values={[1, 0, 2, 1, 3, 2, 1, 0, 2, 3, 1, 2]}
                label="Hands raised"
                trailingNumber={11}
              />
            </div>
            <AttendanceHeatmap weeks={HEATMAP} />
          </div>
        </div>

        <aside className="eca-cr-rail eca-cr-chat-rail">
          <div className="eca-cr-tile-grid">
            {PRESENCE.map((p) => (
              <div
                key={p.userId}
                className="eca-cr-tile"
                data-coach={p.role === "coach"}
                data-speaking={p.role === "coach"}
              >
                <div className="eca-cr-tile-fallback">
                  {p.displayName.split(/\s+/).slice(0, 2).map((s) => s[0]).join("").toUpperCase()}
                </div>
                {p.handRaised && p.role !== "coach" && (
                  <span className="eca-cr-hand-pill">
                    <span style={{ fontSize: "0.7rem" }}>✋</span>
                    <span>raised</span>
                  </span>
                )}
                <div className="eca-cr-tile-label">
                  <span className="eca-cr-tile-label-name">
                    {p.role === "coach" ? "Coach " : ""}{p.displayName}
                  </span>
                  <span className="eca-cr-tile-icons">
                    {p.micOn ? "●" : "○"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <ChatPanel
            messages={chat}
            onSend={send}
            canSend={grants.canSendChat}
            selfId="you"
          />
        </aside>

        <aside className="eca-cr-chat-sheet" data-open={chatOpenMobile}>
          <ChatPanel
            messages={chat}
            onSend={send}
            canSend={grants.canSendChat}
            selfId="you"
          />
        </aside>
      </main>

      <ControlBar
        micOn={micOn}
        camOn={camOn}
        screenOn={screenOn}
        handRaised={handRaised}
        chatOpenMobile={chatOpenMobile}
        grants={grants}
        onToggleMic={() => setMicOn((v) => !v)}
        onToggleCam={() => setCamOn((v) => !v)}
        onToggleScreen={() => setScreenOn((v) => !v)}
        onToggleHand={() => setHandRaised((v) => !v)}
        onToggleChat={() => setChatOpenMobile((v) => !v)}
        onOpenDeck={() => setDeckOpen(true)}
        onLeave={() => alert("Preview: would return to dashboard")}
      />

      {role === "coach" && (
        <CoachControlDeck
          open={deckOpen}
          onClose={() => setDeckOpen(false)}
          participants={PRESENCE}
          hands={HANDS}
          onAnswerHand={() => alert("Preview: hand answered")}
          onMute={() => alert("Preview: mute sent")}
          onMuteAll={() => alert("Preview: mute-all sent")}
          onEndSession={() => alert("Preview: end class")}
          engineOn={engineOn}
          onToggleEngine={setEngineOn}
          evaluation={engineOn ? { score: "+0.42", pv: "Bxc6 dxc6 d3 Bd6", depth: 22 } : null}
        />
      )}
    </div>
  );
}
