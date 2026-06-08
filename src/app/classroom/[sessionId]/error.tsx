"use client";

import "../classroom.css";
import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function ClassroomError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void import("@/lib/analytics/track").then(({ track }) =>
      track("classroom_error", { digest: error.digest ?? null, message: error.message }),
    );
  }, [error]);

  return (
    <div className="eca-classroom" style={{ display: "grid", placeItems: "center" }}>
      <div className="eca-cr-waiting" role="alert">
        <span className="eca-cr-waiting-meta" style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
          <AlertTriangle size={13} /> The room could not load
        </span>
        <h1>The classroom is offline.</h1>
        <p style={{ color: "#5C6B88", lineHeight: 1.55 }}>
          Your video stream encountered an error. Your coach can see the same notice and will
          rejoin in a moment. You can try again, or step out and come back.
        </p>
        {error.digest && (
          <code
            style={{
              fontFamily: "var(--font-mono), ui-monospace, monospace",
              fontSize: ".7rem",
              color: "#5C6B88",
              background: "#EEF0FB",
              padding: ".35rem .55rem",
              borderRadius: 4,
              alignSelf: "flex-start",
            }}
          >
            ref · {error.digest}
          </code>
        )}
        <div className="eca-cr-waiting-row">
          <button type="button" className="eca-cr-primary" onClick={reset}>
            Try again
          </button>
          <Link href="/dashboard" className="eca-cr-secondary" style={{ textDecoration: "none" }}>
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
