"use client";

import "./chess.css";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { BoardSurface } from "./BoardSurface";
import { useChessGame } from "@/lib/chess/useChessGame";
import { loadBoardPrefs, DEFAULT_BOARD_PREFS, type BoardPreferences } from "./board-themes";

interface PositionViewerProps {
  /** Initial position (FEN). If a `pgn` is also passed, the PGN's last position wins. */
  fen?: string;
  /** Initial PGN. When given, the viewer steps through the mainline. */
  pgn?: string;
  /** Override board size in pixels. Default fills container. */
  size?: number;
  /** Hide the "Open in workspace" link (useful for read-only contexts). */
  hideOpenLink?: boolean;
  /** Show the move stepper. Default true if PGN supplied. */
  showStepper?: boolean;
}

/**
 * Compact, embeddable chess board. Self-contained: brings its own state, prefs,
 * stepper, and "Open in workspace" deep link that preserves position.
 * Use this in lesson tasks, game review embeds, parent-view child games.
 */
export function PositionViewer({
  fen,
  pgn,
  size,
  hideOpenLink = false,
  showStepper,
}: PositionViewerProps) {
  const game = useChessGame(fen);
  const [prefs, setPrefs] = useState<BoardPreferences>(DEFAULT_BOARD_PREFS);

  useEffect(() => { setPrefs(loadBoardPrefs()); }, []);
  useEffect(() => {
    if (pgn) game.loadPgn(pgn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pgn]);

  const stepperOn = showStepper ?? !!pgn;
  const deepLink = useMemo(() => {
    const params = new URLSearchParams();
    if (pgn) params.set("pgn", pgn);
    else params.set("fen", game.fen);
    params.set("mode", "review");
    return `/play?${params.toString()}`;
  }, [pgn, game.fen]);

  return (
    <div className="eca-play embed" style={{ background: "transparent", minHeight: 0 }}>
      <div className="pl-shell" style={{ padding: 0, gap: "0.5rem" }}>
        <BoardSurface
          fen={game.fen}
          lastMove={game.lastMove}
          orientation={game.orientation}
          prefs={prefs}
          size={size}
          readOnly={false}
          onMove={(m) => { game.makeMove(m); return true; }}
        />

        {stepperOn || !hideOpenLink ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.74rem",
              color: "var(--pl-text-3)",
            }}
          >
            {stepperOn ? (
              <>
                <button
                  type="button"
                  className="pl-btn icon"
                  onClick={game.prev}
                  disabled={game.currentPly === 0}
                  aria-label="Previous"
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  className="pl-btn icon"
                  onClick={game.next}
                  disabled={game.currentPly >= game.nodes.length - 1}
                  aria-label="Next"
                >
                  <ChevronRight />
                </button>
                <span style={{ fontFamily: "var(--font-mono), monospace", color: "var(--pl-text-4)" }}>
                  {game.currentPly}/{game.nodes.length - 1}
                </span>
                <button
                  type="button"
                  className="pl-btn icon"
                  onClick={game.flip}
                  aria-label="Flip"
                >
                  <RotateCw />
                </button>
              </>
            ) : <span style={{ flex: 1 }} />}
            <span style={{ flex: 1 }} />
            {!hideOpenLink ? (
              <a
                href={deepLink}
                className="pl-btn"
                style={{ fontSize: "0.72rem" }}
              >
                Open in workspace <ExternalLink style={{ width: 11, height: 11, marginLeft: 3 }} />
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
