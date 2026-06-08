"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Radio, ChevronsRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface LiveSession {
  id: string;
  classTitle: string;
  coachName: string;
  starts_at: string;
  attendees: number;
}

/**
 * Admin-only widget: lists every classroom currently `in_progress`, with
 * one-click join. Distinct from LiveSessionCallout, which is single-session
 * and player/coach-scoped. The two are deliberately separate components so
 * the Impeccable surface targets stay clean.
 */
export function LiveSessionsAllWidget() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<LiveSession[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data } = await supabase
        .from("class_sessions")
        .select(
          "id,starts_at,classes(title),coaches(profiles(full_name)),attendance(player_id,date,session_id)",
        )
        .eq("state", "in_progress")
        .order("starts_at", { ascending: false });

      if (cancelled) return;

      const out: LiveSession[] = [];
      for (const row of data ?? []) {
        const r = row as {
          id: string;
          starts_at: string;
          classes: { title?: string } | null;
          coaches: { profiles?: { full_name?: string } } | null;
          attendance?: Array<{ session_id?: string | null }>;
        };
        out.push({
          id: r.id,
          starts_at: r.starts_at,
          classTitle: r.classes?.title ?? "Live class",
          coachName:
            r.coaches?.profiles?.full_name?.split("—")[0]?.trim() ??
            "Coach",
          attendees:
            (r.attendance ?? []).filter((a) => a.session_id === r.id).length,
        });
      }
      setRows(out);
      setLoaded(true);
    }

    load();

    const channel = supabase
      .channel("live-sessions-all-widget")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "class_sessions" },
        () => load(),
      )
      .subscribe();

    return () => {
      cancelled = true;
      channel.unsubscribe();
    };
  }, [supabase]);

  if (!loaded) {
    return (
      <section
        aria-label="Live classes"
        style={{
          border: "1px solid var(--c-line)",
          borderRadius: 6,
          padding: ".85rem 1rem",
          background: "var(--c-paper)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: ".68rem",
            color: "var(--c-muted)",
            textTransform: "uppercase",
            letterSpacing: ".06em",
          }}
        >
          Live now
        </div>
        <div
          style={{
            marginTop: ".4rem",
            height: 14,
            background: "var(--c-mist)",
            borderRadius: 3,
            width: "60%",
          }}
        />
      </section>
    );
  }

  if (rows.length === 0) {
    return (
      <section
        aria-label="Live classes"
        style={{
          border: "1px solid var(--c-line)",
          borderRadius: 6,
          padding: "1rem",
          background: "var(--c-paper)",
          display: "flex",
          flexDirection: "column",
          gap: ".4rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: ".68rem",
            color: "var(--c-muted)",
            textTransform: "uppercase",
            letterSpacing: ".06em",
          }}
        >
          Live now
        </span>
        <p
          style={{
            fontSize: ".82rem",
            color: "var(--c-muted)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          No classrooms are live right now. When a coach starts a session it will appear here.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="Live classes"
      style={{
        border: "1px solid var(--c-line)",
        borderRadius: 6,
        background: "var(--c-paper)",
        overflow: "hidden",
      }}
    >
      <header
        style={{
          padding: ".7rem 1rem",
          borderBottom: "1px solid var(--c-line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--c-mist)",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".4rem",
            fontFamily: "var(--font-mono), monospace",
            fontSize: ".7rem",
            color: "var(--c-royal)",
            textTransform: "uppercase",
            letterSpacing: ".06em",
            fontWeight: 500,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#FF5468",
              boxShadow: "0 0 0 3px rgba(255,84,104,0.18)",
            }}
          />
          Live now · {rows.length}
        </span>
      </header>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {rows.map((r) => (
          <li
            key={r.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: ".75rem",
              padding: ".7rem 1rem",
              borderTop: "1px solid var(--c-line)",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-display), 'Bodoni Moda', serif",
                  fontSize: "1rem",
                  color: "var(--c-navy-ink)",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {r.classTitle}
              </div>
              <div
                style={{
                  fontSize: ".72rem",
                  color: "var(--c-muted)",
                  marginTop: 2,
                }}
              >
                Coach {r.coachName} · {fmtStarted(r.starts_at)}
              </div>
            </div>
            <Link
              href={`/classroom/${r.id}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".35rem",
                background: "var(--c-royal)",
                color: "#fff",
                padding: ".4rem .8rem",
                borderRadius: 4,
                fontSize: ".78rem",
                fontWeight: 500,
                textDecoration: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <Radio size={13} />
              Join
              <ChevronsRight size={13} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function fmtStarted(iso: string): string {
  try {
    const startedMs = new Date(iso).getTime();
    const mins = Math.max(0, Math.round((Date.now() - startedMs) / 60000));
    if (mins < 1) return "just started";
    if (mins === 1) return "1 min in";
    if (mins < 60) return `${mins} min in`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h}h in` : `${h}h ${m}m in`;
  } catch {
    return "in progress";
  }
}
