"use client";

import { X } from "lucide-react";
import type { PresenceState, RaiseHandEntry } from "@/lib/classroom/types";
import { RosterRail } from "./RosterRail";
import { AnalysisToggle } from "./AnalysisToggle";

interface Props {
  open: boolean;
  onClose: () => void;
  participants: PresenceState[];
  hands: RaiseHandEntry[];
  onAnswerHand: (entryId: string) => void;
  onMute: (userId: string) => void;
  onMuteAll: () => void;
  onEndSession: () => void;
  engineOn: boolean;
  onToggleEngine: (next: boolean) => void;
  evaluation: { score: string; pv: string; depth: number } | null;
}

export function CoachControlDeck({
  open, onClose, participants, hands, onAnswerHand, onMute,
  onMuteAll, onEndSession, engineOn, onToggleEngine, evaluation,
}: Props) {
  return (
    <aside
      className="eca-cr-deck"
      data-open={open}
      aria-hidden={!open}
      role="complementary"
      aria-label="Coach controls"
    >
      <div className="eca-cr-deck-head">
        <div>
          <div className="eca-cr-deck-eyebrow">Coach controls</div>
          <div style={{ fontFamily: "var(--font-bodoni, 'Bodoni Moda', serif)", fontSize: "1rem" }}>
            The room is yours
          </div>
        </div>
        <button className="eca-cr-deck-close" onClick={onClose} aria-label="Close coach deck">
          <X size={18} />
        </button>
      </div>

      <div className="eca-cr-deck-section">
        <h4>Roster</h4>
        <RosterRail
          participants={participants}
          hands={hands}
          onAnswerHand={onAnswerHand}
          onMute={onMute}
        />
      </div>

      <div className="eca-cr-deck-section">
        <h4>Analysis</h4>
        <AnalysisToggle on={engineOn} onToggle={onToggleEngine} evaluation={evaluation} />
      </div>

      <div className="eca-cr-deck-section" style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <button className="eca-cr-secondary" onClick={onMuteAll}>
          Mute everyone
        </button>
        <button
          className="eca-cr-primary"
          style={{ background: "rgba(214, 64, 84, 0.92)", borderColor: "rgba(214, 64, 84, 0.92)" }}
          onClick={onEndSession}
        >
          End class
        </button>
      </div>
    </aside>
  );
}
