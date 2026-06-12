"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EngineClient } from "./EngineClient";
import type { EngineInfo, AnalyzeOpts, BestMoveResult } from "./engine-types";

interface UseEngineOptions {
  /** Auto-analyze on every fen change once enabled. Default true for Analyze mode. */
  autoAnalyze?: boolean;
  /** Depth for auto-analysis. */
  depth?: number;
  /** Number of principal variations. */
  multipv?: number;
}

/**
 * React-friendly wrapper around EngineClient. Streams the latest engine
 * info into state as analysis progresses.
 */
export function useEngine(fen: string, opts: UseEngineOptions = {}) {
  const { autoAnalyze = true, depth = 18, multipv = 1 } = opts;
  const [enabled, setEnabled] = useState(false);
  const [info, setInfo] = useState<EngineInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const engineRef = useRef<EngineClient | null>(null);
  const fenRef = useRef(fen);
  fenRef.current = fen;

  // Lazy-create the engine client.
  useEffect(() => {
    if (!enabled) return;
    if (!engineRef.current) engineRef.current = EngineClient.shared();
    let cancelled = false;
    setLoading(true);
    engineRef.current.ready()
      .then(() => { if (!cancelled) setLoading(false); })
      .catch((e) => {
        if (!cancelled) {
          setLoading(false);
          console.error("[useEngine] boot failed", e);
        }
      });
    return () => { cancelled = true; };
  }, [enabled]);

  // Re-analyze when fen changes (if enabled and autoAnalyze).
  useEffect(() => {
    if (!enabled || !autoAnalyze) return;
    const engine = engineRef.current;
    if (!engine) return;
    let cancelled = false;
    setInfo(null);
    engine.analyze({
      fen,
      depth,
      multipv,
      onInfo: (i) => {
        if (cancelled) return;
        setInfo(i);
      },
    }).catch((e) => {
      console.warn("[useEngine] analyze failed", e);
    });
    return () => {
      cancelled = true;
      engine.stop();
    };
  }, [enabled, autoAnalyze, fen, depth, multipv]);

  const analyzeOnce = useCallback(async (overrides?: Partial<AnalyzeOpts>): Promise<BestMoveResult | null> => {
    const engine = engineRef.current ?? EngineClient.shared();
    engineRef.current = engine;
    try {
      await engine.ready();
      return await engine.analyze({
        fen: fenRef.current,
        depth,
        multipv,
        ...overrides,
        onInfo: (i) => setInfo(i),
      });
    } catch (e) {
      console.warn("[useEngine] analyzeOnce failed", e);
      return null;
    }
  }, [depth, multipv]);

  const stop = useCallback(() => {
    engineRef.current?.stop();
  }, []);

  const toggle = useCallback(() => setEnabled((e) => !e), []);

  return { enabled, setEnabled, toggle, info, loading, analyzeOnce, stop };
}
