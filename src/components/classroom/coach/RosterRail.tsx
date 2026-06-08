"use client";

import type { PresenceState, RaiseHandEntry } from "@/lib/classroom/types";

interface Props {
  participants: PresenceState[];
  hands: RaiseHandEntry[];
  onAnswerHand: (entryId: string) => void;
  onMute?: (userId: string) => void;
}

export function RosterRail({ participants, hands, onAnswerHand, onMute }: Props) {
  const handByUser = new Map(hands.map((h) => [h.studentId, h] as const));
  const sorted = [...participants].sort((a, b) => {
    if (a.handRaised !== b.handRaised) return a.handRaised ? -1 : 1;
    if (a.role !== b.role) return a.role === "coach" ? -1 : 1;
    return a.displayName.localeCompare(b.displayName);
  });

  if (sorted.length === 0) {
    return <p style={{ fontSize: ".78rem", color: "var(--eca-muted-on-navy)" }}>Waiting for students to join.</p>;
  }

  return (
    <div className="eca-cr-roster">
      {sorted.map((p) => {
        const handEntry = handByUser.get(p.userId);
        return (
          <div
            key={p.userId}
            className="eca-cr-roster-row"
            data-hand={p.handRaised || !!handEntry}
          >
            <span className="eca-cr-roster-name">
              <span className="eca-cr-roster-dot" aria-hidden />
              {p.displayName}
              {p.role === "coach" && (
                <span style={{ fontSize: ".62rem", color: "var(--eca-muted-on-navy)" }}>· coach</span>
              )}
            </span>
            <span className="eca-cr-roster-actions">
              {handEntry && (
                <button
                  type="button"
                  data-primary="true"
                  onClick={() => onAnswerHand(handEntry.id)}
                >
                  Answer
                </button>
              )}
              {onMute && p.micOn && p.role !== "coach" && (
                <button type="button" onClick={() => onMute(p.userId)}>
                  Mute
                </button>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
