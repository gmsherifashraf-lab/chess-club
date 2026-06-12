"use client";

import { useState } from "react";
import Link from "next/link";
import { DeviceCheck } from "@/components/classroom/shared/DeviceCheck";
import { ClassroomRoom } from "@/components/classroom/room/ClassroomRoom";
import type { ClassroomIdentity, ClassroomSessionInfo } from "@/lib/classroom/types";

interface Props {
  identity: ClassroomIdentity;
  session: ClassroomSessionInfo;
}

export function ClassroomGateClient({ identity, session }: Props) {
  const [ready, setReady] = useState<{ micOn: boolean; camOn: boolean } | null>(null);

  if (ready) {
    return (
      <ClassroomRoom
        identity={identity}
        session={session}
        initialMic={ready.micOn}
        initialCam={ready.camOn}
      />
    );
  }

  return (
    <div className="eca-classroom" style={{ display: "block" }}>
      <div className="eca-cr-waiting">
        <div className="eca-cr-waiting-meta">
          {identity.role === "coach" ? "You are the coach" : "Class starting"}
        </div>
        <h1>{session.classTitle}</h1>
        <p style={{ color: "#5C6B88", fontSize: ".9rem" }}>
          With Coach {session.coachName}. Take a moment to check your camera and microphone before joining.
        </p>
        <DeviceCheck
          onReady={(cfg) => setReady(cfg)}
          primaryLabel={identity.role === "coach" ? "Start class" : "Join class"}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: ".72rem", color: "#5C6B88" }}>
            Joining as {identity.displayName}
          </span>
          <Link
            href="/dashboard"
            style={{
              color: "var(--eca-royal)",
              fontSize: ".78rem",
              textDecoration: "none",
            }}
          >
            Not now
          </Link>
        </div>
      </div>
    </div>
  );
}
