// Shared formatters for widgets. Tabular numerals where it matters; relative
// time for activity / notifications; absolute time for upcoming sessions.

export function fmtNum(n: number | null | undefined): string {
  if (n == null) return "—";
  if (Math.abs(n) >= 10_000) return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
  return new Intl.NumberFormat("en").format(n);
}

export function fmtPct(n: number | null | undefined, frac = 0): string {
  if (n == null || !isFinite(n)) return "—";
  return `${n.toFixed(frac)}%`;
}

export function fmtRelative(input: string | Date | null | undefined): string {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  const ms = Date.now() - d.getTime();
  const sec = Math.round(ms / 1000);
  if (sec < 45) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.round(day / 7);
  if (wk < 5) return `${wk}w ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function fmtDayMonth(input: string | Date | null | undefined): string {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function fmtTime(input: string | Date | null | undefined): string {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function groupByDay<T extends { at: string | Date | null | undefined }>(
  rows: T[],
): { label: string; rows: T[] }[] {
  const today = startOfDay(new Date());
  const yesterday = startOfDay(new Date(Date.now() - 24 * 3600 * 1000));
  const grouped = new Map<string, { label: string; rows: T[] }>();

  for (const r of rows) {
    if (!r.at) continue;
    const d = startOfDay(new Date(r.at));
    let label: string;
    if (d.getTime() === today.getTime()) label = "Today";
    else if (d.getTime() === yesterday.getTime()) label = "Yesterday";
    else {
      const ageDays = (today.getTime() - d.getTime()) / (24 * 3600 * 1000);
      if (ageDays < 7) {
        label = d.toLocaleDateString(undefined, { weekday: "long" });
      } else {
        label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      }
    }
    const bucket = grouped.get(label) ?? { label, rows: [] };
    bucket.rows.push(r);
    grouped.set(label, bucket);
  }
  return Array.from(grouped.values());
}
