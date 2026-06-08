"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/classroom/types";

interface Props {
  messages: ChatMessage[];
  onSend: (body: string) => void;
  canSend: boolean;
  selfId: string;
}

export function ChatPanel({ messages, onSend, canSend, selfId }: Props) {
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !canSend) return;
    onSend(draft);
    setDraft("");
  }

  return (
    <div className="eca-cr-chat">
      <div className="eca-cr-chat-head">Class chat</div>
      <div className="eca-cr-chat-list" ref={listRef}>
        {messages.length === 0 && (
          <div className="eca-cr-chat-msg" data-kind="system">
            <span className="eca-cr-chat-msg-body">Say hello to your class.</span>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className="eca-cr-chat-msg" data-kind={m.kind}>
            <span className="eca-cr-chat-msg-meta">
              {m.authorId === selfId ? "You" : m.authorName}  ·  {timeOf(m.createdAt)}
            </span>
            <span className="eca-cr-chat-msg-body">{m.body}</span>
          </div>
        ))}
      </div>
      <form className="eca-cr-chat-input" onSubmit={submit}>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={canSend ? "Type a message" : "Read-only"}
          disabled={!canSend}
          maxLength={2000}
          aria-label="Message"
        />
        <button
          type="submit"
          className="eca-cr-chat-send"
          disabled={!canSend || !draft.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}

// Format in UTC to guarantee SSR / CSR agreement (server timezone may differ
// from the browser's). The classroom is real-time so seconds-of-precision
// matters less than hydration stability.
function timeOf(iso: string): string {
  try {
    const d = new Date(iso);
    const h = String(d.getUTCHours()).padStart(2, "0");
    const m = String(d.getUTCMinutes()).padStart(2, "0");
    return `${h}:${m} UTC`;
  } catch {
    return "";
  }
}
