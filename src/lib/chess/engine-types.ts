// Shared types for the Stockfish wrapper.
// SAN = "Nf3", UCI = "g1f3", FEN = full position string.

export type Color = "w" | "b";

export interface EngineInfo {
  depth: number;
  seldepth?: number;
  nodes?: number;
  nps?: number;
  hashfull?: number;
  time?: number;        // ms
  multipv?: number;
  /** Centipawn score from the side-to-move perspective. */
  scoreCp?: number;
  /** Mate distance from side-to-move perspective. Positive = side mates, negative = side is mated. */
  scoreMate?: number;
  /** Principal variation in UCI (g1f3 e7e5 …). Decode to SAN on consumer side. */
  pv: string[];
}

export interface BestMoveResult {
  best: string;          // UCI like g1f3
  ponder?: string;       // UCI of opponent's expected reply
  /** Latest info packet captured before bestmove arrived. */
  finalInfo?: EngineInfo;
}

export interface AnalyzeOpts {
  fen: string;
  /** Search depth target. Pass either depth OR movetime. */
  depth?: number;
  /** Search budget in ms (used for "Play vs Engine"). */
  movetime?: number;
  /** Number of principal variations. Default 1. */
  multipv?: number;
  /** Skill 0-20 (UCI_LimitStrength + Skill Level). Omit for full strength. */
  skill?: number;
  /** UCI_Elo target (1320-3190). Overrides skill if both given. */
  elo?: number;
  onInfo?: (info: EngineInfo) => void;
}

/**
 * Maps a "level" (1-20) to engine settings:
 *  - 1-5   → very weak, low elo + skill, fast search
 *  - 6-12  → club beginner→intermediate
 *  - 13-17 → strong club / expert
 *  - 18-20 → full strength
 */
export interface EngineLevelPreset {
  label: string;        // "Beginner", "Club", "Expert", "Master"
  skill?: number;       // 0..20
  elo?: number;         // 1320..3190
  movetime: number;     // ms per move
  depth?: number;       // optional fallback cap
}

export const ENGINE_LEVELS: EngineLevelPreset[] = [
  { label: "Lvl 1 · Newcomer",   skill: 0,  elo: 1320, movetime: 100 },
  { label: "Lvl 2",              skill: 1,  elo: 1400, movetime: 100 },
  { label: "Lvl 3",              skill: 2,  elo: 1500, movetime: 120 },
  { label: "Lvl 4",              skill: 3,  elo: 1600, movetime: 150 },
  { label: "Lvl 5 · Club",       skill: 5,  elo: 1700, movetime: 200 },
  { label: "Lvl 6",              skill: 6,  elo: 1800, movetime: 250 },
  { label: "Lvl 7",              skill: 8,  elo: 1900, movetime: 300 },
  { label: "Lvl 8 · Strong",     skill: 10, elo: 2000, movetime: 350 },
  { label: "Lvl 9",              skill: 12, elo: 2100, movetime: 400 },
  { label: "Lvl 10 · Expert",    skill: 14, elo: 2200, movetime: 500 },
  { label: "Lvl 11",             skill: 16, elo: 2300, movetime: 600 },
  { label: "Lvl 12",             skill: 17, elo: 2400, movetime: 700 },
  { label: "Lvl 13 · Master",    skill: 18, elo: 2500, movetime: 900 },
  { label: "Lvl 14",             skill: 19, elo: 2600, movetime: 1100 },
  { label: "Lvl 15",             skill: 20, elo: 2700, movetime: 1400 },
  { label: "Lvl 16",             skill: 20, elo: 2800, movetime: 1700 },
  { label: "Lvl 17 · IM",        skill: 20, elo: 2900, movetime: 2000 },
  { label: "Lvl 18 · GM",        skill: 20, elo: 3000, movetime: 2500 },
  { label: "Lvl 19",             skill: 20, elo: 3100, movetime: 3000 },
  { label: "Lvl 20 · Full",      movetime: 4000, depth: 22 },
];

export function classifyMove(deltaCp: number): "best" | "good" | "inaccuracy" | "mistake" | "blunder" {
  // From side-to-move perspective: positive delta = same or better than best.
  const loss = Math.max(0, -deltaCp);
  if (loss < 20) return "best";
  if (loss < 60) return "good";
  if (loss < 150) return "inaccuracy";
  if (loss < 300) return "mistake";
  return "blunder";
}
