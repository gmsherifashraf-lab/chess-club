import type { ColumnConfig, FieldConfig } from "./CrudShell";

// ─── Row types (mirror Supabase tables) ──────────────────────────────────────
export interface PlayerRow      { id: string; name: string; rating: number | null; age: number | null; image_url: string | null; created_at: string }
export interface CoachRow       { id: string; name: string; title: string | null; image_url: string | null; created_at: string }
export interface TournamentRow  { id: string; name: string; date: string; location: string | null; description: string | null; created_at: string }
export interface NewsRow        { id: string; title: string; category: string | null; excerpt: string | null; body: string | null; image_url: string | null; published_at: string | null; created_at: string }

// ─── Shared cell renderers ───────────────────────────────────────────────────
function Thumb({ url, alt }: { url: string | null; alt: string }) {
  if (!url) return <span style={{ opacity: .3 }}>—</span>;
  return (
    <img
      src={url}
      alt={alt}
      style={{ width: 36, height: 36, objectFit: "cover", border: "1px solid #D6D0C4" }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}

function dim(text: string | null | undefined) {
  if (!text) return <span style={{ opacity: .3 }}>—</span>;
  return <span style={{ opacity: .6 }}>{text}</span>;
}

function truncate(s: string | null | undefined, n = 60) {
  if (!s) return null;
  return s.length > n ? s.slice(0, n) + "…" : s;
}

function formatDate(value: string | null | undefined) {
  if (!value) return null;
  // "2026-05-18" or ISO timestamp — display as "May 18, 2026"
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

// ─── Players ─────────────────────────────────────────────────────────────────
export const playerColumns: ColumnConfig<PlayerRow>[] = [
  { headerAr: "الصورة",   headerEn: "Image",  width: "60px", render: (r) => <Thumb url={r.image_url} alt={r.name} /> },
  { headerAr: "الاسم",    headerEn: "Name",   render: (r) => <b>{r.name}</b> },
  { headerAr: "العمر",    headerEn: "Age",    width: "80px", render: (r) => r.age ?? dim(null) },
  { headerAr: "التصنيف", headerEn: "Rating", width: "100px", render: (r) => r.rating ? <b>{r.rating}</b> : dim(null) },
];

export const playerFields: FieldConfig[] = [
  { key: "name",      labelAr: "الاسم",    labelEn: "Name",      type: "text",   required: true },
  { key: "rating",    labelAr: "التصنيف", labelEn: "Rating",    type: "number", placeholder: "e.g. 1500" },
  { key: "age",       labelAr: "العمر",   labelEn: "Age",       type: "number", placeholder: "e.g. 12" },
  { key: "image_url", labelAr: "رابط الصورة", labelEn: "Image URL", type: "url",  placeholder: "https://…" },
];

// ─── Coaches ─────────────────────────────────────────────────────────────────
export const coachColumns: ColumnConfig<CoachRow>[] = [
  { headerAr: "الصورة",  headerEn: "Image", width: "60px", render: (r) => <Thumb url={r.image_url} alt={r.name} /> },
  { headerAr: "الاسم",   headerEn: "Name",  render: (r) => <b>{r.name}</b> },
  { headerAr: "اللقب",   headerEn: "Title", render: (r) => r.title ?? dim(null) },
];

export const coachFields: FieldConfig[] = [
  { key: "name",      labelAr: "الاسم",       labelEn: "Name",      type: "text", required: true },
  { key: "title",     labelAr: "اللقب",       labelEn: "Title",     type: "text", placeholder: "e.g. Head Coach" },
  { key: "image_url", labelAr: "رابط الصورة", labelEn: "Image URL", type: "url",  placeholder: "https://…" },
];

// ─── Tournaments ─────────────────────────────────────────────────────────────
export const tournamentColumns: ColumnConfig<TournamentRow>[] = [
  { headerAr: "الاسم",    headerEn: "Name",     render: (r) => <b>{r.name}</b> },
  { headerAr: "التاريخ", headerEn: "Date",     width: "140px", render: (r) => formatDate(r.date) ?? dim(null) },
  { headerAr: "الموقع",  headerEn: "Location", render: (r) => r.location ?? dim(null) },
  { headerAr: "الوصف",   headerEn: "Description", render: (r) => truncate(r.description) ?? dim(null) },
];

export const tournamentFields: FieldConfig[] = [
  { key: "name",        labelAr: "الاسم",       labelEn: "Name",        type: "text",     required: true },
  { key: "date",        labelAr: "التاريخ",     labelEn: "Date",        type: "date",     required: true },
  { key: "location",    labelAr: "الموقع",      labelEn: "Location",    type: "text",     placeholder: "e.g. Sharjah Cultural Center" },
  { key: "description", labelAr: "الوصف",       labelEn: "Description", type: "textarea" },
];

// ─── News ────────────────────────────────────────────────────────────────────
export const newsColumns: ColumnConfig<NewsRow>[] = [
  { headerAr: "الصورة",  headerEn: "Image",     width: "60px",  render: (r) => <Thumb url={r.image_url} alt={r.title} /> },
  { headerAr: "العنوان", headerEn: "Title",     render: (r) => <b>{truncate(r.title, 80)}</b> },
  { headerAr: "التصنيف", headerEn: "Category",  width: "120px", render: (r) => r.category ? <span className="badge badge-red">{r.category}</span> : dim(null) },
  { headerAr: "النشر",   headerEn: "Published", width: "140px", render: (r) => r.published_at ? formatDate(r.published_at) : <span className="badge badge-gold">Draft</span> },
];

export const newsFields: FieldConfig[] = [
  { key: "title",        labelAr: "العنوان",       labelEn: "Title",        type: "text",     required: true },
  { key: "category",     labelAr: "التصنيف",       labelEn: "Category",     type: "text",     placeholder: "Achievement / Program / Newsletter" },
  { key: "excerpt",      labelAr: "ملخّص",         labelEn: "Excerpt",      type: "textarea" },
  { key: "body",         labelAr: "المحتوى",       labelEn: "Body",         type: "textarea" },
  { key: "image_url",    labelAr: "رابط الصورة",   labelEn: "Image URL",    type: "url" },
  { key: "published_at", labelAr: "تاريخ النشر",  labelEn: "Published At", type: "datetime" },
];

