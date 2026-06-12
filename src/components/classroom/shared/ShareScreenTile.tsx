"use client";

import { useEffect, useRef } from "react";
import { Track, RoomEvent, type Room, type TrackPublication } from "livekit-client";

interface Props {
  room: Room | null;
}

export function ShareScreenTile({ room }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!room) return;

    function findShare(): { pub: TrackPublication; identity: string } | null {
      if (!room) return null;
      const all = [room.localParticipant, ...Array.from(room.remoteParticipants.values())];
      for (const p of all) {
        const pubs = Array.from(
          p.trackPublications.values() as Iterable<TrackPublication>,
        );
        const pub = pubs.find(
          (t) => t.source === Track.Source.ScreenShare && !t.isMuted,
        );
        if (pub) return { pub, identity: p.identity };
      }
      return null;
    }

    function attach() {
      const target = findShare();
      const el = videoRef.current;
      if (!el || !target?.pub.track) return;
      target.pub.track.attach(el);
    }

    attach();

    const events = [
      RoomEvent.TrackSubscribed,
      RoomEvent.TrackUnsubscribed,
      RoomEvent.LocalTrackPublished,
      RoomEvent.LocalTrackUnpublished,
    ];
    for (const ev of events) room.on(ev, attach);
    return () => {
      for (const ev of events) room.off(ev, attach);
      const target = findShare();
      const el = videoRef.current;
      if (el && target?.pub.track) target.pub.track.detach(el);
    };
  }, [room]);

  const hasShare = !!room && [
    room.localParticipant,
    ...Array.from(room.remoteParticipants.values()),
  ].some((p) => {
    const pubs = Array.from(p.trackPublications.values() as Iterable<TrackPublication>);
    return pubs.some(
      (pub) => pub.source === Track.Source.ScreenShare && !pub.isMuted,
    );
  });

  if (!hasShare) return null;

  return (
    <div
      style={{
        background: "var(--eca-navy-ink)",
        border: "1px solid rgba(198, 204, 241, 0.28)",
        borderRadius: 6,
        overflow: "hidden",
        aspectRatio: "16 / 9",
        position: "relative",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "contain", background: "#000" }}
      />
      <span
        style={{
          position: "absolute",
          left: 8,
          top: 8,
          fontSize: ".65rem",
          background: "rgba(0, 79, 188, 0.92)",
          color: "#fff",
          padding: ".15rem .4rem",
          borderRadius: 3,
          letterSpacing: ".04em",
          textTransform: "uppercase",
          fontFamily: "var(--font-mono, 'Spline Sans Mono', ui-monospace, monospace)",
        }}
      >
        Sharing
      </span>
    </div>
  );
}
