"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Telescope, Gamepad2, Dumbbell, BookOpenText, Settings2, ChevronLeft,
} from "lucide-react";
import { BoardSurface, BoardThemePicker, EvalBar } from "@/components/chess";
import { useChessGame } from "@/lib/chess/useChessGame";
import { useEngine } from "@/lib/chess/useEngine";
import { loadBoardPrefs, saveBoardPrefs, type BoardPreferences } from "@/components/chess/board-themes";
import { AnalyzeMode } from "@/components/chess/modes/AnalyzeMode";
import { PlayMode } from "@/components/chess/modes/PlayMode";
import { ReviewMode } from "@/components/chess/modes/ReviewMode";
import { TrainMode } from "@/components/chess/modes/TrainMode";
import type { Arrow } from "react-chessboard";
import { useAuth } from "@/context/AuthContext";
import { ROLE_DASHBOARD, type UserRole } from "@/lib/auth";

const PLAY_ALLOWED: UserRole[] = ["admin", "coach", "player"];

type Mode = "analyze" | "play" | "train" | "review";

const TABS: { id: Mode; label: string; icon: typeof Telescope }[] = [
  { id: "analyze", label: "Analyze", icon: Telescope },
  { id: "play",    label: "Play",    icon: Gamepad2 },
  { id: "train",   label: "Train",   icon: Dumbbell },
  { id: "review",  label: "Review",  icon: BookOpenText },
];

function PlayPageInner() {
  const router = useRouter();
  const { session, role, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!session) { router.replace("/login?next=/play"); return; }
    if (role && !PLAY_ALLOWED.includes(role)) {
      router.replace(ROLE_DASHBOARD[role] ?? "/dashboard");
    }
  }, [authLoading, session, role, router]);

  const search = useSearchParams();
  const initialMode = (search.get("mode") as Mode) ?? "analyze";
  const initialFen = search.get("fen") ?? undefined;
  const initialPgn = search.get("pgn") ?? undefined;

  const [mode, setMode] = useState<Mode>(initialMode);
  const [prefs, setPrefs] = useState<BoardPreferences>(() => loadBoardPrefs());
  const [showSettings, setShowSettings] = useState(false);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [circles, setCircles] = useState<{ square: string; color: string }[]>([]);

  // Shared chess state across all modes.
  const game = useChessGame(initialFen);
  // Engine: auto-analyzes the current position when on (Analyze mode default).
  const engine = useEngine(game.fen, { autoAnalyze: mode === "analyze", depth: 18 });

  // Load initial PGN if provided.
  useEffect(() => {
    if (initialPgn) game.loadPgn(initialPgn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist board prefs.
  useEffect(() => { saveBoardPrefs(prefs); }, [prefs]);

  // Keyboard shortcuts (left/right, home/end, f flip, space engine).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (e.key === "ArrowLeft") { e.preventDefault(); game.prev(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); game.next(); }
      else if (e.key === "Home") { e.preventDefault(); game.first(); }
      else if (e.key === "End") { e.preventDefault(); game.last(); }
      else if (e.key === "f" || e.key === "F") { game.flip(); }
      else if (e.key === " ") { e.preventDefault(); engine.toggle(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [game, engine]);

  // Clear arrows + circles on position change.
  useEffect(() => {
    setArrows([]);
    setCircles([]);
  }, [game.fen]);

  const toggleCircle = (square: string) => {
    setCircles((prev) => {
      const idx = prev.findIndex((c) => c.square === square);
      if (idx >= 0) return prev.filter((_, i) => i !== idx);
      return [...prev, { square, color: "rgba(34, 139, 34, 0.7)" }];
    });
  };

  const gateState: "loading" | "denied" | "ok" = authLoading
    ? "loading"
    : !session || (role && !PLAY_ALLOWED.includes(role))
      ? "denied"
      : "ok";

  const headerStat = useMemo(() => {
    switch (mode) {
      case "analyze": return "Free analysis · drag pieces, paste FEN, run engine";
      case "play":    return "Play against Stockfish at your chosen level";
      case "train":   return "Tactics, opening drills, endgame studies";
      case "review":  return "Paste a PGN to walk through the game";
    }
  }, [mode]);

  if (gateState !== "ok") {
    return (
      <div className="pl-gate">
        <div className="pl-gate-card">
          <span className="pl-gate-mk" aria-hidden>♞</span>
          <div className="pl-gate-ttl">
            {gateState === "loading" ? "Checking access…" : "Members only"}
          </div>
          <div className="pl-gate-sub">
            {gateState === "loading"
              ? "Verifying your session."
              : "The chess workspace is open to academy coaches, admins, and players."}
          </div>
          {gateState === "denied" && (
            <div className="pl-gate-actions">
              <Link href="/login?next=/play" className="pl-btn">Sign in</Link>
              <Link href="/" className="pl-btn ghost">Back to site</Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pl-shell">
      <div className="pl-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", minWidth: 0 }}>
          <Link href="/dashboard" className="pl-btn icon" title="Back to dashboard" aria-label="Back to dashboard">
            <ChevronLeft />
          </Link>
          <Link href="/play" className="pl-brand">
            <span className="pl-brand-mk" aria-hidden>♞</span>
            <div>
              <div className="pl-brand-t">Chess Workspace</div>
              <div className="pl-brand-s">{headerStat}</div>
            </div>
          </Link>
        </div>

        <div className="pl-tabs" role="tablist" aria-label="Mode">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={mode === t.id}
                className={`pl-tab${mode === t.id ? " on" : ""}`}
                onClick={() => setMode(t.id)}
              >
                <Icon /> {t.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={`pl-btn icon${showSettings ? " toggle on" : ""}`}
          onClick={() => setShowSettings((s) => !s)}
          aria-label="Board settings"
          title="Board settings"
        >
          <Settings2 />
        </button>
      </div>

      <div className="pl-work">
        <div className="pl-work-l">
          <div className="pl-board-row">
            <EvalBar
              scoreCp={engine.info?.scoreCp}
              scoreMate={engine.info?.scoreMate}
              sideToMove={game.sideToMove}
              flipped={game.orientation === "black"}
            />
            <div className="pl-board-wrap">
              <BoardSurface
                fen={game.fen}
                onMove={(m) => { game.makeMove(m); return true; }}
                lastMove={game.lastMove}
                orientation={game.orientation}
                prefs={prefs}
                arrows={arrows}
                circles={circles}
                onArrowsChange={setArrows}
                onCircleToggle={toggleCircle}
                readOnly={mode === "review"}
              />
            </div>
          </div>

          {mode === "analyze" && <AnalyzeMode game={game} engine={engine} />}
          {mode === "play"    && <PlayMode game={game} prefs={prefs} />}
          {mode === "train"   && <TrainMode game={game} prefs={prefs} engine={engine} />}
          {mode === "review"  && <ReviewMode game={game} engine={engine} />}
        </div>

        <div className="pl-work-r">
          {showSettings ? (
            <div className="pl-panel">
              <div className="pl-panel-hd">
                <div className="pl-panel-hd-l">
                  <span className="pl-panel-ttl">Board settings</span>
                </div>
                <button
                  type="button"
                  className="pl-btn icon"
                  onClick={() => setShowSettings(false)}
                  aria-label="Close settings"
                >
                  ×
                </button>
              </div>
              <div className="pl-panel-bd">
                <BoardThemePicker prefs={prefs} onChange={setPrefs} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center", color: "var(--pl-text-4)" }}>Loading workspace…</div>}>
      <PlayPageInner />
    </Suspense>
  );
}
