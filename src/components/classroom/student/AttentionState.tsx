"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";

interface Props {
  connectionQuality: "excellent" | "good" | "poor" | "lost" | "unknown";
}

export function AttentionState({ connectionQuality }: Props) {
  const [tabHidden, setTabHidden] = useState(false);

  useEffect(() => {
    function onVis() {
      setTabHidden(document.visibilityState === "hidden");
    }
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const showNetworkWarn = connectionQuality === "poor" || connectionQuality === "lost";
  if (!tabHidden && !showNetworkWarn) return null;

  return (
    <div
      role="status"
      style={{
        position: "absolute",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        display: "inline-flex",
        alignItems: "center",
        gap: ".4rem",
        padding: ".4rem .7rem",
        background:
          showNetworkWarn ? "rgba(214, 64, 84, 0.92)" : "rgba(20, 35, 63, 0.85)",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 6,
        fontSize: ".72rem",
        zIndex: 20,
        backdropFilter: "blur(6px)",
      }}
    >
      {showNetworkWarn ? (
        <>
          <AlertTriangle size={13} />
          Your connection is {connectionQuality}
        </>
      ) : (
        <>
          {tabHidden ? <EyeOff size={13} /> : <Eye size={13} />}
          You stepped away
        </>
      )}
    </div>
  );
}
