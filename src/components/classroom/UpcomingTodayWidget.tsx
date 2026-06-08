"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Play } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ScheduledSession {
  id: string;
  classTitle: string;
  coachName: string;
  starts_at: string;
  ends_at: string;
}

/**
 * Admin-only widget. Lists scheduled sessions for *today* (UTC day) so the
 * admin can flip any of them to in_progress without waiting for the coach's
 * 60-min imminent window. Distinct from the LiveSessionsAllWidget (which
 * only shows in_progress) and CoachStartClass (which is coach-scoped and
 * windowed).
 */
export function UpcomingTodayWidget() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [rows, setRows] = useState<ScheduledSession[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [starting, setStarting] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const now = new Date();
      const dayStart = new Date(now);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(now);
      dayEnd.setHours(23, 59, 59, 999);

      const { data } = await supabase
        .from("class_sessions")
        .select("id,starts_at,ends_at,classes(title),coaches(profiles(full_name))")
        .eq("state", "scheduled")
        .gte("starts_at", dayStart.toISOString())
        .lte("starts_at", dayEnd.toISOString())
        .order("starts_at", { ascending: true });

      if (cancelled) return;

      const out: ScheduledSession[] = [];
      for (const row of data ?? []) {
        const r = row as {
          id: string;
          starts_at: string;
          ends_at: string;
          classes: { title?: string } | null;
          coaches: { profiles?: { full_name?: string } } | null;
        };
        out.push({
          id: r.id,
          starts_at: r.starts_at,
          ends_at: r.ends_at,
          classTitle: r.classes?.title ?? "Class",
          coachName:
            r.coaches?.profiles?.full_name?.split("—")[0]?.trim() ?? "Coach",
        });
      }
      setRows(out);
      setLoaded(true);
    }

    load();

    const channel = supabase
      .channel("upcoming-today-widget")
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

  async function startNow(sessionId: string) {
    setStarting(sessionId);
    try {
      const res = await fetch(`/api/classroom/${sessionId}/start`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Start failed" }));
        throw new Error(body.error ?? `Start failed (${res.status})`);
      }
      router.push(`/classroom/${sessionId}`);
    } catch (e) {
      setStarting(null);
      // eslint-disable-next-line no-alert
      alert(`Could not start the class: ${(e as Error).message}`);
    }
  }

  if (!loaded) {
    return (
      <section
        aria-label="Today's scheduled classes"
        style={{
          border: "1px solid var(--c-line)",
          borderRadius: 6,
          padding: "1rem 1.15rem",
          background: "var(--c-paper)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: ".66rem",
            color: "var(--c-muted)",
            textTransform: "uppercase",
            letterSpacing: ".06em",
          }}
        >
          Today
        </div>
        <div
          style={{
            marginTop: ".5rem",
            height: 14,
            background: "var(--c-mist)",
            borderRadius: 3,
            width: "50%",
          }}
        />
      </section>
    );
  }

  if (rows.length === 0) return null;

  return (
    <section
      aria-label="Today's scheduled classes"
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
          background: "var(--c-mist)",
        }}
      >
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
          Today's schedule · {rows.length}
        </span>
      </header>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {rows.map((r) => {
          const startsAt = new Date(r.starts_at);
          const deltaMin = Math.round((startsAt.getTime() - Date.now()) / 60_000);
          const timing =
            deltaMin <= 0
              ? "ready to start"
              : deltaMin < 60
                ? `in ${deltaMin} min`
                : `at ${startsAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
          return (
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
                    fontSize: ".98rem",
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
                    display: "inline-flex",
                    alignItems: "center",
                    gap: ".3rem",
                  }}
                >
                  <Clock size={11} />
                  Coach {r.coachName} · {timing}
                </div>
              </div>
              <button
                type="button"
                onClick={() => startNow(r.id)}
                disabled={starting === r.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".3rem",
                  background: starting === r.id ? "var(--c-royal-deep)" : "var(--c-royal)",
                  color: "#fff",
                  border: "1px solid var(--c-royal)",
                  padding: ".4rem .8rem",
                  borderRadius: 4,
                  fontSize: ".78rem",
                  fontWeight: 500,
                  cursor: starting === r.id ? "wait" : "pointer",
                  flexShrink: 0,
                  opacity: starting === r.id ? 0.8 : 1,
                }}
              >
                <Play size={12} />
                {starting === r.id ? "Starting" : "Start"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
