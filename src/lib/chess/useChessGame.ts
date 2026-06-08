"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Chess, type Move } from "chess.js";

export interface GameNode {
  /** SAN of the move that led to this position. Empty string for the root. */
  san: string;
  /** FEN of the position after the move (or starting position for root). */
  fen: string;
  /** UCI of the move that led to this position, useful for engine PV navigation. */
  uci?: string;
}

/** Mainline-only chess game state. Variations deferred to v2. */
export interface ChessGameState {
  /** All positions in chronological order. nodes[0] = starting position. */
  nodes: GameNode[];
  /** Current node index. 0 = starting position. nodes.length - 1 = latest move. */
  currentPly: number;
  /** Current FEN derived from nodes[currentPly]. */
  fen: string;
  /** SAN list of moves played from the root (length = nodes.length - 1). */
  sanMoves: string[];
  /** chess.js instance scoped to the current position (read-only-ish). */
  position: Chess;
  /** Side to move at the current position. */
  sideToMove: "w" | "b";
  /** {from, to} of the previous ply, or null if at the root. */
  lastMove: { from: string; to: string } | null;
  /** Board orientation. */
  orientation: "white" | "black";

  // Mutators
  makeMove: (move: Move) => boolean;
  jumpToPly: (ply: number) => void;
  prev: () => void;
  next: () => void;
  first: () => void;
  last: () => void;
  flip: () => void;
  reset: (startFen?: string) => void;
  loadFen: (fen: string) => boolean;
  loadPgn: (pgn: string) => boolean;
  exportPgn: () => string;
}

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function useChessGame(initialFen: string = START_FEN): ChessGameState {
  const startRef = useRef<string>(initialFen);
  const [nodes, setNodes] = useState<GameNode[]>(() => [{ san: "", fen: initialFen }]);
  const [currentPly, setCurrentPly] = useState(0);
  const [orientation, setOrientation] = useState<"white" | "black">("white");

  const fen = nodes[currentPly]?.fen ?? initialFen;
  const lastMove = useMemo(() => {
    if (currentPly === 0) return null;
    const prev = nodes[currentPly - 1];
    const cur = nodes[currentPly];
    if (!prev || !cur) return null;
    // chess.js Move tracking is implicit — rebuild via a fresh Chess on prev.fen + cur.san.
    try {
      const c = new Chess(prev.fen);
      const m = c.move(cur.san) as Move | null;
      return m ? { from: m.from, to: m.to } : null;
    } catch {
      return null;
    }
  }, [nodes, currentPly]);

  const position = useMemo(() => {
    try { return new Chess(fen); }
    catch { return new Chess(); }
  }, [fen]);

  const sideToMove: "w" | "b" = position.turn();

  const sanMoves = useMemo(() => nodes.slice(1).map((n) => n.san), [nodes]);

  // ── Mutators ─────────────────────────────────────────────────────────────
  const makeMove = useCallback((move: Move): boolean => {
    // Truncate any "future" beyond currentPly (overwrite if user explores from a past position).
    setNodes((prev) => {
      const trunc = prev.slice(0, currentPly + 1);
      const head = trunc[trunc.length - 1];
      const c = new Chess(head.fen);
      try {
        const m = c.move({ from: move.from, to: move.to, promotion: move.promotion });
        if (!m) return prev;
        return [
          ...trunc,
          { san: m.san, fen: c.fen(), uci: `${m.from}${m.to}${m.promotion ?? ""}` },
        ];
      } catch {
        return prev;
      }
    });
    setCurrentPly((p) => p + 1);
    return true;
  }, [currentPly]);

  const jumpToPly = useCallback((ply: number) => {
    setCurrentPly((p) => {
      const max = nodes.length - 1;
      return Math.max(0, Math.min(max, ply));
    });
  }, [nodes.length]);

  const prev = useCallback(() => setCurrentPly((p) => Math.max(0, p - 1)), []);
  const next = useCallback(() => setCurrentPly((p) => Math.min(nodes.length - 1, p + 1)), [nodes.length]);
  const first = useCallback(() => setCurrentPly(0), []);
  const last = useCallback(() => setCurrentPly(nodes.length - 1), [nodes.length]);
  const flip = useCallback(() => setOrientation((o) => o === "white" ? "black" : "white"), []);

  const reset = useCallback((startFen?: string) => {
    const f = startFen ?? startRef.current;
    startRef.current = f;
    setNodes([{ san: "", fen: f }]);
    setCurrentPly(0);
  }, []);

  const loadFen = useCallback((rawFen: string): boolean => {
    try {
      // Validate by constructing.
      const c = new Chess(rawFen);
      const f = c.fen();
      startRef.current = f;
      setNodes([{ san: "", fen: f }]);
      setCurrentPly(0);
      return true;
    } catch {
      return false;
    }
  }, []);

  const loadPgn = useCallback((pgn: string): boolean => {
    try {
      const c = new Chess();
      c.loadPgn(pgn);
      const history = c.history({ verbose: true }) as Move[];
      // Rebuild a node list by re-playing the moves so we have FENs at each ply.
      const fresh = new Chess();
      const newNodes: GameNode[] = [{ san: "", fen: fresh.fen() }];
      for (const m of history) {
        try {
          const played = fresh.move({ from: m.from, to: m.to, promotion: m.promotion });
          if (!played) break;
          newNodes.push({
            san: played.san,
            fen: fresh.fen(),
            uci: `${played.from}${played.to}${played.promotion ?? ""}`,
          });
        } catch {
          break;
        }
      }
      startRef.current = newNodes[0].fen;
      setNodes(newNodes);
      setCurrentPly(newNodes.length - 1);
      return true;
    } catch {
      return false;
    }
  }, []);

  const exportPgn = useCallback((): string => {
    const c = new Chess(startRef.current);
    for (const n of nodes.slice(1)) {
      try { c.move(n.san); } catch { /* skip */ }
    }
    return c.pgn();
  }, [nodes]);

  return {
    nodes,
    currentPly,
    fen,
    sanMoves,
    position,
    sideToMove,
    lastMove,
    orientation,
    makeMove,
    jumpToPly,
    prev,
    next,
    first,
    last,
    flip,
    reset,
    loadFen,
    loadPgn,
    exportPgn,
  };
}
