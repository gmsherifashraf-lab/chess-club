"use client";

import { useMemo, useState } from "react";
import { Chess, type Move } from "chess.js";
import { BoardSurface } from "@/components/chess";
import { DEFAULT_BOARD_PREFS } from "@/components/chess/board-themes";

interface Props {
  fen: string;
  lastMove: string | null;
  ply: number;
  canMove: boolean;
  onMove: (nextFen: string, uci: string) => void;
  engineLine?: { score: string; pv: string } | null;
}

function squareFromUci(uci: string | null): { from: string; to: string } | null {
  if (!uci || uci.length < 4) return null;
  return { from: uci.slice(0, 2), to: uci.slice(2, 4) };
}

export function StageBoard({ fen, lastMove, ply, canMove, onMove, engineLine }: Props) {
  const last = useMemo(() => squareFromUci(lastMove), [lastMove]);
  const [prefs] = useState(() => ({ ...DEFAULT_BOARD_PREFS }));

  function handleMove(move: Move): boolean | void {
    if (!canMove) return false;
    const chess = new Chess(fen);
    try {
      const applied = chess.move({ from: move.from, to: move.to, promotion: move.promotion });
      if (!applied) return false;
      const uci = `${applied.from}${applied.to}${applied.promotion ?? ""}`;
      onMove(chess.fen(), uci);
      return true;
    } catch {
      return false;
    }
  }

  const fenParts = fen.split(" ");
  const sideToMove = fenParts[1] === "w" ? "White to move" : "Black to move";

  return (
    <>
      <div className="eca-cr-board-shell">
        <div className="eca-cr-board-mount">
          <BoardSurface
            fen={fen}
            onMove={handleMove}
            lastMove={last}
            readOnly={!canMove}
            prefs={prefs}
          />
        </div>
      </div>
      <div className="eca-cr-board-meta" aria-hidden={false}>
        <span>Move {Math.ceil(ply / 2) || 0} · {sideToMove}</span>
        {engineLine ? (
          <span>
            {engineLine.score}  ·  {engineLine.pv}
          </span>
        ) : (
          <span style={{ opacity: 0.55 }}>Engine off</span>
        )}
      </div>
    </>
  );
}
