"use client";

import { Hand } from "lucide-react";
import type { RaiseHandEntry } from "@/lib/classroom/types";

interface Props {
  hands: RaiseHandEntry[];
  onAnswer: (entryId: string) => void;
  compact?: boolean;
}

export function RaiseHandQueue({ hands, onAnswer, compact }: Props) {
  if (hands.length === 0) {
    return compact ? null : (
      <p style={{ fontSize: ".75rem", color: "var(--eca-muted-on-navy)" }}>
        No hands raised.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
      {hands.map((h, i) => (
        <div
          key={h.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: ".5rem",
            padding: ".4rem .55rem",
            background: "rgba(0, 79, 188, 0.12)",
            border: "1px solid rgba(0, 79, 188, 0.5)",
            borderRadius: 4,
            fontSize: ".78rem",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
            <Hand size={12} />
            <span style={{ opacity: 0.7, fontFamily: "var(--font-mono, monospace)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{h.studentName}</span>
          </span>
          <button
            type="button"
            onClick={() => onAnswer(h.id)}
            style={{
              fontSize: ".7rem",
              padding: ".2rem .55rem",
              background: "var(--eca-royal)",
              border: "1px solid var(--eca-royal)",
              color: "var(--eca-paper)",
              borderRadius: 3,
              cursor: "pointer",
            }}
          >
            Answer
          </button>
        </div>
      ))}
    </div>
  );
}
