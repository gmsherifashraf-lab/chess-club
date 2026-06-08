"use client";

import { useMemo } from "react";
import { Activity, Cpu } from "lucide-react";
import { fmtCount, formatEval, pvToSan } from "@/lib/chess/notation";
import type { EngineInfo } from "@/lib/chess/engine-types";

interface EngineReadoutProps {
  info: EngineInfo | null;
  /** Position from which to translate the UCI PV into SAN. */
  fen: string;
  sideToMove: "w" | "b";
  loading?: boolean;        // engine warming up
  enabled: boolean;          // engine toggled on
  /** Click a PV ply (0-based) to navigate to that position. */
  onPvClick?: (plyIndex: number, uci: string) => void;
}

export function EngineReadout({ info, fen, sideToMove, loading, enabled, onPvClick }: EngineReadoutProps) {
  const sanPv = useMemo(() => (info ? pvToSan(fen, info.pv, 10) : []), [fen, info]);
  const evalText = info ? formatEval(info.scoreCp, info.scoreMate, sideToMove) : "—";
  const evalClass = evalText.startsWith("+") || evalText.startsWith("M")
    ? "pos"
    : evalText.startsWith("-") || evalText.startsWith("0")
      ? evalText === "0.00" ? "" : "neg"
      : "";

  if (!enabled) {
    return (
      <div className="pl-eng-empty">
        <Cpu style={{ width: 14, height: 14 }} aria-hidden />
        Click <strong style={{ margin: "0 4px", color: "var(--pl-text-2)" }}>Engine</strong> to analyse the position.
      </div>
    );
  }

  if (loading || !info) {
    return (
      <div className="pl-eng-empty">
        <Activity style={{ width: 14, height: 14 }} aria-hidden />
        Stockfish 18 warming up{loading ? "…" : ", waiting for first depth…"}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
      <div className={`pl-eng-score ${evalClass}`}>{evalText}</div>
      <div className="pl-eng">
        <div className="pl-eng-k">Depth</div>
        <div className="pl-eng-v">{info.depth}{info.seldepth ? ` · sel ${info.seldepth}` : ""}</div>
        <div className="pl-eng-k">Nodes</div>
        <div className="pl-eng-v">
          {fmtCount(info.nodes)}{info.nps ? ` · ${fmtCount(info.nps)}/s` : ""}
        </div>
        {info.time != null ? (
          <>
            <div className="pl-eng-k">Time</div>
            <div className="pl-eng-v">{(info.time / 1000).toFixed(1)}s</div>
          </>
        ) : null}
      </div>
      {sanPv.length > 0 ? (
        <div>
          <div className="pl-eng-k" style={{ marginBottom: 4 }}>Best line</div>
          <div className="pl-eng-pv">
            {sanPv.map((san, i) => {
              const moveNo = Math.floor(i / 2) + 1;
              const isWhitePly = (i % 2 === 0);
              const prefix = isWhitePly ? `${moveNo}.` : "";
              return (
                <span key={i}>
                  {prefix ? <span style={{ color: "var(--pl-text-4)", marginRight: 2 }}>{prefix}</span> : null}
                  <span
                    className={`ply${i === 0 ? " best" : ""}`}
                    onClick={() => onPvClick?.(i, info.pv[i])}
                  >
                    {san}
                  </span>
                  {" "}
                </span>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
