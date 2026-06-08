"use client";

import {
  Mic, MicOff, Video, VideoOff, MonitorUp, MonitorStop,
  Hand, MessageSquare, LogOut, Sliders,
} from "lucide-react";
import type { ClassroomGrants } from "@/lib/classroom/permissions";

interface Props {
  micOn: boolean;
  camOn: boolean;
  screenOn: boolean;
  handRaised: boolean;
  chatOpenMobile: boolean;
  grants: ClassroomGrants;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleScreen: () => void;
  onToggleHand: () => void;
  onToggleChat: () => void;
  onOpenDeck: () => void;
  onLeave: () => void;
}

export function ControlBar({
  micOn, camOn, screenOn, handRaised, chatOpenMobile, grants,
  onToggleMic, onToggleCam, onToggleScreen, onToggleHand,
  onToggleChat, onOpenDeck, onLeave,
}: Props) {
  return (
    <div className="eca-cr-controls" role="toolbar" aria-label="Classroom controls">
      <button
        className="eca-cr-ctl"
        data-on={micOn}
        onClick={onToggleMic}
        disabled={!grants.canPublishAudio}
        aria-pressed={micOn}
        aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
      >
        {micOn ? <Mic size={16} /> : <MicOff size={16} />}
        <span className="eca-cr-ctl-label">{micOn ? "Mute" : "Unmute"}</span>
      </button>

      <button
        className="eca-cr-ctl"
        data-on={camOn}
        onClick={onToggleCam}
        disabled={!grants.canPublishVideo}
        aria-pressed={camOn}
        aria-label={camOn ? "Stop camera" : "Start camera"}
      >
        {camOn ? <Video size={16} /> : <VideoOff size={16} />}
        <span className="eca-cr-ctl-label">{camOn ? "Camera" : "Camera"}</span>
      </button>

      {grants.canShareScreen && (
        <button
          className="eca-cr-ctl"
          data-on={screenOn}
          onClick={onToggleScreen}
          aria-pressed={screenOn}
          aria-label={screenOn ? "Stop screen share" : "Share screen"}
        >
          {screenOn ? <MonitorStop size={16} /> : <MonitorUp size={16} />}
          <span className="eca-cr-ctl-label">{screenOn ? "Stop share" : "Share"}</span>
        </button>
      )}

      {!grants.canMuteOthers && (
        <button
          className="eca-cr-ctl"
          data-on={handRaised}
          onClick={onToggleHand}
          aria-pressed={handRaised}
          aria-label={handRaised ? "Lower hand" : "Raise hand"}
        >
          <Hand size={16} />
          <span className="eca-cr-ctl-label">{handRaised ? "Lower" : "Raise"}</span>
        </button>
      )}

      <button
        className="eca-cr-ctl eca-cr-chat-mobile-toggle"
        data-on={chatOpenMobile}
        onClick={onToggleChat}
        aria-label="Toggle chat"
      >
        <MessageSquare size={16} />
        <span className="eca-cr-ctl-label">Chat</span>
      </button>

      {grants.canMuteOthers && (
        <button className="eca-cr-ctl" onClick={onOpenDeck} aria-label="Coach controls">
          <Sliders size={16} />
          <span className="eca-cr-ctl-label">Controls</span>
        </button>
      )}

      <button
        className="eca-cr-ctl"
        data-danger="true"
        onClick={onLeave}
        aria-label="Leave session"
      >
        <LogOut size={16} />
        <span className="eca-cr-ctl-label">Leave</span>
      </button>
    </div>
  );
}
