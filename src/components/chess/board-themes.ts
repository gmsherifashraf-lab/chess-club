// Board + piece theming for ECA.
// Themes are intentionally scoped: the default 'paper' is the brand-on-board
// theme; others give the user familiar alternatives without pulling the chrome
// out of the ECA palette.

export type BoardThemeId = "paper" | "periwinkle" | "slate" | "wood" | "marine" | "mono";

export interface BoardTheme {
  id: BoardThemeId;
  label: string;
  light: string;     // light square color
  dark: string;      // dark square color
  lastMove: string;  // last-move highlight overlay (rgba)
  check: string;     // king-in-check highlight (radial)
  selected: string;  // selected source square overlay
  legalDot: string;  // dot color for legal targets on empty squares
  legalRing: string; // ring color for legal targets on occupied squares
  coordLight: string; // coord text color over a light square
  coordDark: string;  // coord text color over a dark square
}

export const BOARD_THEMES: Record<BoardThemeId, BoardTheme> = {
  paper: {
    id: "paper",
    label: "Paper",
    light: "#F4F2EC",
    dark: "#C6CCF1",
    lastMove: "rgba(0, 79, 188, 0.22)",
    check: "rgba(192, 57, 44, 0.55)",
    selected: "rgba(0, 79, 188, 0.28)",
    legalDot: "rgba(11, 56, 113, 0.32)",
    legalRing: "rgba(11, 56, 113, 0.48)",
    coordLight: "rgba(20, 35, 63, 0.55)",
    coordDark: "rgba(11, 56, 113, 0.7)",
  },
  periwinkle: {
    id: "periwinkle",
    label: "Periwinkle",
    light: "#EEF0FB",
    dark: "#8893D6",
    lastMove: "rgba(0, 79, 188, 0.25)",
    check: "rgba(192, 57, 44, 0.55)",
    selected: "rgba(0, 79, 188, 0.32)",
    legalDot: "rgba(20, 35, 63, 0.35)",
    legalRing: "rgba(20, 35, 63, 0.5)",
    coordLight: "rgba(20, 35, 63, 0.55)",
    coordDark: "rgba(244, 246, 251, 0.85)",
  },
  slate: {
    id: "slate",
    label: "Slate",
    light: "#E2E5EE",
    dark: "#5C6B88",
    lastMove: "rgba(0, 79, 188, 0.3)",
    check: "rgba(192, 57, 44, 0.6)",
    selected: "rgba(0, 79, 188, 0.35)",
    legalDot: "rgba(20, 35, 63, 0.42)",
    legalRing: "rgba(20, 35, 63, 0.55)",
    coordLight: "rgba(20, 35, 63, 0.6)",
    coordDark: "rgba(244, 246, 251, 0.85)",
  },
  wood: {
    id: "wood",
    label: "Wood",
    light: "#EAD8B3",
    dark: "#9B6B3F",
    lastMove: "rgba(214, 175, 80, 0.55)",
    check: "rgba(192, 57, 44, 0.6)",
    selected: "rgba(214, 175, 80, 0.6)",
    legalDot: "rgba(74, 50, 22, 0.45)",
    legalRing: "rgba(74, 50, 22, 0.55)",
    coordLight: "rgba(74, 50, 22, 0.6)",
    coordDark: "rgba(245, 232, 205, 0.85)",
  },
  marine: {
    id: "marine",
    label: "Marine",
    light: "#DBE5EC",
    dark: "#41799E",
    lastMove: "rgba(0, 79, 188, 0.35)",
    check: "rgba(192, 57, 44, 0.6)",
    selected: "rgba(0, 79, 188, 0.45)",
    legalDot: "rgba(20, 50, 80, 0.45)",
    legalRing: "rgba(20, 50, 80, 0.6)",
    coordLight: "rgba(20, 50, 80, 0.6)",
    coordDark: "rgba(244, 246, 251, 0.85)",
  },
  mono: {
    id: "mono",
    label: "Mono",
    light: "#F0F0F0",
    dark: "#7A7A7A",
    lastMove: "rgba(0, 0, 0, 0.18)",
    check: "rgba(192, 57, 44, 0.55)",
    selected: "rgba(0, 0, 0, 0.22)",
    legalDot: "rgba(0, 0, 0, 0.35)",
    legalRing: "rgba(0, 0, 0, 0.45)",
    coordLight: "rgba(0, 0, 0, 0.55)",
    coordDark: "rgba(255, 255, 255, 0.8)",
  },
};

// Arrow colors per modifier (matches Lichess convention: green default, red shift, blue alt/ctrl, yellow alt+shift).
export const ARROW_COLORS = {
  default: "rgba(34, 139, 34, 0.7)",   // green
  shift:   "rgba(220, 60, 50, 0.7)",   // red
  ctrl:    "rgba(38, 110, 220, 0.7)",  // blue
  alt:     "rgba(220, 175, 50, 0.78)", // yellow
};

export type PieceSetId = "cburnett" | "merida" | "alpha";

export interface BoardPreferences {
  theme: BoardThemeId;
  pieceSet: PieceSetId;
  showCoordinates: boolean;
  animationMs: number;     // 0..400; 0 = instant
  sound: boolean;
}

export const DEFAULT_BOARD_PREFS: BoardPreferences = {
  theme: "paper",
  pieceSet: "cburnett",
  showCoordinates: true,
  animationMs: 180,
  sound: false,
};

const PREFS_STORAGE_KEY = "eca:board-prefs:v1";

export function loadBoardPrefs(): BoardPreferences {
  if (typeof window === "undefined") return DEFAULT_BOARD_PREFS;
  try {
    const raw = window.localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return DEFAULT_BOARD_PREFS;
    const parsed = JSON.parse(raw) as Partial<BoardPreferences>;
    return { ...DEFAULT_BOARD_PREFS, ...parsed };
  } catch {
    return DEFAULT_BOARD_PREFS;
  }
}

export function saveBoardPrefs(prefs: BoardPreferences): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}
