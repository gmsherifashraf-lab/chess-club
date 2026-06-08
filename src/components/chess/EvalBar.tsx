"use client";

import { useMemo } from "react";
import { evalBarFraction, formatEval } from "@/lib/chess/notation";

interface EvalBarProps {
  scoreCp?: number;
  scoreMate?: number;
  sideToMove: "w" | "b";
  /** Show the score label in the bar. Default true. */
  showLabel?: boolean;
  /** Orientation of the bar (flipped follows board orientation). */
  flipped?: boolean;
}

/**
 * Vertical eval bar. White's territory at top (or bottom when `flipped`),
 * black's at the other end. Score is always rendered from white's perspective.
 */
export function EvalBar({ scoreCp, scoreMate, sideToMove, showLabel = true, flipped = false }: EvalBarProps) {
  const frac = useMemo(
    () => evalBarFraction(scoreCp, scoreMate, sideToMove),
    [scoreCp, scoreMate, sideToMove],
  );
  // White at top when not flipped: fill grows from top (height = fraction).
  const whiteHeight = `${Math.round(frac * 100)}%`;
  const label = formatEval(scoreCp, scoreMate, sideToMove);
  const isPositive = label.startsWith("+") || label.startsWith("M");
  const labelOnTop = !flipped && !isPositive; // labels appear in the colour they describe

  return (
    <div className={`pl-evalbar${flipped ? " flipped" : ""}`} aria-label={`Eval ${label}`}>
      <div
        className="pl-evalbar-fill"
        style={{ height: whiteHeight }}
      />
      <div className="pl-evalbar-mid" />
      {showLabel ? (
        <div className={`pl-evalbar-text${labelOnTop ? " top" : ""}${labelOnTop ? "" : ""}${isPositive ? "" : " dark"}`}>
          {label}
        </div>
      ) : null}
    </div>
  );
}
