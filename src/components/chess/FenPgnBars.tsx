"use client";

import { useState } from "react";
import { Check, Copy, Clipboard } from "lucide-react";

interface FenBarProps {
  fen: string;
  /** Called with the new FEN when the user presses Enter / blurs the input with a different value. */
  onLoad?: (fen: string) => void;
}

export function FenBar({ fen, onLoad }: FenBarProps) {
  const [draft, setDraft] = useState(fen);
  const [copied, setCopied] = useState(false);

  // Sync draft when external fen changes.
  if (draft !== fen && !document.activeElement?.matches("input[data-fen]")) {
    setDraft(fen);
  }

  const copy = () => {
    navigator.clipboard?.writeText(fen).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }).catch(() => {/* ignore */});
  };

  const paste = async () => {
    try {
      const txt = await navigator.clipboard.readText();
      setDraft(txt);
      onLoad?.(txt.trim());
    } catch { /* ignore */ }
  };

  return (
    <div className="pl-iobar">
      <span className="pl-iobar-l">FEN</span>
      <input
        type="text"
        className="pl-iobar-v"
        data-fen
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { if (draft.trim() !== fen) onLoad?.(draft.trim()); }}
        onKeyDown={(e) => { if (e.key === "Enter") { e.currentTarget.blur(); } }}
        spellCheck={false}
      />
      <button type="button" className="pl-btn icon" onClick={copy} title="Copy FEN" aria-label="Copy FEN">
        {copied ? <Check /> : <Copy />}
      </button>
      <button type="button" className="pl-btn icon" onClick={paste} title="Paste FEN" aria-label="Paste FEN">
        <Clipboard />
      </button>
    </div>
  );
}

interface PgnIoProps {
  pgn: string;
  onLoad: (pgn: string) => void;
}

export function PgnIo({ pgn, onLoad }: PgnIoProps) {
  const [text, setText] = useState(pgn);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setError(null);
    try {
      onLoad(text.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid PGN");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Paste PGN here.\n\n[Event "Tata Steel"]\n[White "Carlsen, M."]\n[Black "Caruana, F."]\n\n1. e4 e5 2. Nf3 Nc6 ...`}
        rows={8}
        style={{
          width: "100%",
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.8rem",
          padding: "0.6rem 0.7rem",
          borderRadius: 5,
          border: "1px solid var(--pl-line)",
          background: "var(--pl-surface-1)",
          color: "var(--pl-text-1)",
          resize: "vertical",
        }}
        spellCheck={false}
      />
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button type="button" className="pl-btn primary" onClick={load}>Load PGN</button>
        {error ? (
          <span style={{ color: "var(--pl-danger)", fontSize: "0.78rem" }}>{error}</span>
        ) : null}
      </div>
    </div>
  );
}
