"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Move } from "chess.js";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { SEED_REPERTOIRES, type SeedRepertoire } from "@/lib/chess/trainer-data";
import type { ChessGameState } from "@/lib/chess/useChessGame";

interface OpeningTrainerProps { game: ChessGameState; }

type Status = "active" | "correct" | "wrong" | "done";

export function OpeningTrainer({ game }: OpeningTrainerProps) {
  const [repIndex, setRepIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [status, setStatus] = useState<Status>("active");
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const startedRef = useRef(false);

  const rep: SeedRepertoire | undefined = SEED_REPERTOIRES[repIndex];
  const line = rep?.lines[lineIndex];
  const userColor: "w" | "b" = rep?.color === "white" ? "w" : "b";

  // Reset for new line.
  useEffect(() => {
    if (!rep || !line) return;
    game.reset();
    startedRef.current = true;
    setStatus("active");
    setStats({ correct: 0, total: 0 });
    // If user plays Black, opponent (white) plays the first move from the line.
    if (userColor === "b") {
      setTimeout(() => {
        const c = new Chess();
        try {
          const m = c.move(line.moves[0]);
          if (m) game.makeMove({ from: m.from, to: m.to, promotion: m.promotion } as Move);
        } catch { /* ignore */ }
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repIndex, lineIndex]);

  // Watch user moves.
  useEffect(() => {
    if (!rep || !line || !startedRef.current) return;
    if (status !== "active") return;
    const ply = game.currentPly;
    if (ply === 0) return;
    const lastUserSan = game.sanMoves[ply - 1];
    if (!lastUserSan) return;

    // The expected move at this ply is line.moves[ply - 1].
    const expected = line.moves[ply - 1];
    const sideOfThisPly: "w" | "b" = (ply - 1) % 2 === 0 ? "w" : "b";
    if (sideOfThisPly !== userColor) return;

    if (!expected) {
      setStatus("done");
      return;
    }

    if (sanMatches(lastUserSan, expected)) {
      setStats((s) => ({ correct: s.correct + 1, total: s.total + 1 }));
      flash();
      setStatus("correct");
      // Opponent reply.
      setTimeout(() => {
        const oppIdx = ply;
        const oppSan = line.moves[oppIdx];
        if (oppSan) {
          const c = new Chess(game.fen);
          try {
            const m = c.move(oppSan);
            if (m) game.makeMove({ from: m.from, to: m.to, promotion: m.promotion } as Move);
          } catch { /* ignore */ }
        }
        if (oppIdx + 1 >= line.moves.length) {
          setStatus("done");
        } else {
          setStatus("active");
        }
      }, 400);
    } else {
      setStats((s) => ({ correct: s.correct, total: s.total + 1 }));
      shake();
      setStatus("wrong");
      setTimeout(() => {
        game.jumpToPly(ply - 1);
        setStatus("active");
      }, 800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.currentPly]);

  const restart = useCallback(() => {
    setStatus("active");
    setStats({ correct: 0, total: 0 });
    game.reset();
  }, [game]);

  const nextLine = useCallback(() => {
    if (!rep) return;
    if (lineIndex + 1 < rep.lines.length) setLineIndex(lineIndex + 1);
    else { setRepIndex((i) => (i + 1) % SEED_REPERTOIRES.length); setLineIndex(0); }
  }, [lineIndex, rep]);

  if (!rep || !line) {
    return <div className="pl-trainer-prompt">No repertoires available yet.</div>;
  }

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
      <div className="pl-trainer-hd">
        <span className="pl-trainer-kicker">Opening · drill</span>
        <span className="pl-trainer-ttl">{rep.title}</span>
        <div className="pl-trainer-stat">
          <span>{line.name}</span>
          <span>· <strong>{stats.correct}</strong>/{stats.total} correct</span>
        </div>
      </div>

      <div className="pl-trainer-prompt">
        Play the {rep.color} side from your repertoire. The opponent answers from the saved line.
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <StatusBadge status={status} />
        <span style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {SEED_REPERTOIRES.map((r, i) => (
            <button
              key={r.id}
              type="button"
              className={`pl-btn${i === repIndex ? " primary" : ""}`}
              onClick={() => { setRepIndex(i); setLineIndex(0); }}
              style={{ fontSize: "0.7rem" }}
            >
              {r.title.split(" ")[0]}
            </button>
          ))}
        </div>
        <button type="button" className="pl-btn" onClick={restart}>
          <RotateCcw /> Restart
        </button>
        <button type="button" className="pl-btn primary" onClick={nextLine}>
          Next line <ArrowRight />
        </button>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: Status }) {
  switch (status) {
    case "correct": return <span className="pl-trainer-status ok"><Sparkles style={{ width: 14, height: 14 }} /> Correct</span>;
    case "wrong":   return <span className="pl-trainer-status err">Out of book</span>;
    case "done":    return <span className="pl-trainer-status ok">Line complete</span>;
    default:        return <span className="pl-trainer-status">Your move</span>;
  }
}

function sanMatches(a: string, b: string): boolean {
  const norm = (s: string) => s.replace(/[+#!?]/g, "").trim();
  return norm(a) === norm(b);
}

function flash() {
  const w = document.querySelector<HTMLElement>(".eca-play .cb-wrap");
  if (!w) return;
  w.classList.remove("flash");
  void w.offsetWidth;
  w.classList.add("flash");
}
function shake() {
  const w = document.querySelector<HTMLElement>(".eca-play .cb-wrap");
  if (!w) return;
  w.classList.remove("shake");
  void w.offsetWidth;
  w.classList.add("shake");
}
