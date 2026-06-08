"use client";

import { useState } from "react";
import { Target, GitBranch, BookOpen, Castle } from "lucide-react";
import { TacticsTrainer } from "./trainers/TacticsTrainer";
import { GuessMoveTrainer } from "./trainers/GuessMoveTrainer";
import { OpeningTrainer } from "./trainers/OpeningTrainer";
import { EndgameTrainer } from "./trainers/EndgameTrainer";
import type { ChessGameState } from "@/lib/chess/useChessGame";
import type { BoardPreferences } from "@/components/chess/board-themes";
import type { useEngine } from "@/lib/chess/useEngine";

type TrainerKind = "tactics" | "guess" | "opening" | "endgame";

const TRAINERS: { id: TrainerKind; label: string; icon: typeof Target; subtitle: string }[] = [
  { id: "tactics",  label: "Tactics",   icon: Target,    subtitle: "find the best move" },
  { id: "guess",    label: "Guess",     icon: GitBranch, subtitle: "predict masters' moves" },
  { id: "opening",  label: "Opening",   icon: BookOpen,  subtitle: "drill a repertoire" },
  { id: "endgame",  label: "Endgame",   icon: Castle,    subtitle: "play key positions" },
];

interface TrainModeProps {
  game: ChessGameState;
  prefs: BoardPreferences;
  engine: ReturnType<typeof useEngine>;
}

export function TrainMode({ game, prefs, engine }: TrainModeProps) {
  const [kind, setKind] = useState<TrainerKind>("tactics");

  return (
    <>
      <div className="pl-tabs" style={{ alignSelf: "flex-start" }} role="tablist" aria-label="Trainer">
        {TRAINERS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={kind === t.id}
              className={`pl-tab${kind === t.id ? " on" : ""}`}
              onClick={() => setKind(t.id)}
            >
              <Icon /> {t.label}
            </button>
          );
        })}
      </div>

      {kind === "tactics" && <TacticsTrainer game={game} />}
      {kind === "guess"   && <GuessMoveTrainer game={game} />}
      {kind === "opening" && <OpeningTrainer game={game} />}
      {kind === "endgame" && <EndgameTrainer game={game} prefs={prefs} engine={engine} />}
    </>
  );
}
