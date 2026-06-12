import {
  Room,
  RoomEvent,
  Track,
  VideoPresets,
  type ConnectionState,
  type LocalParticipant,
  type RemoteParticipant,
  type TrackPublication,
} from "livekit-client";

export interface TokenResponse {
  token: string;
  url: string;
}

export async function mintClassroomToken(sessionId: string): Promise<TokenResponse> {
  const res = await fetch("/api/livekit/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Token request failed" }));
    throw new Error(err.error ?? `Token request failed (${res.status})`);
  }
  return (await res.json()) as TokenResponse;
}

export function createClassroomRoom(): Room {
  return new Room({
    adaptiveStream: true,
    dynacast: true,
    videoCaptureDefaults: {
      resolution: VideoPresets.h540.resolution,
    },
    publishDefaults: {
      simulcast: true,
      videoSimulcastLayers: [VideoPresets.h180, VideoPresets.h360],
      videoCodec: "vp9",
    },
  });
}

export async function connectToRoom(
  room: Room,
  url: string,
  token: string,
): Promise<void> {
  await room.connect(url, token, {
    autoSubscribe: true,
  });
}

export interface ParticipantSnapshot {
  identity: string;
  name: string;
  isLocal: boolean;
  isSpeaking: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
  isScreenSharing: boolean;
  connectionQuality: ConnectionState | "unknown";
}

export function snapshotParticipant(
  p: LocalParticipant | RemoteParticipant,
  isLocal: boolean,
): ParticipantSnapshot {
  return {
    identity: p.identity,
    name: p.name ?? p.identity,
    isLocal,
    isSpeaking: p.isSpeaking,
    audioEnabled: !p.isMicrophoneEnabled ? false : true,
    videoEnabled: !p.isCameraEnabled ? false : true,
    isScreenSharing: (
      Array.from(p.trackPublications.values() as Iterable<TrackPublication>)
    ).some((pub) => pub.source === Track.Source.ScreenShare && !pub.isMuted),
    connectionQuality: "unknown",
  };
}

export const LK_EVENTS = RoomEvent;
