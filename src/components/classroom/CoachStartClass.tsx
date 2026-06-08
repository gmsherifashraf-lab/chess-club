"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  coachRowId: string | null;
  /** Sessions starting within this many minutes count as "imminent". */
  windowMinutes?: number;
}

interface UpcomingSession {
  id: string;
  classTitle: string;
  starts_at: string;
  state: "scheduled" | "in_progress" | "completed" | "cancelled";
}

/**
 * Coach-only widget. If there's a scheduled session within the next N
 * minutes (default 60), surface a one-click "Start class" button. The
 * button POSTs to /api/classroom/[id]/start to flip state, then routes
 * to /classroom/[id]. If the session is already in_progress, defer to
 * <LiveSessionCallout /> (the two are mutually exclusive on screen).
 */
export function CoachStartClass({ coachRowId, windowMinutes = 60 }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [next, setNext] = useState<UpcomingSession | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coachRowId) {
      setLoaded(true);
      return;
    }
    let cancelled = false;

    async function load() {
      if (!coachRowId) return;
      const now = new Date();
      // Look from 15 min in the past (a coach starting a tad late) to the
      // window ahead. Newest first so "starting now" wins over "in 45 min".
      const lowerBound = new Date(now.getTime() - 15 * 60 * 1000).toISOString();
      const upperBound = new Date(now.getTime() + windowMinutes * 60 * 1000).toISOString();

      const { data } = await supabase
        .from("class_sessions")
        .select("id,starts_at,state,classes(title)")
        .eq("coach_id", coachRowId)
        .eq("state", "scheduled")
        .gte("starts_at", lowerBound)
        .lte("starts_at", upperBound)
        .order("starts_at", { ascending: true })
        .limit(1);
      if (cancelled) return;
      const row = data?.[0];
      if (row) {
        setNext({
          id: row.id as string,
          classTitle: ((row.classes as { title?: string } | null)?.title) ?? "Live class",
          starts_at: row.starts_at as string,
          state: row.state as UpcomingSession["state"],
        });
      } else {
        setNext(null);
      }
      setLoaded(true);
    }

    load();
    // Tick every 60s so the "in 5 min" countdown stays current and any
    // newly-imminent session appears without a manual reload.
    const interval = window.setInterval(load, 60_000);

    const channel = supabase
      .channel("coach-start-class")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "class_sessions",
          filter: `coach_id=eq.${coachRowId}`,
        },
        () => load(),
      )
      .subscribe();

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      channel.unsubscribe();
    };
  }, [supabase, coachRowId, windowMinutes]);

  async function startClass() {
    if (!next) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/classroom/${next.id}/start`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Could not start" }));
        throw new Error(body.error ?? `Start failed (${res.status})`);
      }
      router.push(`/classroom/${next.id}`);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  if (!loaded || !next) return null;

  const startsAt = new Date(next.starts_at);
  const deltaMin = Math.round((startsAt.getTime() - Date.now()) / 60_000);
  const timing =
    deltaMin <= 0
      ? deltaMin > -3
        ? "starting now"
        : `should have started ${Math.abs(deltaMin)} min ago`
      : deltaMin === 1
        ? "starts in 1 min"
        : `starts in ${deltaMin} min`;

  return (
    <section
      role="region"
      aria-label="Start your next class"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        padding: ".95rem 1.15rem",
        border: "1px solid var(--c-line)",
        background:
          "linear-gradient(135deg, var(--c-mist) 0%, var(--c-paper) 60%, var(--c-mist) 100%)",
        borderRadius: 6,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: ".15rem", minWidth: 0 }}>
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: ".66rem",
            color: "var(--c-royal)",
            textTransform: "uppercase",
            letterSpacing: ".08em",
            fontWeight: 500,
          }}
        >
          Up next
        </span>
        <span
          style={{
            fontFamily: "var(--font-display), 'Bodoni Moda', serif",
            fontSize: "1.05rem",
            color: "var(--c-navy-ink)",
            lineHeight: 1.2,
          }}
        >
          {next.classTitle}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".3rem",
            fontSize: ".74rem",
            color: "var(--c-muted)",
          }}
        >
          <Clock size={11} />
          {timing}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: ".3rem", alignItems: "flex-end" }}>
        <button
          type="button"
          onClick={startClass}
          disabled={busy}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".4rem",
            background: busy ? "var(--c-royal-deep)" : "var(--c-royal)",
            color: "#fff",
            border: "1px solid var(--c-royal)",
            padding: ".55rem 1.1rem",
            borderRadius: 5,
            fontSize: ".85rem",
            fontWeight: 500,
            cursor: busy ? "wait" : "pointer",
            opacity: busy ? 0.75 : 1,
          }}
        >
          <Play size={14} />
          {busy ? "Starting" : "Start class"}
        </button>
        {error && (
          <span
            role="alert"
            style={{
              fontSize: ".7rem",
              color: "#C03333",
              maxWidth: 240,
              textAlign: "right",
            }}
          >
            {error}
          </span>
        )}
      </div>
    </section>
  );
}
