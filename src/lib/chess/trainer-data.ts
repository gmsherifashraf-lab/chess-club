// Hand-curated training data that ships with the app.
// Tactics + Guess-move can also pull from the assessments table (covered
// elsewhere); endgame + opening trainer always have these as fallbacks so a
// fresh-install academy has something to drill from day one.

export interface SeedPuzzle {
  id: string;
  fen: string;
  /** Best line in SAN, alternating sides starting with the side-to-move in fen. */
  bestLine: string[];
  theme: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Short prompt shown above the board. */
  prompt: string;
}

export const SEED_TACTICS: SeedPuzzle[] = [
  {
    id: "tac-fork-1",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
    bestLine: ["Nxe5"],
    theme: "pawn capture",
    difficulty: 1,
    prompt: "White to move. Win material.",
  },
  {
    id: "tac-pin-1",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    bestLine: ["Ng5"],
    theme: "attack f7",
    difficulty: 2,
    prompt: "White to move. Threaten f7.",
  },
  {
    id: "tac-mate-2",
    fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    bestLine: ["Re8+", "Kxe8"],
    theme: "back-rank",
    difficulty: 2,
    prompt: "White to move. Find a back-rank idea.",
  },
  {
    id: "tac-fork-2",
    fen: "r3k2r/ppp2ppp/2n5/3pp3/1b1P4/2N1PN2/PPP2PPP/R1BQKB1R w KQkq - 0 7",
    bestLine: ["dxe5"],
    theme: "central tension",
    difficulty: 2,
    prompt: "White to move. Resolve the centre.",
  },
  {
    id: "tac-skewer-1",
    fen: "4r1k1/5ppp/8/8/8/8/r4PPP/3R2K1 w - - 0 1",
    bestLine: ["Rd8+", "Rxd8"],
    theme: "rook trade",
    difficulty: 1,
    prompt: "White to move. Force a simplification.",
  },
  {
    id: "tac-mate-1",
    fen: "r1b1kb1r/pppp1Bpp/2n2n2/4N3/4P3/8/PPPP1PPP/RNBQK2R b KQkq - 0 4",
    bestLine: ["Ke7"],
    theme: "king safety",
    difficulty: 2,
    prompt: "Black to move. Find the only safe square.",
  },
];

export interface SeedEndgame {
  id: string;
  title: string;
  fen: string;
  /** Goal text shown to the user. */
  goal: string;
  /** "win" or "draw" — used to grade attempts. */
  target: "win" | "draw";
  /** Side the user plays. */
  userPlays: "w" | "b";
}

export const SEED_ENDGAMES: SeedEndgame[] = [
  {
    id: "eg-kp-1",
    title: "K + P vs K · opposition",
    fen: "4k3/8/8/8/8/3K4/3P4/8 w - - 0 1",
    goal: "White to move. Promote the pawn and win.",
    target: "win",
    userPlays: "w",
  },
  {
    id: "eg-kr-1",
    title: "K + R vs K · cut off the king",
    fen: "4k3/8/8/8/8/8/4K3/R7 w - - 0 1",
    goal: "White to move. Mate within a sensible number of moves.",
    target: "win",
    userPlays: "w",
  },
  {
    id: "eg-lucena-1",
    title: "Lucena · bridge-building",
    fen: "1K1k4/1P6/8/8/8/8/r7/2R5 w - - 0 1",
    goal: "White to move. Build a bridge and promote.",
    target: "win",
    userPlays: "w",
  },
  {
    id: "eg-philidor-1",
    title: "Philidor · third-rank defence",
    fen: "8/8/8/8/8/k7/r7/2K3R1 b - - 0 1",
    goal: "Black to move. Hold the draw with the third-rank idea.",
    target: "draw",
    userPlays: "b",
  },
  {
    id: "eg-opp-1",
    title: "King opposition",
    fen: "4k3/8/4K3/4P3/8/8/8/8 w - - 0 1",
    goal: "White to move. Use the opposition to promote.",
    target: "win",
    userPlays: "w",
  },
  {
    id: "eg-bn-1",
    title: "K + B + N vs K",
    fen: "4k3/8/8/8/8/8/3B1N2/4K3 w - - 0 1",
    goal: "Mate within 33 moves (classic edge of the board).",
    target: "win",
    userPlays: "w",
  },
];

export interface SeedRepertoire {
  id: string;
  title: string;
  color: "white" | "black";
  /** Lines as PGN-like SAN sequences. Each branch is one line we drill. */
  lines: { name: string; moves: string[] }[];
}

export const SEED_REPERTOIRES: SeedRepertoire[] = [
  {
    id: "rep-italian-w",
    title: "Italian Game (White)",
    color: "white",
    lines: [
      { name: "Classical main line", moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d4"] },
      { name: "Giuoco Pianissimo",   moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "d3", "Nf6", "O-O"] },
    ],
  },
  {
    id: "rep-caro-b",
    title: "Caro-Kann Defence (Black)",
    color: "black",
    lines: [
      { name: "Classical 4...Bf5", moves: ["e4", "c6", "d4", "d5", "Nc3", "dxe4", "Nxe4", "Bf5"] },
      { name: "Advance variation", moves: ["e4", "c6", "d4", "d5", "e5", "Bf5"] },
    ],
  },
  {
    id: "rep-london-w",
    title: "London System (White)",
    color: "white",
    lines: [
      { name: "Main setup", moves: ["d4", "d5", "Bf4", "Nf6", "e3", "e6", "Nf3", "Bd6"] },
    ],
  },
];

export interface SeedGuessGame {
  id: string;
  title: string;
  /** SAN-only PGN (no headers needed). */
  pgn: string;
  /** Ply from which to start guessing. */
  startFromPly?: number;
  /** Which side the user predicts (other side auto-plays). */
  guessSide: "w" | "b";
}

export const SEED_GUESS_GAMES: SeedGuessGame[] = [
  {
    id: "guess-immortal",
    title: "Anderssen vs Kieseritzky · Immortal Game (1851)",
    pgn: "1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8 15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7#",
    startFromPly: 16,
    guessSide: "w",
  },
  {
    id: "guess-opera",
    title: "Morphy vs Duke of Brunswick · Opera Game (1858)",
    pgn: "1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8#",
    startFromPly: 8,
    guessSide: "w",
  },
];
