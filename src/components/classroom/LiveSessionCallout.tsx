"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Radio } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  /**
   * Scope the callout to sessions for these class IDs (player / parent view).
   * Passing `undefined` means "do not filter by class" (admin / unscoped).
   * Passing an empty array `[]` means "the caller knows there are no
   * matching classes yet" — the callout will render nothing rather than
   * showing every live session in the org.
   */
  classIds?: string[];
  /** Coach-row id. When set, matches sessions assigned to this coach. */
  coachRowId?: string;
}

interface LiveSession {
  id: string;
  class_id: string;
  classTitle: string;
  starts_at: string;
}

export function LiveSessionCallout({ classIds, coachRowId }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [live, setLive] = useState<LiveSession | null>(null);

  useEffect(() => {
    // If the caller explicitly scoped to a (possibly-empty) class list and
    // it is empty, they have no matching classes yet — show nothing instead
    // of leaking every live session.
    if (classIds !== undefined && classIds.length === 0) {
      setLive(null);
      return;
    }

    let cancelled = false;
    (async () => {
      let q = supabase
        .from("class_sessions")
        .select("id,class_id,starts_at,classes(title)")
        .eq("state", "in_progress")
        .order("starts_at", { ascending: false })
        .limit(1);
      if (coachRowId) q = q.eq("coach_id", coachRowId);
      if (classIds && classIds.length > 0) q = q.in("class_id", classIds);
      const { data } = await q;
      if (cancelled) return;
      const row = data?.[0];
      if (row) {
        setLive({
          id: row.id as string,
          class_id: row.class_id as string,
          classTitle: ((row.classes as { title?: string } | null)?.title) ?? "Live class",
          starts_at: row.starts_at as string,
        });
      } else {
        setLive(null);
      }
    })();

    const channel = supabase
      .channel("live-session-callout")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "class_sessions" },
        () => {
          if (classIds !== undefined && classIds.length === 0) {
            setLive(null);
            return;
          }
          (async () => {
            let q = supabase
              .from("class_sessions")
              .select("id,class_id,starts_at,classes(title)")
              .eq("state", "in_progress")
              .order("starts_at", { ascending: false })
              .limit(1);
            if (coachRowId) q = q.eq("coach_id", coachRowId);
            if (classIds && classIds.length > 0) q = q.in("class_id", classIds);
            const { data } = await q;
            const row = data?.[0];
            if (row) {
              setLive({
                id: row.id as string,
                class_id: row.class_id as string,
                classTitle: ((row.classes as { title?: string } | null)?.title) ?? "Live class",
                starts_at: row.starts_at as string,
              });
            } else {
              setLive(null);
            }
          })();
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      channel.unsubscribe();
    };
  }, [supabase, coachRowId, classIds?.join(",")]);

  if (!live) return null;

  return (
    <Link
      href={`/classroom/${live.id}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        padding: ".85rem 1.1rem",
        textDecoration: "none",
        background:
          "linear-gradient(135deg, #1C4479 0%, #14233F 60%, #0B3871 100%)",
        color: "#fff",
        border: "1px solid #004FBC",
        borderRadius: 6,
        boxShadow: "0 1px 0 rgba(255,255,255,.06) inset",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: ".6rem" }}>
        <span
          aria-hidden
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#FF5468",
            boxShadow: "0 0 0 4px rgba(255,84,104,0.25)",
          }}
        />
        <span>
          <span style={{ display: "block", fontSize: ".72rem", letterSpacing: ".08em", textTransform: "uppercase", color: "#C6CCF1" }}>
            Live now
          </span>
          <span style={{ display: "block", fontSize: ".95rem", fontWeight: 500 }}>
            {live.classTitle}
          </span>
        </span>
      </span>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: ".4rem",
          fontSize: ".82rem",
          background: "#004FBC",
          padding: ".45rem .85rem",
          borderRadius: 4,
          fontWeight: 500,
        }}
      >
        <Radio size={14} />
        Join classroom
      </span>
    </Link>
  );
}
