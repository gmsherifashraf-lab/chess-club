"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fmtRelative } from "./format";
import "./notification-center.css";

interface NotificationRow {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  category: string | null;
  priority: "low" | "normal" | "high" | "critical";
  read_at: string | null;
  created_at: string;
}

const PAGE_SIZE = 20;

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const triggerRef = useRef<HTMLDivElement>(null);

  const unread = rows.filter((r) => !r.read_at).length;

  const load = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("id, title, body, link, category, priority, read_at, created_at")
      .is("archived_at", null)
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE);
    setRows((data ?? []) as NotificationRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    // Realtime: reload only when THIS user's notifications change. Without the
    // recipient_id filter every client wakes on every other user's insert.
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      channel = supabase
        .channel("notif-bell")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `recipient_id=eq.${user.id}`,
          },
          () => {
            load();
          },
        )
        .subscribe();
    })();
    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [load]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!triggerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const markRead = useCallback(async (id: string) => {
    const supabase = createClient();
    await supabase.rpc("mark_notification_read", { p_id: id });
    setRows((r) => r.map((x) => (x.id === id ? { ...x, read_at: new Date().toISOString() } : x)));
  }, []);

  const markAllRead = useCallback(async () => {
    const supabase = createClient();
    const unreadIds = rows.filter((r) => !r.read_at).map((r) => r.id);
    await Promise.all(unreadIds.map((id) => supabase.rpc("mark_notification_read", { p_id: id })));
    setRows((r) => r.map((x) => (x.read_at ? x : { ...x, read_at: new Date().toISOString() })));
  }, [rows]);

  const onItem = (n: NotificationRow) => {
    if (!n.read_at) markRead(n.id);
    if (n.link) {
      window.location.assign(n.link);
    }
    setOpen(false);
  };

  return (
    <div ref={triggerRef} style={{ position: "relative" }}>
      <button
        type="button"
        className="nc-trigger"
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Bell />
        {unread > 0 ? <span className="nc-badge">{unread > 9 ? "9+" : unread}</span> : null}
      </button>

      {open ? (
        <div className="nc-panel" role="dialog" aria-label="Notifications">
          <div className="nc-hd">
            <div className="nc-hd-t">Notifications</div>
            {unread > 0 ? (
              <button type="button" className="nc-hd-act" onClick={markAllRead}>
                <CheckCheck style={{ width: 13, height: 13, display: "inline", verticalAlign: "-2px", marginRight: 4 }} />
                Mark all read
              </button>
            ) : null}
          </div>

          <div className="nc-list">
            {loading ? (
              <div style={{ padding: "1.25rem" }}>
                <div className="wg-skel-line" style={{ marginBottom: 10 }} />
                <div className="wg-skel-line" style={{ width: "70%", marginBottom: 10 }} />
                <div className="wg-skel-line" style={{ width: "90%" }} />
              </div>
            ) : rows.length === 0 ? (
              <div className="nc-empty">
                <BellOff style={{ width: 22, height: 22, opacity: 0.3, display: "block", margin: "0 auto 0.5rem" }} />
                You&rsquo;re all caught up.
              </div>
            ) : (
              rows.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={`nc-item${n.read_at ? "" : " unread"}`}
                  onClick={() => onItem(n)}
                >
                  <span className="nc-item-dot" aria-hidden />
                  <span className="nc-item-bd">
                    <span className="nc-item-t">{n.title}</span>
                    {n.body ? <span className="nc-item-b">{n.body}</span> : null}
                    <span className="nc-item-m">
                      {fmtRelative(n.created_at)}
                      {n.category ? ` · ${n.category}` : ""}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
