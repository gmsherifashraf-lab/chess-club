"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Chess, type Move } from "chess.js";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { SEED_ENDGAMES, type SeedEndgame } from "@/lib/chess/trainer-data";
import { ENGINE_LEVELS } from "@/lib/chess/engine-types";
import { EngineClient } from "@/lib/chess/EngineClient";
import type { ChessGameState } from "@/lib/chess/useChessGame";
import type { BoardPreferences } from "@/components/chess/board-themes";
import type { useEngine } from "@/lib/chess/useEngine";

interface EndgameTrainerProps {
  game: ChessGameState;
  prefs: BoardPreferences;
  engine: ReturnType<typeof useEngine>;
}

type Status = "active" | "won" | "drew" | "lost" | "thinking";

export function EndgameTrainer({ game }: EndgameTrainerProps) {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("active");
  const engineRef = useRef<EngineClient | null>(null);

  const current: SeedEndgame | undefined = SEED_ENDGAMES[index];
  const engineColor: "w" | "b" = current?.userPlays === "w" ? "b" : "w";

  // Load endgame.
  useEffect(() => {
    if (!current) return;
    game.loadFen(current.fen);
    setStatus("active");
    // If engine moves first, kick it off.
    setTimeout(() => {
      const c = new Chess(current.fen);
      if (c.turn() === engineColor) engineMove();
    }, 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Detect end of game.
  useEffect(() => {
    if (!current) return;
    if (game.position.isCheckmate()) {
      const losingSide = game.position.turn();
      if (losingSide === current.userPlays) setStatus("lost");
      else setStatus(current.target === "win" ? "won" : "drew");
    } else if (game.position.isDraw() || game.position.isStalemate()) {
      setStatus(current.target === "draw" ? "drew" : "lost");
    } else if (status !== "thinking" && game.sideToMove === engineColor) {
      engineMove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.fen]);

  const engineMove = useCallback(async () => {
    if (!current) return;
    setStatus("thinking");
    try {
      if (!engineRef.current) engineRef.current = EngineClient.shared();
      await engineRef.current.ready();
      // Strong engine for endgame defense — but cap movetime so it's responsive.
      const preset = ENGINE_LEVELS[14]; // ~Lvl 15
      const res = await engineRef.current.analyze({
        fen: game.fen,
        movetime: preset.movetime,
        depth: preset.depth,
      });
      if (res.best && res.best !== "(none)") {
        const from = res.best.slice(0, 2);
        const to = res.best.slice(2, 4);
        const promotion = res.best.length >= 5 ? (res.best.slice(4, 5) as "q" | "r" | "b" | "n") : undefined;
        game.makeMove({ from, to, promotion } as Move);
      }
      setStatus("active");
    } catch {
      setStatus("active");
    }
  }, [current, game]);

  const restart = () => {
    if (!current) return;
    game.loadFen(current.fen);
    setStatus("active");
  };

  const nextPosition = () => setIndex((i) => (i + 1) % SEED_ENDGAMES.length);

  if (!current) {
    return <div className="pl-trainer-prompt">No endgame positions available yet.</div>;
  }

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
      <div className="pl-trainer-hd">
        <span className="pl-trainer-kicker">Endgame · {current.target}</span>
        <span className="pl-trainer-ttl">{current.title}</span>
        <div className="pl-trainer-stat">
          <span>You play <strong>{current.userPlays === "w" ? "White" : "Black"}</strong></span>
        </div>
      </div>

      <div className="pl-trainer-prompt">{current.goal}</div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <StatusBadge status={status} />
        <span style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
          {SEED_ENDGAMES.map((e, i) => (
            <button
              key={e.id}
              type="button"
              className={`pl-btn${i === index ? " primary" : ""}`}
              onClick={() => setIndex(i)}
              style={{ fontSize: "0.7rem" }}
              title={e.title}
            >
              {e.id.replace(/^eg-/, "").toUpperCase()}
            </button>
          ))}
        </div>
        <button type="button" className="pl-btn" onClick={restart}>
          <RotateCcw /> Restart
        </button>
        <button type="button" className="pl-btn primary" onClick={nextPosition}>
          Next <ArrowRight />
        </button>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: Status }) {
  switch (status) {
    case "won":      return <span className="pl-trainer-status ok"><Sparkles style={{ width: 14, height: 14 }} /> You won</span>;
    case "drew":     return <span className="pl-trainer-status ok">Drawn · target met</span>;
    case "lost":     return <span className="pl-trainer-status err">Position lost · try again</span>;
    case "thinking": return <span className="pl-trainer-status hint">Engine thinking…</span>;
    default:         return <span className="pl-trainer-status">Your move</span>;
  }
}
