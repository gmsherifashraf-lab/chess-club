"use client";

interface Props {
  values: number[];
  label: string;
  trailingNumber?: string | number;
}

export function EngagementSpark({ values, label, trailingNumber }: Props) {
  const max = Math.max(1, ...values);
  const w = 120;
  const h = 28;
  const step = values.length > 1 ? w / (values.length - 1) : 0;
  const points = values
    .map((v, i) => `${(i * step).toFixed(1)},${(h - (v / max) * h).toFixed(1)}`)
    .join(" ");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: ".75rem",
        padding: ".55rem .75rem",
        border: "1px solid var(--eca-periwinkle)",
        borderRadius: 5,
        background: "var(--eca-paper)",
      }}
    >
      <div>
        <div
          style={{
            fontSize: ".65rem",
            color: "#5C6B88",
            textTransform: "uppercase",
            letterSpacing: ".05em",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "1.05rem",
            color: "var(--eca-navy-ink)",
            fontFamily: "var(--font-mono, monospace)",
            marginTop: 2,
          }}
        >
          {trailingNumber ?? values[values.length - 1] ?? 0}
        </div>
      </div>
      <svg width={w} height={h} role="img" aria-label={`${label} spark`}>
        <polyline
          fill="none"
          stroke="var(--eca-royal)"
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    </div>
  );
}
