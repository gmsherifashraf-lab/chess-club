import { Chess, type Square } from "chess.js";

/** Convert a UCI string ("e2e4", "e7e8q") to its SAN representation in the given FEN. */
export function uciToSan(fen: string, uci: string): string | null {
  if (!uci || uci.length < 4) return null;
  const chess = new Chess(fen);
  const from = uci.slice(0, 2) as Square;
  const to = uci.slice(2, 4) as Square;
  const promotion = uci.length >= 5 ? uci.slice(4, 5) : undefined;
  try {
    const move = chess.move({ from, to, promotion });
    return move?.san ?? null;
  } catch {
    return null;
  }
}

/** Convert a UCI principal variation to SAN, walking the position forward as moves are played. */
export function pvToSan(startFen: string, pv: string[], limit = 8): string[] {
  const chess = new Chess(startFen);
  const out: string[] = [];
  for (let i = 0; i < pv.length && i < limit; i++) {
    const uci = pv[i];
    const from = uci.slice(0, 2) as Square;
    const to = uci.slice(2, 4) as Square;
    const promotion = uci.length >= 5 ? uci.slice(4, 5) : undefined;
    try {
      const move = chess.move({ from, to, promotion });
      if (!move) break;
      out.push(move.san);
    } catch {
      break;
    }
  }
  return out;
}

/** Format an engine eval (cp from side-to-move) as a White-perspective string: "+0.42", "-1.10", "M5". */
export function formatEval(
  scoreCp: number | undefined,
  scoreMate: number | undefined,
  sideToMove: "w" | "b",
): string {
  if (scoreMate != null) {
    const fromWhite = sideToMove === "w" ? scoreMate : -scoreMate;
    return fromWhite > 0 ? `M${fromWhite}` : `-M${Math.abs(fromWhite)}`;
  }
  if (scoreCp == null) return "—";
  const cp = sideToMove === "w" ? scoreCp : -scoreCp;
  const pawns = cp / 100;
  return (pawns > 0 ? "+" : "") + pawns.toFixed(2);
}

/** Convert eval to bar fill ratio in [0, 1] (0 = black wins, 0.5 = equal, 1 = white wins). */
export function evalBarFraction(
  scoreCp: number | undefined,
  scoreMate: number | undefined,
  sideToMove: "w" | "b",
): number {
  if (scoreMate != null) {
    const fromWhite = sideToMove === "w" ? scoreMate : -scoreMate;
    return fromWhite > 0 ? 0.98 : 0.02;
  }
  if (scoreCp == null) return 0.5;
  const cp = sideToMove === "w" ? scoreCp : -scoreCp;
  // Logistic squashing — caps roughly at ±10 pawns.
  const x = cp / 100;
  return 1 / (1 + Math.exp(-x * 0.4));
}

/** Format big counts: 1234567 → "1.2M", 12345 → "12.3k". */
export function fmtCount(n: number | undefined): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

/** Square color helper for chess.js squares (a1 dark, h8 light pattern is opposite — h1 light). */
export function squareColor(sq: string): "light" | "dark" {
  const file = sq.charCodeAt(0) - 97; // 0..7
  const rank = Number(sq[1]) - 1;     // 0..7
  return (file + rank) % 2 === 0 ? "dark" : "light";
}
