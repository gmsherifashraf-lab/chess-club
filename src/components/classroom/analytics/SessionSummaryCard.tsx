"use client";

import { Clock, Users, Hand, MessageSquare, ChevronsRight } from "lucide-react";

export interface SessionSummary {
  sessionId: string;
  classTitle: string;
  startsAt: string;
  endsAt: string;
  attendees: number;
  avgActiveSeconds: number;
  raiseHandCount: number;
  chatMessageCount: number;
  boardPlyCount: number;
}

interface Props {
  summary: SessionSummary;
  onOpen?: () => void;
}

function fmtMins(seconds: number): string {
  if (!seconds) return "0m";
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

// Forced UTC timezone keeps SSR and CSR output identical regardless of
// where Node runs vs. where the user's browser lives.
function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  } catch {
    return iso;
  }
}

export function SessionSummaryCard({ summary, onOpen }: Props) {
  return (
    <article className="eca-cr-summary">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: ".62rem",
              color: "var(--eca-royal)",
              letterSpacing: ".06em",
              textTransform: "uppercase",
            }}
          >
            Session recap
          </div>
          <h3
            style={{
              fontFamily: "var(--font-bodoni, 'Bodoni Moda', serif)",
              fontSize: "1.1rem",
              color: "var(--eca-navy-ink)",
              margin: ".15rem 0 0",
            }}
          >
            {summary.classTitle}
          </h3>
          <div style={{ fontSize: ".75rem", color: "#5C6B88" }}>{fmtDate(summary.startsAt)}</div>
        </div>
        {onOpen && (
          <button
            type="button"
            onClick={onOpen}
            style={{
              background: "var(--eca-mist)",
              border: "1px solid var(--eca-periwinkle)",
              color: "var(--eca-navy-ink)",
              padding: ".35rem .7rem",
              fontSize: ".72rem",
              borderRadius: 4,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: ".3rem",
            }}
          >
            Detail
            <ChevronsRight size={13} />
          </button>
        )}
      </header>
      <div className="eca-cr-summary-grid">
        <div className="eca-cr-summary-cell">
          <div className="eca-cr-summary-lbl"><Users size={11} style={{ display: "inline" }} /> Present</div>
          <div className="eca-cr-summary-num">{summary.attendees}</div>
        </div>
        <div className="eca-cr-summary-cell">
          <div className="eca-cr-summary-lbl"><Clock size={11} style={{ display: "inline" }} /> Avg active</div>
          <div className="eca-cr-summary-num">{fmtMins(summary.avgActiveSeconds)}</div>
        </div>
        <div className="eca-cr-summary-cell">
          <div className="eca-cr-summary-lbl"><Hand size={11} style={{ display: "inline" }} /> Hands raised</div>
          <div className="eca-cr-summary-num">{summary.raiseHandCount}</div>
        </div>
        <div className="eca-cr-summary-cell">
          <div className="eca-cr-summary-lbl"><MessageSquare size={11} style={{ display: "inline" }} /> Chat</div>
          <div className="eca-cr-summary-num">{summary.chatMessageCount}</div>
        </div>
      </div>
    </article>
  );
}
