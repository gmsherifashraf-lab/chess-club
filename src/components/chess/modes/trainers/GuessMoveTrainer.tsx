"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Move } from "chess.js";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { SEED_GUESS_GAMES, type SeedGuessGame } from "@/lib/chess/trainer-data";
import type { ChessGameState } from "@/lib/chess/useChessGame";

interface GuessMoveTrainerProps { game: ChessGameState; }

type Status = "ready" | "active" | "correct" | "wrong" | "done";

export function GuessMoveTrainer({ game }: GuessMoveTrainerProps) {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("ready");
  const [stats, setStats] = useState({ matched: 0, total: 0 });
  const [expectedSan, setExpectedSan] = useState<string | null>(null);
  const startedRef = useRef(false);

  const current: SeedGuessGame | undefined = SEED_GUESS_GAMES[index];

  // Compute the SAN sequence for the game.
  const fullSan = useMemo(() => {
    if (!current) return [];
    try {
      const c = new Chess();
      c.loadPgn(current.pgn);
      return c.history();
    } catch {
      return [];
    }
  }, [current]);

  // Load the game and fast-forward to startFromPly.
  useEffect(() => {
    if (!current) return;
    startedRef.current = false;
    game.loadPgn(current.pgn);
    setStats({ matched: 0, total: 0 });
    setStatus("ready");
    setExpectedSan(null);
    // After loadPgn settles, jump to start position.
    setTimeout(() => {
      game.jumpToPly(current.startFromPly ?? 0);
      startedRef.current = true;
      setStatus("active");
      // Compute next expected SAN.
      const nextIdx = current.startFromPly ?? 0;
      setExpectedSan(fullSan[nextIdx] ?? null);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Watch user moves and compare to mainline.
  useEffect(() => {
    if (!current || !startedRef.current) return;
    if (status !== "active") return;
    const ply = game.currentPly;
    if (ply === 0) return;
    const lastUserSan = game.sanMoves[ply - 1];
    if (!lastUserSan) return;
    const expected = fullSan[ply - 1];
    if (!expected) return;

    // Only grade plies played BY the guess side.
    const sideOfThisPly = (ply - 1) % 2 === 0 ? "w" : "b";
    if (sideOfThisPly !== current.guessSide) return;

    const matched = sanMatches(lastUserSan, expected);
    setStats((s) => ({ matched: s.matched + (matched ? 1 : 0), total: s.total + 1 }));

    if (!matched) {
      // Rewind to before the user's move and show the actual move.
      setStatus("wrong");
      shake();
      setTimeout(() => {
        // Replace user's move with the actual mainline move.
        game.jumpToPly(ply - 1);
        const c = new Chess(game.nodes[ply - 1].fen);
        try {
          const m = c.move(expected);
          if (m) game.makeMove({ from: m.from, to: m.to, promotion: m.promotion } as Move);
        } catch { /* ignore */ }
        setStatus("active");
        setExpectedSan(fullSan[ply] ?? null);
      }, 900);
    } else {
      // Correct — play opponent's reply automatically if available.
      flash();
      setStatus("correct");
      setTimeout(() => {
        const nextPly = ply;
        const oppSan = fullSan[nextPly];
        if (oppSan) {
          const c = new Chess(game.fen);
          try {
            const m = c.move(oppSan);
            if (m) game.makeMove({ from: m.from, to: m.to, promotion: m.promotion } as Move);
          } catch { /* ignore */ }
        }
        if (nextPly + 1 >= fullSan.length) {
          setStatus("done");
        } else {
          setStatus("active");
          setExpectedSan(fullSan[nextPly + 1] ?? null);
        }
      }, 420);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.currentPly]);

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

  if (!current) {
    return <div className="pl-trainer-prompt">No annotated games available yet.</div>;
  }

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
      <div className="pl-trainer-hd">
        <span className="pl-trainer-kicker">Guess the move</span>
        <span className="pl-trainer-ttl">{current.title}</span>
        <div className="pl-trainer-stat">
          <span>guess <strong>{current.guessSide === "w" ? "White" : "Black"}</strong></span>
          <span>· <strong>{stats.matched}</strong>/{stats.total} matched</span>
        </div>
      </div>

      <div className="pl-trainer-prompt">
        Step through the game. When it&rsquo;s {current.guessSide === "w" ? "White" : "Black"}&rsquo;s turn,
        play what you think the master played. The opponent replies automatically.
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <StatusBadge status={status} expected={expectedSan} />
        <span style={{ flex: 1 }} />
        <button type="button" className="pl-btn" onClick={() => {
          game.jumpToPly(current.startFromPly ?? 0);
          setStats({ matched: 0, total: 0 });
          setStatus("active");
        }}>
          <RotateCcw /> Restart
        </button>
        <button type="button" className="pl-btn primary" onClick={() => setIndex((i) => (i + 1) % SEED_GUESS_GAMES.length)}>
          Next game <ArrowRight />
        </button>
      </div>
    </section>
  );
}

function StatusBadge({ status, expected }: { status: Status; expected: string | null }) {
  switch (status) {
    case "correct":
      return <span className="pl-trainer-status ok"><Sparkles style={{ width: 14, height: 14 }} /> Matched</span>;
    case "wrong":
      return <span className="pl-trainer-status err">Master played {expected}</span>;
    case "done":
      return <span className="pl-trainer-status ok">Game complete</span>;
    case "active":
      return <span className="pl-trainer-status">Your guess</span>;
    default:
      return <span className="pl-trainer-status">Loading…</span>;
  }
}

function sanMatches(a: string, b: string): boolean {
  const norm = (s: string) => s.replace(/[+#!?]/g, "").trim();
  return norm(a) === norm(b);
}
