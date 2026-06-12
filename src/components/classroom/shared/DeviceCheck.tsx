"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

interface Props {
  onReady: (config: { micOn: boolean; camOn: boolean }) => void;
  primaryLabel?: string;
}

export function DeviceCheck({ onReady, primaryLabel = "Enter classroom" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (e) {
        setError((e as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = micOn));
  }, [micOn, stream]);

  useEffect(() => {
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => (t.enabled = camOn));
  }, [camOn, stream]);

  function enter() {
    stream?.getTracks().forEach((t) => t.stop());
    onReady({ micOn, camOn });
  }

  return (
    <div className="eca-cr-waiting-preview">
      {error ? (
        <div style={{ padding: "1rem", textAlign: "center" }}>
          Camera or microphone access was denied.<br />
          You can still join muted.
          <div style={{ marginTop: "1rem" }}>
            <button className="eca-cr-primary" onClick={() => onReady({ micOn: false, camOn: false })}>
              Join muted
            </button>
          </div>
        </div>
      ) : (
        <>
          <video ref={videoRef} autoPlay muted playsInline />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 12,
              display: "flex",
              gap: ".5rem",
              justifyContent: "center",
            }}
          >
            <button
              className="eca-cr-ctl"
              data-on={micOn}
              onClick={() => setMicOn((v) => !v)}
            >
              {micOn ? <Mic size={14} /> : <MicOff size={14} />}
              <span>{micOn ? "Mic on" : "Mic off"}</span>
            </button>
            <button
              className="eca-cr-ctl"
              data-on={camOn}
              onClick={() => setCamOn((v) => !v)}
            >
              {camOn ? <Video size={14} /> : <VideoOff size={14} />}
              <span>{camOn ? "Camera on" : "Camera off"}</span>
            </button>
          </div>
          <div
            style={{
              position: "absolute",
              right: 12,
              top: 12,
            }}
          >
            <button className="eca-cr-primary" onClick={enter}>
              {primaryLabel}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
