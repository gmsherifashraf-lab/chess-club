"use client";

import { Hand, ThumbsUp, HelpCircle, CheckCircle2 } from "lucide-react";

interface Props {
  onReact: (reaction: "agree" | "ask" | "got-it") => void;
  handRaised: boolean;
  onToggleHand: () => void;
}

export function StudentControls({ onReact, handRaised, onToggleHand }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: ".5rem",
        padding: ".55rem .75rem",
        background: "rgba(11, 24, 48, 0.55)",
        border: "1px solid rgba(198, 204, 241, 0.10)",
        borderRadius: 6,
      }}
    >
      <button
        type="button"
        className="eca-cr-ctl"
        data-on={handRaised}
        onClick={onToggleHand}
        aria-pressed={handRaised}
        style={{ fontSize: ".78rem" }}
      >
        <Hand size={14} />
        <span>{handRaised ? "Hand raised" : "Raise hand"}</span>
      </button>

      <div className="eca-cr-reactions" aria-label="Quick reactions">
        <button
          type="button"
          className="eca-cr-reaction"
          onClick={() => onReact("agree")}
          aria-label="Agree"
          title="Agree"
        >
          <ThumbsUp size={14} />
        </button>
        <button
          type="button"
          className="eca-cr-reaction"
          onClick={() => onReact("ask")}
          aria-label="I have a question"
          title="Question"
        >
          <HelpCircle size={14} />
        </button>
        <button
          type="button"
          className="eca-cr-reaction"
          onClick={() => onReact("got-it")}
          aria-label="Got it"
          title="Understood"
        >
          <CheckCircle2 size={14} />
        </button>
      </div>
    </div>
  );
}
