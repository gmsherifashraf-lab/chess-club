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
 * Vertical eval bar. Standard convention (Lichess, Chess.com): viewing from
 * white's side, white's share grows from the BOTTOM; flipped boards invert.
 * Score is always rendered from white's perspective.
 */
export function EvalBar({ scoreCp, scoreMate, sideToMove, showLabel = true, flipped = false }: EvalBarProps) {
  const frac = useMemo(
    () => evalBarFraction(scoreCp, scoreMate, sideToMove),
    [scoreCp, scoreMate, sideToMove],
  );
  const whiteHeight = `${Math.round(frac * 100)}%`;
  const label = formatEval(scoreCp, scoreMate, sideToMove);
  const isPositive = label.startsWith("+") || label.startsWith("M");
  // The white fill is the first flex child; `flipped` (column-reverse) pushes
  // it to the bottom, which is where white belongs on an unflipped board.
  const whiteAtBottom = !flipped;
  // The label sits in the territory of the side it describes.
  const labelOnTop = whiteAtBottom ? !isPositive : isPositive;

  return (
    <div className={`pl-evalbar${whiteAtBottom ? " flipped" : ""}`} aria-label={`Eval ${label}`}>
      <div
        className="pl-evalbar-fill"
        style={{ height: whiteHeight }}
      />
      <div className="pl-evalbar-mid" />
      {showLabel ? (
        <div className={`pl-evalbar-text${labelOnTop ? " top" : ""}${isPositive ? "" : " dark"}`}>
          {label}
        </div>
      ) : null}
    </div>
  );
}
