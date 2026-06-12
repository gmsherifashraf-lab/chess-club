"use client";

import { useMemo } from "react";
import { BoardControls, EngineReadout, FenBar, MoveList, PgnIo } from "@/components/chess";
import type { ChessGameState } from "@/lib/chess/useChessGame";
import type { EngineInfo } from "@/lib/chess/engine-types";

interface ReviewModeProps {
  game: ChessGameState;
  engine: {
    enabled: boolean;
    info: EngineInfo | null;
    loading: boolean;
    toggle: () => void;
  };
}

export function ReviewMode({ game, engine }: ReviewModeProps) {
  const moveListData = useMemo(
    () => game.sanMoves.map((san, i) => ({ san, fenAfter: game.nodes[i + 1]?.fen ?? game.fen })),
    [game.sanMoves, game.nodes, game.fen],
  );

  const copyPgn = () => {
    navigator.clipboard?.writeText(game.exportPgn()).catch(() => {/* ignore */});
  };

  return (
    <>
      <BoardControls
        onFirst={game.first}
        onPrev={game.prev}
        onNext={game.next}
        onLast={game.last}
        onFlip={game.flip}
        engineOn={engine.enabled}
        onToggleEngine={engine.toggle}
        canPrev={game.currentPly > 0}
        canNext={game.currentPly < game.nodes.length - 1}
        trailing={
          <button type="button" className="pl-btn" onClick={copyPgn}>
            Copy PGN
          </button>
        }
      />

      <FenBar fen={game.fen} onLoad={game.loadFen} />

      <div className="pl-panel">
        <div className="pl-panel-hd">
          <div className="pl-panel-hd-l">
            <span className="pl-panel-ttl">Load a game</span>
            <span className="pl-panel-sub">paste PGN</span>
          </div>
        </div>
        <div className="pl-panel-bd">
          <PgnIo pgn={game.exportPgn()} onLoad={game.loadPgn} />
        </div>
      </div>

      {engine.enabled ? (
        <div className="pl-panel">
          <div className="pl-panel-hd">
            <div className="pl-panel-hd-l">
              <span className="pl-panel-ttl">Engine</span>
              <span className="pl-panel-sub">Stockfish 18 lite</span>
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
      ) : null}

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
            emptyHint="Paste a PGN above to start stepping through a game."
          />
        </div>
      </div>
    </>
  );
}
