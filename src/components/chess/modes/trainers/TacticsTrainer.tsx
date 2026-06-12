"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Move } from "chess.js";
import { ArrowRight, Eye, RotateCcw, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SEED_TACTICS, type SeedPuzzle } from "@/lib/chess/trainer-data";
import type { ChessGameState } from "@/lib/chess/useChessGame";

interface TacticsTrainerProps { game: ChessGameState; }

type Status = "idle" | "active" | "correct" | "wrong" | "solved";

export function TacticsTrainer({ game }: TacticsTrainerProps) {
  const [puzzles, setPuzzles] = useState<SeedPuzzle[]>(SEED_TACTICS);
  const [source, setSource] = useState<"seed" | "library">("seed");
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);          // 0 = waiting for first user move
  const [hint, setHint] = useState<string | null>(null);
  const [stats, setStats] = useState({ attempted: 0, solved: 0, streak: 0 });
  const wrapperRef = useRef<HTMLElement | null>(null);

  // Pull library puzzles from assessments (kind in puzzle_*) once on mount; fall back to seed.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("assessment_items")
          .select(`
            id, fen, best_move_san, best_line_san, prompt,
            assessment:assessments!inner(state)
          `)
          .in("kind", ["puzzle_best_move", "puzzle_mate_in_n", "puzzle_line"])
          .not("fen", "is", null)
          .limit(40);
        if (cancelled) return;
        const rows = (data ?? []) as unknown as Array<{
          id: string; fen: string; best_move_san: string | null;
          best_line_san: string[] | null; prompt: string;
          assessment: { state: string } | { state: string }[] | null;
        }>;
        const published = rows.filter((r) => {
          const a = Array.isArray(r.assessment) ? r.assessment[0] : r.assessment;
          return a?.state === "published";
        });
        if (published.length === 0) return;
        const lib: SeedPuzzle[] = published.map((r) => ({
          id: r.id,
          fen: r.fen,
          bestLine: r.best_line_san?.length ? r.best_line_san : (r.best_move_san ? [r.best_move_san] : []),
          theme: "library",
          difficulty: 2 as const,
          prompt: r.prompt,
        })).filter((p) => p.bestLine.length > 0);
        if (lib.length > 0) {
          setPuzzles(lib);
          setSource("library");
        }
      } catch {
        /* silently fall back to seed */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const current = puzzles[index];

  // Load puzzle into the board.
  useEffect(() => {
    if (!current) return;
    game.loadFen(current.fen);
    setStep(0);
    setStatus("active");
    setHint(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, puzzles]);

  // Watch the game's last move against the expected line.
  useEffect(() => {
    if (!current || status !== "active") return;
    if (game.currentPly === 0) return;
    const lastSan = game.sanMoves[game.sanMoves.length - 1];
    const expected = current.bestLine[step];
    if (!expected) return;
    if (sanMatches(lastSan, expected)) {
      // If it's the final move in the line, mark solved. Otherwise auto-play opponent reply.
      if (step + 1 >= current.bestLine.length) {
        setStatus("correct");
        setStats((s) => ({ attempted: s.attempted + 1, solved: s.solved + 1, streak: s.streak + 1 }));
        flash();
        setTimeout(() => setStatus("solved"), 900);
      } else {
        // Opponent auto-plays the next move from bestLine.
        const opp = current.bestLine[step + 1];
        const c = new Chess(game.fen);
        try {
          const m = c.move(opp);
          if (m) {
            setTimeout(() => {
              game.makeMove({ from: m.from, to: m.to, promotion: m.promotion } as Move);
              setStep(step + 2);
            }, 350);
          } else {
            // No opponent reply line; treat as solved.
            setStatus("correct");
            setStats((s) => ({ attempted: s.attempted + 1, solved: s.solved + 1, streak: s.streak + 1 }));
            flash();
            setTimeout(() => setStatus("solved"), 900);
          }
        } catch {
          setStatus("correct");
          setStats((s) => ({ attempted: s.attempted + 1, solved: s.solved + 1, streak: s.streak + 1 }));
          flash();
          setTimeout(() => setStatus("solved"), 900);
        }
      }
    } else {
      // Wrong move — revert + shake.
      setStatus("wrong");
      setStats((s) => ({ attempted: s.attempted + 1, solved: s.solved, streak: 0 }));
      shake();
      setTimeout(() => {
        game.loadFen(current.fen);
        setStep(0);
        setStatus("active");
      }, 700);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.currentPly]);

  const reveal = useCallback(() => {
    if (!current) return;
    setHint(current.bestLine.join(" "));
  }, [current]);

  const nextPuzzle = useCallback(() => {
    setIndex((i) => (i + 1) % puzzles.length);
  }, [puzzles.length]);

  const reset = useCallback(() => {
    if (!current) return;
    game.loadFen(current.fen);
    setStep(0);
    setStatus("active");
    setHint(null);
  }, [current, game]);

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
    return (
      <div className="pl-trainer-prompt">
        No puzzles available. Ask your coach to publish a puzzle set, then refresh.
      </div>
    );
  }

  return (
    <section ref={(el) => { wrapperRef.current = el; }} style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
      <div className="pl-trainer-hd">
        <span className="pl-trainer-kicker">Tactics · {source === "library" ? "library" : "seed"}</span>
        <span className="pl-trainer-ttl">Puzzle {index + 1} of {puzzles.length}</span>
        <div className="pl-trainer-stat">
          <span><strong>{stats.solved}</strong>/{stats.attempted} solved</span>
          <span>· streak <strong>{stats.streak}</strong></span>
        </div>
      </div>

      <div className="pl-trainer-prompt">{current.prompt}</div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <StatusBadge status={status} />
        <span style={{ flex: 1 }} />
        <button type="button" className="pl-btn" onClick={reveal} disabled={status === "solved"}>
          <Eye /> Show line
        </button>
        <button type="button" className="pl-btn" onClick={reset}>
          <RotateCcw /> Retry
        </button>
        <button type="button" className="pl-btn primary" onClick={nextPuzzle}>
          Next <ArrowRight />
        </button>
      </div>

      {hint ? (
        <div className="pl-iobar">
          <span className="pl-iobar-l">Line</span>
          <span className="pl-iobar-v">{hint}</span>
        </div>
      ) : null}
    </section>
  );
}

function StatusBadge({ status }: { status: Status }) {
  switch (status) {
    case "correct":
      return <span className="pl-trainer-status ok"><Sparkles style={{ width: 14, height: 14 }} /> Right move</span>;
    case "wrong":
      return <span className="pl-trainer-status err">Try again</span>;
    case "solved":
      return <span className="pl-trainer-status ok">Solved · pick a new puzzle</span>;
    case "active":
      return <span className="pl-trainer-status">Your move</span>;
    default:
      return <span className="pl-trainer-status">Ready</span>;
  }
}

/** Loose SAN match: ignore trailing check / mate / annotation marks. */
function sanMatches(a: string, b: string): boolean {
  const norm = (s: string) => s.replace(/[+#!?]/g, "").trim();
  return norm(a) === norm(b);
}
