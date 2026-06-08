"use client";

import type { AnalyzeOpts, BestMoveResult, EngineInfo } from "./engine-types";

const STOCKFISH_URL = "/stockfish/stockfish-18-lite-single.js";

type Resolver<T> = { resolve: (v: T) => void; reject: (e: Error) => void };

/**
 * Promise-based UCI client around Stockfish 18 single-threaded WASM.
 *
 * Lifecycle:
 *   const engine = EngineClient.shared();   // singleton, lazy-boots on first call
 *   await engine.ready();                   // resolves once 'uciok' + 'readyok' received
 *   const best = await engine.analyze({ fen, depth: 18, onInfo });
 *   engine.stop();                          // mid-search abort
 *   engine.quit();                          // tear down the worker
 *
 * Only ONE search runs at a time. Calling analyze() during an active search
 * sends `stop` first and chains the new search after `bestmove` arrives.
 */
export class EngineClient {
  private worker: Worker | null = null;
  private readyPromise: Promise<void> | null = null;
  private currentSearch: {
    resolver: Resolver<BestMoveResult>;
    onInfo?: (info: EngineInfo) => void;
    lastInfo?: EngineInfo;
    aborted?: boolean;
  } | null = null;
  private searchQueue: Array<() => void> = [];
  private booted = false;
  private listeners = new Set<(line: string) => void>();

  private static _shared: EngineClient | null = null;

  static shared(): EngineClient {
    if (!EngineClient._shared) EngineClient._shared = new EngineClient();
    return EngineClient._shared;
  }

  private boot(): void {
    if (this.booted) return;
    this.booted = true;
    this.worker = new Worker(STOCKFISH_URL);
    this.worker.onmessage = (e: MessageEvent<string>) => this.handle(e.data);
    this.worker.onerror = (e) => {
      console.error("[engine] worker error", e.message);
      const cur = this.currentSearch;
      this.currentSearch = null;
      cur?.resolver.reject(new Error(e.message || "Engine worker errored"));
    };
  }

  /** Resolves once the engine is initialised and ready to accept positions. */
  ready(): Promise<void> {
    if (this.readyPromise) return this.readyPromise;
    this.boot();
    this.readyPromise = new Promise<void>((resolve, reject) => {
      let uciOk = false;
      const onLine = (line: string) => {
        if (line === "uciok") {
          uciOk = true;
          this.send("isready");
        } else if (line === "readyok" && uciOk) {
          this.listeners.delete(onLine);
          resolve();
        }
      };
      this.listeners.add(onLine);
      // Failsafe — if engine never responds, reject after 15s.
      const t = setTimeout(() => {
        if (!uciOk) {
          this.listeners.delete(onLine);
          reject(new Error("Engine boot timed out"));
        }
      }, 15000);
      const wrappedResolve = (v: void) => { clearTimeout(t); resolve(v); };
      // Replace the resolver by re-listening; resolve is closed-over above.
      void wrappedResolve;
      this.send("uci");
    });
    return this.readyPromise;
  }

  /** Stream of every raw line the engine emits. Useful for debug overlays. */
  onLine(fn: (line: string) => void): () => void {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }

  /**
   * Analyze a position. Resolves to the best move plus the last info packet.
   * If a previous search is running, it is stopped first.
   */
  async analyze(opts: AnalyzeOpts): Promise<BestMoveResult> {
    await this.ready();

    // Stop any in-flight search and wait for it to settle.
    if (this.currentSearch) {
      const settled = new Promise<void>((res) => this.searchQueue.push(res));
      this.currentSearch.aborted = true;
      this.send("stop");
      await settled;
    }

    // Apply settings.
    if (opts.elo != null) {
      this.send("setoption name UCI_LimitStrength value true");
      this.send(`setoption name UCI_Elo value ${opts.elo}`);
    } else if (opts.skill != null) {
      this.send("setoption name UCI_LimitStrength value false");
      this.send(`setoption name Skill Level value ${opts.skill}`);
    } else {
      this.send("setoption name UCI_LimitStrength value false");
      this.send("setoption name Skill Level value 20");
    }
    this.send(`setoption name MultiPV value ${opts.multipv ?? 1}`);

    this.send("ucinewgame");
    this.send("isready");
    // Wait for readyok (cheap, returns within a few ms).
    await this.awaitLine("readyok");
    this.send(`position fen ${opts.fen}`);

    return new Promise<BestMoveResult>((resolve, reject) => {
      this.currentSearch = { resolver: { resolve, reject }, onInfo: opts.onInfo };
      if (opts.movetime) {
        this.send(`go movetime ${opts.movetime}`);
      } else if (opts.depth) {
        this.send(`go depth ${opts.depth}`);
      } else {
        this.send("go depth 18");
      }
    });
  }

