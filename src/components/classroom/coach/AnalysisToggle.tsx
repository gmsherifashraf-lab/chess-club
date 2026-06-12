"use client";

import { useState } from "react";
import { Cpu } from "lucide-react";

interface Props {
  on: boolean;
  onToggle: (next: boolean) => void;
  evaluation: { score: string; pv: string; depth: number } | null;
}

export function AnalysisToggle({ on, onToggle, evaluation }: Props) {
  return (
    <div className="eca-cr-engine">
      <label
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: ".5rem",
          cursor: "pointer",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
          <Cpu size={13} />
          <span>Stockfish</span>
        </span>
        <input
          type="checkbox"
          checked={on}
          onChange={(e) => onToggle(e.target.checked)}
          aria-label="Toggle analysis engine"
        />
      </label>
      {on && evaluation && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--eca-periwinkle)" }}>{evaluation.score}</span>
          <span style={{ opacity: 0.7 }}>d{evaluation.depth}</span>
        </div>
      )}
      {on && evaluation && (
        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {evaluation.pv}
        </div>
      )}
      {!on && (
        <div style={{ opacity: 0.55, fontSize: ".68rem" }}>
          Students never see the eval; this is your private overlay.
        </div>
      )}
    </div>
  );
}
