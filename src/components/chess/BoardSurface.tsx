"use client";

import {
  useCallback, useEffect, useMemo, useRef, useState,
} from "react";
import { Chessboard } from "react-chessboard";
import type { Arrow, PieceDropHandlerArgs, SquareHandlerArgs } from "react-chessboard";
import { Chess, type Move, type Square } from "chess.js";
import {
  BOARD_THEMES,
  DEFAULT_BOARD_PREFS,
  type BoardPreferences,
  type BoardTheme,
} from "./board-themes";
import { getPieceRenderer } from "./pieces";

export interface BoardSurfaceProps {
  /** Position to render (FEN). Required. */
  fen: string;
  /** Called when the user makes a legal move on the board. Return false to revert. */
  onMove?: (move: Move) => boolean | void;
  /** Squares to highlight as "last move" (typically from + to of previous ply). */
  lastMove?: { from: string; to: string } | null;
  /** Override board orientation. Default: white at bottom. */
  orientation?: "white" | "black";
  /** Disable input (read-only viewer). */
  readOnly?: boolean;
  /** Visual preferences (theme, piece set, animation, coordinates). */
  prefs?: BoardPreferences;
  /** Persisted arrows from external state. If omitted, internal drawing-only mode. */
  arrows?: Arrow[];
  /** Drawn circles (mark squares). */
  circles?: { square: string; color: string }[];
  /** Notified when the user draws/clears arrows. */
  onArrowsChange?: (arrows: Arrow[]) => void;
  /** Notified when the user right-clicks a square to draw/erase a circle. */
  onCircleToggle?: (square: string) => void;
  /** Optional fixed board size in pixels (otherwise fills container). */
  size?: number;
}

const PROMOTION_PIECES: Array<"q" | "r" | "b" | "n"> = ["q", "r", "b", "n"];

interface PromotionState {
  from: Square;
  to: Square;
  color: "w" | "b";
  /** Position above (white promoting) or below (black promoting) the target square in CSS percent. */
  alignBelow: boolean;
}

