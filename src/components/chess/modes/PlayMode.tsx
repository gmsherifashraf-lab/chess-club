"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Flag, RotateCcw, ChevronLeft } from "lucide-react";
import { BoardControls, MoveList } from "@/components/chess";
import type { ChessGameState } from "@/lib/chess/useChessGame";
import type { BoardPreferences } from "@/components/chess/board-themes";
import { ENGINE_LEVELS } from "@/lib/chess/engine-types";
import { EngineClient } from "@/lib/chess/EngineClient";

interface PlayModeProps {
  game: ChessGameState;
  prefs: BoardPreferences;
}

type Side = "white" | "black";

export function PlayMode({ game }: PlayModeProps) {
  const [level, setLevel] = useState<number>(7);   // index into ENGINE_LEVELS (0..19)
  const [side, setSide] = useState<Side>("white");
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const engineRef = useRef<EngineClient | null>(null);

  // Determine whose turn it is and if engine should move.
  const userColor: "w" | "b" = side === "white" ? "w" : "b";
  const engineColor: "w" | "b" = userColor === "w" ? "b" : "w";

  // End-of-game detection.
  useEffect(() => {
    if (game.position.isGameOver()) {
      let msg = "Draw";
      if (game.position.isCheckmate()) {
        msg = game.position.turn() === "w" ? "Black wins by checkmate" : "White wins by checkmate";
      } else if (game.position.isStalemate()) msg = "Draw by stalemate";
      else if (game.position.isThreefoldRepetition()) msg = "Draw by threefold repetition";
      else if (game.position.isInsufficientMaterial()) msg = "Draw by insufficient material";
      else if (game.position.isDraw()) msg = "Draw by 50-move rule";
      setResult(msg);
    } else {
      setResult(null);
    }
  }, [game.position]);

  // Engine reply.
  useEffect(() => {
    if (!started || result) return;
    if (game.sideToMove !== engineColor) return;
    let cancelled = false;
    const preset = ENGINE_LEVELS[level];

    (async () => {
      if (!engineRef.current) engineRef.current = EngineClient.shared();
      setThinking(true);
      try {
        await engineRef.current.ready();
        const res = await engineRef.current.analyze({
          fen: game.fen,
          movetime: preset.movetime,
          depth: preset.depth,
          elo: preset.elo,
          skill: preset.skill,
        });
        if (cancelled) return;
        // Apply the engine's best move to the game.
        if (res.best && res.best !== "(none)") {
          const from = res.best.slice(0, 2);
          const to = res.best.slice(2, 4);
          const promotion = res.best.length >= 5
            ? (res.best.slice(4, 5) as "q" | "r" | "b" | "n")
            : undefined;
          game.makeMove({ from, to, promotion } as never);
        }
      } finally {
        if (!cancelled) setThinking(false);
      }
    })();

    return () => { cancelled = true; };
  }, [started, result, game.fen, game.sideToMove, engineColor, level, game]);

  const startGame = useCallback((s: Side) => {
    setSide(s);
    setStarted(true);
    game.reset();
  }, [game]);

  const resign = () => {
    setResult(`${side === "white" ? "Black" : "White"} wins by resignation`);
    setStarted(false);
  };
  const takeback = () => {
    // Take back two plies (user's last move + engine's reply).
    if (game.currentPly >= 2) game.jumpToPly(game.currentPly - 2);
    else if (game.currentPly === 1) game.jumpToPly(0);
  };

  const moveListData = useMemo(
    () => game.sanMoves.map((san, i) => ({ san, fenAfter: game.nodes[i + 1]?.fen ?? game.fen })),
    [game.sanMoves, game.nodes, game.fen],
  );

  if (!started) {
    return (
      <div className="pl-panel">
        <div className="pl-panel-hd">
          <div className="pl-panel-hd-l">
            <span className="pl-panel-ttl">New game</span>
            <span className="pl-panel-sub">choose level & side</span>
          </div>
        </div>
        <div className="pl-panel-bd" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <div className="pl-panel-sub" style={{ marginBottom: "0.5rem" }}>
              Level · {ENGINE_LEVELS[level].label}
            </div>
            <input
              type="range"
              min={0}
              max={ENGINE_LEVELS.length - 1}
              step={1}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--pl-accent)" }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="button" className="pl-btn primary" style={{ flex: 1 }} onClick={() => startGame("white")}>
              Play as White
            </button>
            <button type="button" className="pl-btn" style={{ flex: 1 }} onClick={() => startGame("black")}>
              Play as Black
            </button>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--pl-text-3)", lineHeight: 1.5, margin: 0 }}>
            The engine adapts its strength to the chosen level.
            On a fresh load, Stockfish takes a few seconds to warm up before the first move.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BoardControls
        onFirst={game.first}
        onPrev={game.prev}
        onNext={game.next}
        onLast={game.last}
        onFlip={game.flip}
        canPrev={game.currentPly > 0}
        canNext={game.currentPly < game.nodes.length - 1}
        trailing={
          <>
            <button type="button" className="pl-btn" onClick={takeback} disabled={game.currentPly < 1}>
              <ChevronLeft /> Takeback
            </button>
            <button type="button" className="pl-btn" onClick={resign} disabled={!!result}>
              <Flag /> Resign
            </button>
            <button type="button" className="pl-btn" onClick={() => { setStarted(false); setResult(null); }}>
              <RotateCcw /> New
            </button>
          </>
        }
      />

      <div className="pl-engbar">
        <span className="pl-engbar-l">
          <span className={`pl-engbar-dot${thinking ? " busy" : " on"}`} />
          {thinking ? "Engine thinking…" : "Your move"}
        </span>
        <span>Level {ENGINE_LEVELS[level].label}</span>
        <span style={{ marginLeft: "auto", color: "var(--pl-text-4)" }}>
          You play {side === "white" ? "White ♔" : "Black ♚"}
        </span>
      </div>

      {result ? (
        <div className="pl-trainer-status ok" style={{ alignSelf: "flex-start" }}>
          🏁 {result}
        </div>
      ) : null}

      <div className="pl-panel">
        <div className="pl-panel-hd">
          <div className="pl-panel-hd-l">
            <span className="pl-panel-ttl">Moves</span>
            <span className="pl-panel-sub">{game.sanMoves.length} ply</span>
          </div>
        </div>
        <div className="pl-panel-bd pad-0 scroll">
          <MoveList
            moves={moveListData}
            currentPly={game.currentPly - 1}
            onJump={(ply) => game.jumpToPly(ply + 1)}
            emptyHint="Make your first move on the board."
          />
        </div>
      </div>
    </>
  );
}
