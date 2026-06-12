"use client";

import { useEffect, useRef } from "react";

export interface MoveListMove {
  /** SAN like "Nf3" or "O-O". */
  san: string;
  /** Resulting FEN after the move; click jumps to this position. */
  fenAfter: string;
}

interface MoveListProps {
  moves: MoveListMove[];
  /** Index of the move that is currently shown on the board. -1 = starting position. */
  currentPly: number;
  onJump: (ply: number) => void;
  emptyHint?: string;
}

export function MoveList({ moves, currentPly, onJump, emptyHint = "Moves will appear here as you play." }: MoveListProps) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  // Keep the active move in view.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [currentPly]);

  if (moves.length === 0) {
    return <div className="pl-moves-empty">{emptyHint}</div>;
  }

  // Group into rows of [white, black].
  const rows: Array<{ no: number; w?: MoveListMove; b?: MoveListMove; wPly?: number; bPly?: number }> = [];
  for (let i = 0; i < moves.length; i += 2) {
    rows.push({
      no: Math.floor(i / 2) + 1,
      w: moves[i],
      wPly: i,
      b: moves[i + 1],
      bPly: i + 1 < moves.length ? i + 1 : undefined,
    });
  }

  return (
    <div className="pl-moves" role="list" aria-label="Move list">
      {rows.map((row) => (
        <div key={row.no} className="pl-moves-row" role="listitem">
          <span className="num">{row.no}.</span>
          {row.w ? (
            <button
              ref={row.wPly === currentPly ? activeRef : undefined}
              type="button"
              className={`mv${row.wPly === currentPly ? " on" : ""}`}
              onClick={() => onJump(row.wPly!)}
            >
              {row.w.san}
            </button>
          ) : <span className="mv placeholder">—</span>}
          {row.b ? (
            <button
              ref={row.bPly === currentPly ? activeRef : undefined}
              type="button"
              className={`mv${row.bPly === currentPly ? " on" : ""}`}
              onClick={() => onJump(row.bPly!)}
            >
              {row.b.san}
            </button>
          ) : <span className="mv placeholder">—</span>}
        </div>
      ))}
    </div>
  );
}
