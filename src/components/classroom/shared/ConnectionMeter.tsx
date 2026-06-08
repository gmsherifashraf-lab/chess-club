"use client";

interface Props {
  quality: "excellent" | "good" | "poor" | "lost" | "unknown";
  label?: string;
}

const LABEL_MAP: Record<Props["quality"], string> = {
  excellent: "Excellent",
  good: "Good",
  poor: "Poor",
  lost: "Reconnecting",
  unknown: "Connecting",
};

export function ConnectionMeter({ quality, label }: Props) {
  return (
    <span className="eca-cr-net" data-quality={quality} aria-label={`Connection: ${LABEL_MAP[quality]}`}>
      <span className="eca-cr-net-bars" aria-hidden>
        <span />
        <span />
        <span />
        <span />
      </span>
      <span>{label ?? LABEL_MAP[quality]}</span>
    </span>
  );
}