  /** Stop the current search. The pending analyze() promise resolves with the best move so far. */
  stop(): void {
    if (this.currentSearch) this.send("stop");
  }

  /** Tear down the worker. Subsequent calls will re-boot. */
  quit(): void {
    if (!this.worker) return;
    try { this.send("quit"); } catch { /* ignore */ }
    try { this.worker.terminate(); } catch { /* ignore */ }
    this.worker = null;
    this.booted = false;
    this.readyPromise = null;
    this.currentSearch = null;
    this.searchQueue = [];
  }

  // ── Internals ─────────────────────────────────────────────────────────────
  private send(cmd: string): void {
    this.boot();
    this.worker?.postMessage(cmd);
  }

  private awaitLine(needle: string, timeoutMs = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => {
        this.listeners.delete(handler);
        reject(new Error(`Engine timed out waiting for "${needle}"`));
      }, timeoutMs);
      const handler = (line: string) => {
        if (line === needle || line.startsWith(`${needle} `)) {
          clearTimeout(t);
          this.listeners.delete(handler);
          resolve();
        }
      };
      this.listeners.add(handler);
    });
  }

  private handle(line: string): void {
    if (typeof line !== "string") return;
    // Fan-out to listeners (debug overlays, ready watcher, etc.)
    this.listeners.forEach((fn) => fn(line));

    if (line.startsWith("info ")) {
      const info = parseInfo(line);
      if (info && this.currentSearch) {
        this.currentSearch.lastInfo = info;
        this.currentSearch.onInfo?.(info);
      }
      return;
    }

    if (line.startsWith("bestmove ")) {
      const parts = line.split(/\s+/);
      const best = parts[1] ?? "(none)";
      const ponderIdx = parts.indexOf("ponder");
      const ponder = ponderIdx > 0 ? parts[ponderIdx + 1] : undefined;
      const cur = this.currentSearch;
      this.currentSearch = null;
      // Flush queued aborts.
      while (this.searchQueue.length > 0) this.searchQueue.shift()?.();
      cur?.resolver.resolve({ best, ponder, finalInfo: cur.lastInfo });
    }
  }
}

// ── UCI info parser ────────────────────────────────────────────────────────
export function parseInfo(line: string): EngineInfo | null {
  // Example: "info depth 18 seldepth 25 multipv 1 score cp 42 nodes 1234567 nps 1900000 time 650 pv e2e4 e7e5 g1f3"
  const tokens = line.split(/\s+/);
  if (tokens[0] !== "info") return null;
  const out: EngineInfo = { depth: 0, pv: [] };
  let i = 1;
  while (i < tokens.length) {
    const k = tokens[i++];
    switch (k) {
      case "depth":     out.depth     = Number(tokens[i++]); break;
      case "seldepth":  out.seldepth  = Number(tokens[i++]); break;
      case "multipv":   out.multipv   = Number(tokens[i++]); break;
      case "nodes":     out.nodes     = Number(tokens[i++]); break;
      case "nps":       out.nps       = Number(tokens[i++]); break;
      case "hashfull":  out.hashfull  = Number(tokens[i++]); break;
      case "time":      out.time      = Number(tokens[i++]); break;
      case "score": {
        const kind = tokens[i++];
        const val = Number(tokens[i++]);
        if (kind === "cp") out.scoreCp = val;
        else if (kind === "mate") out.scoreMate = val;
        // Skip lowerbound/upperbound markers
        if (tokens[i] === "lowerbound" || tokens[i] === "upperbound") i++;
        break;
      }
      case "pv": {
        out.pv = tokens.slice(i);
        i = tokens.length;
        break;
      }
      case "currmove":
      case "currmovenumber":
      case "tbhits":
      case "string":
        // Skip — value or rest of line not relevant for our UI.
        if (k === "string") i = tokens.length;
        else i++;
        break;
      default:
        // Unknown key, skip its value.
        i++;
    }
  }
  return out;
}
