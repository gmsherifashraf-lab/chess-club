"use client";

interface Props {
  label: string;
  count: number;
  emphasis?: boolean;
}

export function ReactionPill({ label, count, emphasis = false }: Props) {
  if (count <= 0) return null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: ".3rem",
        padding: ".15rem .45rem",
        borderRadius: 4,
        fontSize: ".7rem",
        background: emphasis
          ? "rgba(0, 79, 188, 0.18)"
          : "rgba(198, 204, 241, 0.10)",
        border: emphasis
          ? "1px solid rgba(0, 79, 188, 0.6)"
          : "1px solid rgba(198, 204, 241, 0.18)",
        color: emphasis ? "var(--eca-paper)" : "var(--eca-frost)",
        fontFamily: "var(--font-mono, 'Spline Sans Mono', ui-monospace, monospace)",
        letterSpacing: ".03em",
      }}
    >
      {label}
      <span style={{ opacity: 0.7 }}>{count}</span>
    </span>
  );
}
