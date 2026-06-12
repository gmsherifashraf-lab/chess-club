import "../classroom.css";

export default function ClassroomLoading() {
  return (
    <div className="eca-classroom" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Joining the classroom</span>
      <header className="eca-cr-top">
        <div>
          <div
            style={{
              width: 160,
              height: 14,
              background: "rgba(198,204,241,0.18)",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              width: 220,
              height: 9,
              background: "rgba(198,204,241,0.10)",
              borderRadius: 4,
              marginTop: 6,
            }}
          />
        </div>
        <div
          style={{
            width: 90,
            height: 16,
            background: "rgba(198,204,241,0.10)",
            borderRadius: 4,
          }}
        />
      </header>

      <main className="eca-cr-stage">
        <div className="eca-cr-board-col">
          <div className="eca-cr-board-shell">
            <div
              aria-hidden
              className="eca-cr-board-mount"
              style={{
                background:
                  "linear-gradient(135deg, #EEF0FB 0%, #C6CCF1 50%, #EEF0FB 100%)",
                backgroundSize: "200% 100%",
                animation: "eca-shimmer 1.4s ease-in-out infinite",
                borderRadius: 4,
              }}
            />
          </div>
        </div>
        <aside className="eca-cr-rail">
          <div className="eca-cr-tile-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="eca-cr-tile"
                aria-hidden
                style={{ background: "rgba(198,204,241,0.06)" }}
              />
            ))}
          </div>
        </aside>
      </main>

      <style>{`
        @keyframes eca-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
