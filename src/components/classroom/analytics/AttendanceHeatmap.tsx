"use client";

export interface HeatmapCell {
  date: string;
  count: number;
}

interface Props {
  weeks: HeatmapCell[][];
  max?: number;
}

export function AttendanceHeatmap({ weeks, max }: Props) {
  const dataMax = max ?? Math.max(1, ...weeks.flat().map((c) => c.count));
  return (
    <div
      style={{
        border: "1px solid var(--eca-periwinkle)",
        borderRadius: 6,
        padding: ".75rem",
        background: "var(--eca-paper)",
      }}
    >
      <div
        style={{
          fontSize: ".65rem",
          color: "#5C6B88",
          textTransform: "uppercase",
          letterSpacing: ".05em",
          fontFamily: "var(--font-mono, monospace)",
          marginBottom: ".5rem",
        }}
      >
        Attendance pattern
      </div>
      <div style={{ display: "flex", gap: 3 }}>
        {weeks.map((wk, wi) => (
          <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {wk.map((c, ci) => {
              const t = c.count / dataMax;
              const bg = t === 0
                ? "var(--eca-mist)"
                : `rgba(0, 79, 188, ${Math.max(0.15, Math.min(1, t))})`;
              return (
                <span
                  key={ci}
                  title={`${c.date} · ${c.count}`}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    background: bg,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
