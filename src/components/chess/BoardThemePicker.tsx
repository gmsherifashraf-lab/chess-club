"use client";

import { Volume2, VolumeX } from "lucide-react";
import { BOARD_THEMES, type BoardPreferences, type BoardThemeId, type PieceSetId } from "./board-themes";

interface BoardThemePickerProps {
  prefs: BoardPreferences;
  onChange: (prefs: BoardPreferences) => void;
}

const PIECE_SETS: { id: PieceSetId; label: string }[] = [
  { id: "cburnett", label: "Cburnett" },
  { id: "merida", label: "Merida" },
  { id: "alpha", label: "Alpha" },
];

export function BoardThemePicker({ prefs, onChange }: BoardThemePickerProps) {
  const setTheme = (id: BoardThemeId) => onChange({ ...prefs, theme: id });
  const setPieces = (id: PieceSetId) => onChange({ ...prefs, pieceSet: id });
  const setCoords = (v: boolean) => onChange({ ...prefs, showCoordinates: v });
  const setAnim = (v: number) => onChange({ ...prefs, animationMs: v });
  const setSound = (v: boolean) => onChange({ ...prefs, sound: v });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <div className="pl-panel-sub" style={{ marginBottom: "0.55rem" }}>Board</div>
        <div className="pl-theme-grid">
          {Object.values(BOARD_THEMES).map((t) => (
            <button
              key={t.id}
              type="button"
              className={`pl-theme-sw${prefs.theme === t.id ? " on" : ""}`}
              onClick={() => setTheme(t.id)}
              aria-pressed={prefs.theme === t.id}
              title={t.label}
            >
              <span className="pl-theme-sw-mini">
                <span style={{ background: t.light }} />
                <span style={{ background: t.dark }} />
                <span style={{ background: t.dark }} />
                <span style={{ background: t.light }} />
              </span>
              <span className="pl-theme-sw-l">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="pl-panel-sub" style={{ marginBottom: "0.55rem" }}>Pieces</div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {PIECE_SETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`pl-btn${prefs.pieceSet === p.id ? " primary" : ""}`}
              onClick={() => setPieces(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="pl-panel-sub" style={{ marginBottom: "0.55rem" }}>Display</div>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.84rem", color: "var(--pl-text-2)" }}>
          <input
            type="checkbox"
            checked={prefs.showCoordinates}
            onChange={(e) => setCoords(e.target.checked)}
          />
          Show coordinates
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.55rem", fontSize: "0.84rem", color: "var(--pl-text-2)" }}>
          {prefs.sound ? <Volume2 style={{ width: 14, height: 14 }} /> : <VolumeX style={{ width: 14, height: 14 }} />}
          <input
            type="checkbox"
            checked={prefs.sound}
            onChange={(e) => setSound(e.target.checked)}
          />
          Move sound
        </label>
      </div>

      <div>
        <div className="pl-panel-sub" style={{ marginBottom: "0.55rem" }}>
          Animation · {prefs.animationMs}ms
        </div>
        <input
          type="range"
          min={0}
          max={400}
          step={20}
          value={prefs.animationMs}
          onChange={(e) => setAnim(Number(e.target.value))}
          style={{ width: "100%", accentColor: "var(--pl-accent)" }}
        />
      </div>
    </div>
  );
}
