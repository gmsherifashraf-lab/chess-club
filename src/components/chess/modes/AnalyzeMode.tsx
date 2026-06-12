"use client";

import {
  BoardControls,
  EngineReadout,
  FenBar,
  MoveList,
} from "@/components/chess";
import type { ChessGameState } from "@/lib/chess/useChessGame";
import { useEffect, useMemo } from "react";

interface AnalyzeModeProps {
  game: ChessGameState;
  engine: {
    enabled: boolean;
    info: import("@/lib/chess/engine-types").EngineInfo | null;
    loading: boolean;
    toggle: () => void;
  };
}

export function AnalyzeMode({ game, engine }: AnalyzeModeProps) {
  // Engine on by default for Analyze. (One-shot enable; user can still toggle off.)
  useEffect(() => {
    if (!engine.enabled) engine.toggle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const moveListData = useMemo(
    () => game.sanMoves.map((san, i) => ({ san, fenAfter: game.nodes[i + 1]?.fen ?? game.fen })),
    [game.sanMoves, game.nodes, game.fen],
  );

  return (
    <>
      <BoardControls
        onFirst={game.first}
        onPrev={game.prev}
        onNext={game.next}
        onLast={game.last}
        onFlip={game.flip}
        onReset={() => game.reset()}
        engineOn={engine.enabled}
        onToggleEngine={engine.toggle}
        canPrev={game.currentPly > 0}
        canNext={game.currentPly < game.nodes.length - 1}
      />

      <FenBar fen={game.fen} onLoad={game.loadFen} />

      <div className="pl-panel">
        <div className="pl-panel-hd">
          <div className="pl-panel-hd-l">
            <span className="pl-panel-ttl">Engine</span>
            <span className="pl-panel-sub">{engine.enabled ? "Stockfish 18 lite" : "off"}</span>
          </div>
        </div>
        <div className="pl-panel-bd">
          <EngineReadout
            info={engine.info}
            fen={game.fen}
            sideToMove={game.sideToMove}
            loading={engine.loading}
            enabled={engine.enabled}
          />
        </div>
      </div>

      <div className="pl-panel">
        <div className="pl-panel-hd">
          <div className="pl-panel-hd-l">
            <span className="pl-panel-ttl">Moves</span>
            <span className="pl-panel-sub">{game.sanMoves.length} ply</span>
          </div>
        </div>
        <div className="pl-panel-bd pad-0 scroll">
          <MoveList
            moves={moveListData}
            currentPly={game.currentPly - 1}
            onJump={(ply) => game.jumpToPly(ply + 1)}
            emptyHint="Drag a piece on the board to begin."
          />
        </div>
      </div>
    </>
  );
}