export function BoardSurface({
  fen,
  onMove,
  lastMove,
  orientation = "white",
  readOnly = false,
  prefs = DEFAULT_BOARD_PREFS,
  arrows,
  circles,
  onArrowsChange,
  onCircleToggle,
  size,
}: BoardSurfaceProps) {
  const theme: BoardTheme = BOARD_THEMES[prefs.theme] ?? BOARD_THEMES.paper;
  const containerRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState<Square | null>(null);
  const [promotion, setPromotion] = useState<PromotionState | null>(null);
  const [boardPx, setBoardPx] = useState<number>(size ?? 0);

  const chess = useMemo(() => {
    try { return new Chess(fen); }
    catch { return new Chess(); }
  }, [fen]);

  // Compute legal targets from `selected`.
  const legalTargets = useMemo(() => {
    if (!selected) return new Set<string>();
    try {
      const moves = chess.moves({ square: selected, verbose: true }) as Move[];
      return new Set(moves.map((m) => m.to));
    } catch {
      return new Set<string>();
    }
  }, [chess, selected]);

  // King-in-check square (visual ring).
  const inCheckSquare = useMemo(() => {
    if (!chess.inCheck()) return null;
    const turn = chess.turn();
    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const sq = board[r][c];
        if (sq && sq.type === "k" && sq.color === turn) {
          return `${"abcdefgh"[c]}${8 - r}`;
        }
      }
    }
    return null;
  }, [chess]);

  // Resize observer — feed the board size into the SVG overlays + promotion popover.
  useEffect(() => {
    if (size) { setBoardPx(size); return; }
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setBoardPx(width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [size]);

  // Clear selection + promotion when the position changes externally.
  useEffect(() => {
    setSelected(null);
    setPromotion(null);
  }, [fen]);

  // ── Move attempt ─────────────────────────────────────────────────────────
  const tryMove = useCallback((from: Square, to: Square, promo?: "q" | "r" | "b" | "n"): boolean => {
    if (readOnly) return false;
    const piece = chess.get(from);
    if (!piece) return false;
    // Detect a pawn promotion that needs a chooser.
    const needsPromo = piece.type === "p" && (to[1] === "8" || to[1] === "1");
    if (needsPromo && !promo) {
      setPromotion({
        from, to, color: piece.color,
        alignBelow: orientation === "white" ? piece.color === "b" : piece.color === "w",
      });
      return false;
    }
    try {
      const move = chess.move({ from, to, promotion: promo });
      if (!move) return false;
      // External listener can veto by returning false.
      const ok = onMove?.(move);
      if (ok === false) {
        chess.undo();
        return false;
      }
      setSelected(null);
      setPromotion(null);
      return true;
    } catch {
      return false;
    }
  }, [chess, onMove, orientation, readOnly]);

  // ── react-chessboard handlers ────────────────────────────────────────────
  const onSquareClick = useCallback(({ piece, square }: SquareHandlerArgs) => {
    if (readOnly) return;
    if (promotion) return;
    if (!selected) {
      // First click — select a piece of the side to move.
      const sq = chess.get(square as Square);
      if (sq && sq.color === chess.turn()) setSelected(square as Square);
      return;
    }
    if (square === selected) { setSelected(null); return; }
    // Attempt move.
    const ok = tryMove(selected, square as Square);
    if (!ok) {
      // If they clicked another own piece, re-select.
      if (piece && chess.get(square as Square)?.color === chess.turn()) {
        setSelected(square as Square);
      } else {
        setSelected(null);
      }
    }
  }, [chess, promotion, readOnly, selected, tryMove]);

  const onPieceDrop = useCallback(({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
    if (!targetSquare) return false;
    return tryMove(sourceSquare as Square, targetSquare as Square);
  }, [tryMove]);

  const handleRightClick = useCallback(({ square }: SquareHandlerArgs) => {
    if (!onCircleToggle) return;
    onCircleToggle(square);
  }, [onCircleToggle]);

  // ── Square highlights via squareStyles ───────────────────────────────────
  const squareStyles = useMemo<Record<string, React.CSSProperties>>(() => {
    const styles: Record<string, React.CSSProperties> = {};
    if (lastMove) {
      styles[lastMove.from] = { background: theme.lastMove };
      styles[lastMove.to] = { background: theme.lastMove };
    }
    if (selected) {
      styles[selected] = { background: theme.selected };
    }
    if (inCheckSquare) {
      styles[inCheckSquare] = {
        background: `radial-gradient(circle, ${theme.check} 0%, transparent 75%)`,
      };
    }
    // Legal targets — overlay a dot or ring via inset shadow tricks.
    legalTargets.forEach((sq) => {
      const occupied = chess.get(sq as Square);
      if (occupied) {
        styles[sq] = {
          ...(styles[sq] ?? {}),
          background: `radial-gradient(circle, transparent 60%, ${theme.legalRing} 62%, ${theme.legalRing} 70%, transparent 72%)`,
        };
      } else {
        styles[sq] = {
          ...(styles[sq] ?? {}),
          background: `radial-gradient(circle, ${theme.legalDot} 20%, transparent 22%)`,
        };
      }
    });
    return styles;
  }, [chess, inCheckSquare, lastMove, legalTargets, selected, theme]);

  // ── Render circles via SVG overlay ───────────────────────────────────────
  const circlesOverlay = useMemo(() => {
    if (!circles || circles.length === 0 || boardPx === 0) return null;
    const sqSize = boardPx / 8;
    return (
      <svg
        width={boardPx}
        height={boardPx}
        viewBox={`0 0 ${boardPx} ${boardPx}`}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 4,
        }}
      >
        {circles.map((c, i) => {
          const file = c.square.charCodeAt(0) - 97;
          const rank = Number(c.square[1]) - 1;
          const xIdx = orientation === "white" ? file : 7 - file;
          const yIdx = orientation === "white" ? 7 - rank : rank;
          const cx = xIdx * sqSize + sqSize / 2;
          const cy = yIdx * sqSize + sqSize / 2;
          return (
            <circle
              key={`${c.square}-${i}`}
              cx={cx}
              cy={cy}
              r={sqSize * 0.46}
              fill="none"
              stroke={c.color}
              strokeWidth={sqSize * 0.07}
              opacity={0.85}
            />
          );
        })}
      </svg>
    );
  }, [boardPx, circles, orientation]);

  // ── Promotion popover ────────────────────────────────────────────────────
  const promotionOverlay = useMemo(() => {
    if (!promotion || boardPx === 0) return null;
    const sqSize = boardPx / 8;
    const file = promotion.to.charCodeAt(0) - 97;
    const rank = Number(promotion.to[1]) - 1;
    const xIdx = orientation === "white" ? file : 7 - file;
    const yIdx = orientation === "white" ? 7 - rank : rank;
    const left = xIdx * sqSize;
    const top = promotion.alignBelow ? (yIdx + 1) * sqSize : (yIdx - 3) * sqSize;
    const order = promotion.alignBelow ? PROMOTION_PIECES : [...PROMOTION_PIECES].reverse();
    return (
      <div
        className="cb-promo"
        style={{
          position: "absolute",
          left,
          top,
          width: sqSize,
          height: sqSize * 4,
          zIndex: 6,
        }}
      >
        {order.map((p) => (
          <button
            key={p}
            type="button"
            className="cb-promo-btn"
            onClick={() => tryMove(promotion.from, promotion.to, p)}
            style={{ height: sqSize, width: sqSize }}
            aria-label={`Promote to ${p}`}
          >
            <PromotionGlyph piece={p} color={promotion.color} size={sqSize} />
          </button>
        ))}
        <button
          type="button"
          className="cb-promo-cancel"
          onClick={() => setPromotion(null)}
          style={{ width: sqSize }}
          aria-label="Cancel promotion"
        >
          ×
        </button>
      </div>
    );
  }, [boardPx, orientation, promotion, tryMove]);

  const pieceRenderer = useMemo(() => getPieceRenderer(prefs.pieceSet), [prefs.pieceSet]);

  return (
    <div
      ref={containerRef}
      className="cb-wrap"
      style={{
        position: "relative",
        width: size ? size : "100%",
        aspectRatio: "1 / 1",
        maxWidth: size ?? undefined,
      }}
    >
      <Chessboard
        options={{
          id: "eca-board",
          position: fen,
          boardOrientation: orientation,
          pieces: pieceRenderer,
          allowDragging: !readOnly,
          allowDrawingArrows: !readOnly,
          arrows: arrows ?? [],
          onArrowsChange: onArrowsChange
            ? ({ arrows: a }) => onArrowsChange(a)
            : undefined,
          arrowOptions: {
            color: "rgba(34, 139, 34, 0.7)",
            opacity: 0.85,
            secondaryColor: "rgba(220, 60, 50, 0.7)",
            secondaryOpacity: 0.85,
            tertiaryColor: "rgba(38, 110, 220, 0.7)",
            tertiaryOpacity: 0.85,
            quaternaryColor: "rgba(220, 175, 50, 0.78)",
            quaternaryOpacity: 0.85,
            length: 0.7,
            arrowLengthReducerDenominator: 8,
            arrowWidthDenominator: 14,
          } as never,
          clearArrowsOnPositionChange: true,
          showNotation: prefs.showCoordinates,
          animationDurationInMs: prefs.animationMs,
          showAnimations: prefs.animationMs > 0,
          darkSquareStyle: { backgroundColor: theme.dark },
          lightSquareStyle: { backgroundColor: theme.light },
          darkSquareNotationStyle: { color: theme.coordDark, fontWeight: 600, fontSize: "0.62rem" },
          lightSquareNotationStyle: { color: theme.coordLight, fontWeight: 600, fontSize: "0.62rem" },
          alphaNotationStyle: { color: theme.coordLight, fontWeight: 600, fontSize: "0.62rem" },
          numericNotationStyle: { color: theme.coordLight, fontWeight: 600, fontSize: "0.62rem" },
          squareStyles,
          onSquareClick,
          onPieceDrop,
          onSquareRightClick: handleRightClick,
        }}
      />
      {circlesOverlay}
      {promotionOverlay}
    </div>
  );
}

function PromotionGlyph({ piece, color, size }: { piece: "q" | "r" | "b" | "n"; color: "w" | "b"; size: number }) {
  // Reuse the canonical Cburnett glyphs by mapping piece type to its key.
  const key = (color + piece.toUpperCase()) as `w${"Q" | "R" | "B" | "N"}` | `b${"Q" | "R" | "B" | "N"}`;
  const renderer = getPieceRenderer("cburnett");
  const Comp = renderer[key];
  return (
    <span style={{ display: "inline-block", width: size * 0.85, height: size * 0.85 }}>
      {Comp ? <Comp /> : null}
    </span>
  );
}
