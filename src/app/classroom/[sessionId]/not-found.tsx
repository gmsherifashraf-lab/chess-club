import "../classroom.css";
import Link from "next/link";

export const metadata = {
  title: "Session not found",
  robots: { index: false, follow: false },
};

export default function ClassroomNotFound() {
  return (
    <div className="eca-classroom" style={{ display: "grid", placeItems: "center" }}>
      <div className="eca-cr-waiting">
        <span className="eca-cr-waiting-meta">No session here</span>
        <h1>That class doesn&apos;t exist yet.</h1>
        <p style={{ color: "#5C6B88", lineHeight: 1.55 }}>
          The link may have expired, the session may have been rescheduled, or you may not be
          enrolled in this class. Your dashboard shows everything you can join.
        </p>
        <div className="eca-cr-waiting-row">
          <Link href="/dashboard" className="eca-cr-primary" style={{ textDecoration: "none" }}>
            Open dashboard
          </Link>
          <Link href="/" className="eca-cr-secondary" style={{ textDecoration: "none" }}>
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
