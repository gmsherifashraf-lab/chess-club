"use client";

import { useEffect, useRef, useState } from "react";
import {
  type Participant,
  type Room,
  RoomEvent,
  Track,
  type LocalTrackPublication,
  type RemoteTrackPublication,
  type TrackPublication,
} from "livekit-client";
import { Mic, MicOff, Video, VideoOff, MonitorUp, Hand } from "lucide-react";
import type { PresenceState } from "@/lib/classroom/types";

interface Props {
  room: Room | null;
  participants: PresenceState[];
  spotlightCoach?: boolean;
}

interface TileData {
  identity: string;
  name: string;
  role: "coach" | "student" | "observer";
  isLocal: boolean;
  isCoach: boolean;
  micOn: boolean;
  camOn: boolean;
  handRaised: boolean;
  speaking: boolean;
  videoEl: HTMLVideoElement | null;
}

export function VideoRail({ room, participants, spotlightCoach = true }: Props) {
  const [tiles, setTiles] = useState<TileData[]>([]);
  const videoRefs = useRef<Map<string, HTMLVideoElement | null>>(new Map());

  useEffect(() => {
    if (!room) return;

    function sync() {
      if (!room) return;
      const all: TileData[] = [];
      const ps: Participant[] = [room.localParticipant, ...Array.from(room.remoteParticipants.values())];
      for (const p of ps) {
        const presenceMatch = participants.find((pp) => pp.userId === p.identity);
        const isCoach = presenceMatch?.role === "coach";
        all.push({
          identity: p.identity,
          name: p.name ?? presenceMatch?.displayName ?? p.identity,
          role: presenceMatch?.role ?? "observer",
          isLocal: p === room.localParticipant,
          isCoach,
          micOn: p.isMicrophoneEnabled,
          camOn: p.isCameraEnabled,
          handRaised: presenceMatch?.handRaised ?? false,
          speaking: p.isSpeaking,
          videoEl: null,
        });
      }
      all.sort((a, b) => (a.isCoach === b.isCoach ? 0 : a.isCoach ? -1 : 1));
      setTiles(all);
    }

    sync();

    const events: RoomEvent[] = [
      RoomEvent.ParticipantConnected,
      RoomEvent.ParticipantDisconnected,
      RoomEvent.TrackSubscribed,
      RoomEvent.TrackUnsubscribed,
      RoomEvent.TrackMuted,
      RoomEvent.TrackUnmuted,
      RoomEvent.ActiveSpeakersChanged,
      RoomEvent.LocalTrackPublished,
      RoomEvent.LocalTrackUnpublished,
    ];
    for (const ev of events) room.on(ev, sync);

    return () => {
      for (const ev of events) room.off(ev, sync);
    };
  }, [room, participants]);

  useEffect(() => {
    if (!room) return;

    for (const tile of tiles) {
      const el = videoRefs.current.get(tile.identity);
      if (!el) continue;
      const participant =
        tile.isLocal ? room.localParticipant : room.remoteParticipants.get(tile.identity);
      if (!participant) continue;
      const pubs = Array.from(
        participant.trackPublications.values() as Iterable<TrackPublication>,
      );
      const camPub = pubs.find((pub) => pub.source === Track.Source.Camera);
      if (camPub && camPub.track && !camPub.isMuted) {
        camPub.track.attach(el);
      } else {
        el.srcObject = null;
      }
    }
    return () => {
      for (const tile of tiles) {
        const el = videoRefs.current.get(tile.identity);
        const participant =
          tile.isLocal ? room.localParticipant : room.remoteParticipants.get(tile.identity);
        if (!el || !participant) continue;
        const camPubs = Array.from(
          participant.trackPublications.values() as Iterable<TrackPublication>,
        );
        const camPub = camPubs.find((pub) => pub.source === Track.Source.Camera);
        camPub?.track?.detach(el);
      }
    };
  }, [tiles, room]);

  if (!room && tiles.length === 0) {
    return (
      <div className="eca-cr-tile-grid">
        <div className="eca-cr-tile" data-coach="true">
          <div className="eca-cr-tile-fallback">Connecting</div>
        </div>
      </div>
    );
  }

  return (
    <div className="eca-cr-tile-grid" data-spotlight={spotlightCoach}>
      {tiles.map((t) => (
        <div
          key={t.identity}
          className="eca-cr-tile"
          data-coach={t.isCoach ? "true" : "false"}
          data-speaking={t.speaking ? "true" : "false"}
        >
          {t.camOn ? (
            <video
              ref={(el) => {
                videoRefs.current.set(t.identity, el);
              }}
              autoPlay
              muted={t.isLocal}
              playsInline
              className="eca-cr-tile-video"
            />
          ) : (
            <div className="eca-cr-tile-fallback">{initials(t.name)}</div>
          )}

          {t.handRaised && !t.isCoach && (
            <span className="eca-cr-hand-pill">
              <Hand size={11} />
              <span>raised</span>
            </span>
          )}

          <div className="eca-cr-tile-label">
            <span className="eca-cr-tile-label-name">
              {t.isCoach ? "Coach " : ""}{t.name}{t.isLocal ? " (you)" : ""}
            </span>
            <span className="eca-cr-tile-icons" aria-hidden>
              {t.micOn ? <Mic size={12} /> : <MicOff size={12} />}
              {!t.camOn && <VideoOff size={12} />}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}
