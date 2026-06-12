"use client";

import { type ComponentType } from "react";
import {
  ChevronFirst, ChevronLast, ChevronLeft, ChevronRight,
  FlipVertical2, RotateCcw, Cpu,
} from "lucide-react";

interface BoardControlsProps {
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  onFlip: () => void;
  onReset?: () => void;
  /** Engine on/off toggle. Omit to hide the button (e.g. embed). */
  engineOn?: boolean;
  onToggleEngine?: () => void;
  canPrev: boolean;
  canNext: boolean;
  /** Extra slotted children (e.g. "Save" button) rendered after the spacer. */
  trailing?: React.ReactNode;
}

export function BoardControls({
  onFirst, onPrev, onNext, onLast, onFlip, onReset,
  engineOn, onToggleEngine, canPrev, canNext, trailing,
}: BoardControlsProps) {
  return (
    <div className="pl-ctrls" role="toolbar" aria-label="Board controls">
      <IconBtn icon={ChevronFirst} label="First move (Home)" onClick={onFirst} disabled={!canPrev} />
      <IconBtn icon={ChevronLeft} label="Previous move (←)" onClick={onPrev} disabled={!canPrev} />
      <IconBtn icon={ChevronRight} label="Next move (→)" onClick={onNext} disabled={!canNext} />
      <IconBtn icon={ChevronLast} label="Last move (End)" onClick={onLast} disabled={!canNext} />
      <span style={{ width: 1, height: 22, background: "var(--pl-line)", margin: "0 0.35rem" }} aria-hidden />
      <IconBtn icon={FlipVertical2} label="Flip board (F)" onClick={onFlip} />
      {onReset ? <IconBtn icon={RotateCcw} label="Reset position" onClick={onReset} /> : null}
      {onToggleEngine ? (
        <button
          type="button"
          onClick={onToggleEngine}
          className={`pl-btn toggle${engineOn ? " on" : ""}`}
          aria-pressed={engineOn}
          title="Toggle engine (Space)"
        >
          <Cpu />
          <span>{engineOn ? "Engine on" : "Engine"}</span>
        </button>
      ) : null}
      <span className="pl-ctrls-spacer" />
      {trailing}
    </div>
  );
}

function IconBtn({
  icon: Icon, label, onClick, disabled,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="pl-btn icon"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
    >
      <Icon />
    </button>
  );
}
