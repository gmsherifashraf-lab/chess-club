import type { ColumnConfig, FieldConfig } from "./CrudShell";

// ─── Row types (mirror Supabase tables) ──────────────────────────────────────
export interface PlayerRow      { id: string; name: string; rating: number | null; age: number | null; image_url: string | null; created_at: string }
export interface CoachRow       { id: string; name: string; title: string | null; image_url: string | null; created_at: string }
export interface TournamentRow  { id: string; name: string; date: string; location: string | null; description: string | null; created_at: string }
export interface NewsRow        { id: string; title: string; category: string | null; excerpt: string | null; body: string | null; image_url: string | null; published_at: string | null; created_at: string }
export interface GalleryRow     { id: string; title_ar: string; title_en: string; subtitle_ar: string | null; subtitle_en: string | null; image_url: string | null; emoji: string | null; span: string; accent: string; sort_order: number; is_published: boolean; created_at: string }

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

// ─── Gallery ─────────────────────────────────────────────────────────────────
export const galleryColumns: ColumnConfig<GalleryRow>[] = [
  { headerAr: "الصورة",  headerEn: "Image",  width: "70px", render: (r) => <Thumb url={r.image_url} alt={r.title_en} /> },
  { headerAr: "العنوان", headerEn: "Title",  render: (r) => (
    <div>
      <div style={{ fontWeight: 600, color: "#141414" }}>{r.title_en}</div>
      <div style={{ fontSize: ".78rem", opacity: .55, marginTop: 2 }}>{r.title_ar}</div>
    </div>
  )},
  { headerAr: "النوع",   headerEn: "Span",   width: "90px",  render: (r) => <span className="badge badge-ink">{r.span}</span> },
  { headerAr: "اللون",   headerEn: "Accent", width: "90px",  render: (r) => <span className={`badge ${r.accent === "red" ? "badge-red" : r.accent === "green" ? "badge-green" : r.accent === "gold" ? "badge-gold" : "badge-ink"}`}>{r.accent}</span> },
  { headerAr: "الترتيب", headerEn: "Order",  width: "80px",  render: (r) => <span style={{ opacity: .7 }}>{r.sort_order}</span> },
  { headerAr: "النشر",   headerEn: "Status", width: "100px", render: (r) => r.is_published
    ? <span className="badge badge-green">Published</span>
    : <span className="badge badge-gold">Draft</span>
  },
];

export const galleryFields: FieldConfig[] = [
  { key: "title_en",      labelAr: "العنوان (إنجليزي)", labelEn: "Title (English)",   type: "text", required: true },
  { key: "title_ar",      labelAr: "العنوان (عربي)",    labelEn: "Title (Arabic)",    type: "text", required: true },
  { key: "subtitle_en",   labelAr: "الوصف (إنجليزي)",   labelEn: "Subtitle (English)",type: "text" },
  { key: "subtitle_ar",   labelAr: "الوصف (عربي)",      labelEn: "Subtitle (Arabic)", type: "text" },
  { key: "image_url",     labelAr: "رابط الصورة",        labelEn: "Image URL",         type: "url",  placeholder: "https://… (leave empty to show gradient tile)" },
  { key: "emoji",         labelAr: "رمز (اختياري)",      labelEn: "Emoji (fallback)",  type: "text", placeholder: "🏆 ♛ 🥇 …", defaultValue: "✦" },
  { key: "accent",        labelAr: "اللون المؤسسي",      labelEn: "Accent",            type: "select", required: true, defaultValue: "red", options: [
    { value: "red",   labelEn: "Red"    },
    { value: "green", labelEn: "Green"  },
    { value: "ink",   labelEn: "Ink"    },
    { value: "gold",  labelEn: "Gold"   },
  ]},
  { key: "span",          labelAr: "حجم البلاطة",       labelEn: "Tile Size",         type: "select", required: true, defaultValue: "normal", options: [
    { value: "normal", labelEn: "Normal (1×1)" },
    { value: "wide",   labelEn: "Wide (2×1)"   },
    { value: "tall",   labelEn: "Tall (1×2)"   },
  ]},
  { key: "sort_order",    labelAr: "الترتيب",           labelEn: "Sort Order",        type: "number", placeholder: "0", defaultValue: "0" },
  { key: "is_published",  labelAr: "نشر علناً",         labelEn: "Published",         type: "boolean", defaultValue: "true", placeholder: "Visible on public site" },
];

// ─── Board of Directors ──────────────────────────────────────────────────────
export interface BoardRow { id: string; name_ar: string; name_en: string; role_ar: string | null; role_en: string | null; honorific_ar: string | null; honorific_en: string | null; photo: string | null; category: string; sort_order: number; is_published: boolean; created_at: string }

export const boardColumns: ColumnConfig<BoardRow>[] = [
  { headerAr: "الصورة", headerEn: "Photo", width: "60px", render: (r) => <Thumb url={r.photo} alt={r.name_en} /> },
  { headerAr: "الاسم",  headerEn: "Name",  render: (r) => (
    <div>
      <div style={{ fontWeight: 600, color: "#141414" }}>{r.name_en}</div>
      <div style={{ fontSize: ".78rem", opacity: .55, marginTop: 2 }}>{r.name_ar}</div>
    </div>
  )},
  { headerAr: "الصفة",  headerEn: "Role",  render: (r) => dim(r.role_en) },
  { headerAr: "الفئة",  headerEn: "Category", width: "110px", render: (r) => <span className="badge badge-ink">{r.category}</span> },
  { headerAr: "الترتيب", headerEn: "Order", width: "70px", render: (r) => <span style={{ opacity: .7 }}>{r.sort_order}</span> },
  { headerAr: "النشر",  headerEn: "Status", width: "90px", render: (r) => r.is_published ? <span className="badge badge-green">Live</span> : <span className="badge badge-gold">Draft</span> },
];

export const boardFields: FieldConfig[] = [
  { key: "name_en",      labelAr: "الاسم (إنجليزي)",  labelEn: "Name (English)",   type: "text", required: true },
  { key: "name_ar",      labelAr: "الاسم (عربي)",     labelEn: "Name (Arabic)",    type: "text", required: true },
  { key: "role_en",      labelAr: "الصفة (إنجليزي)",  labelEn: "Role (English)",   type: "text" },
  { key: "role_ar",      labelAr: "الصفة (عربي)",     labelEn: "Role (Arabic)",    type: "text" },
  { key: "honorific_en", labelAr: "اللقب (إنجليزي)",  labelEn: "Honorific (English)", type: "text", placeholder: "H.E. (optional)" },
  { key: "honorific_ar", labelAr: "اللقب (عربي)",     labelEn: "Honorific (Arabic)",  type: "text", placeholder: "سعادة (optional)" },
  { key: "photo",        labelAr: "رابط الصورة",       labelEn: "Photo path/URL",   type: "text", placeholder: "/images/board/name.jpg" },
  { key: "category",     labelAr: "الفئة",            labelEn: "Category",         type: "select", required: true, defaultValue: "member", options: [
    { value: "chair",     labelEn: "Chairperson" },
    { value: "secretary", labelEn: "Secretary General" },
    { value: "member",    labelEn: "Board Member" },
    { value: "executive", labelEn: "Executive Director" },
  ]},
  { key: "sort_order",   labelAr: "الترتيب",           labelEn: "Sort Order",       type: "number", placeholder: "0", defaultValue: "0" },
  { key: "is_published", labelAr: "نشر علناً",         labelEn: "Published",        type: "boolean", defaultValue: "true", placeholder: "Visible on public site" },
];

// ─── Partners ────────────────────────────────────────────────────────────────
export interface PartnerRow { id: string; name_ar: string; name_en: string; url: string | null; sort_order: number; is_published: boolean; created_at: string }

export const partnerColumns: ColumnConfig<PartnerRow>[] = [
  { headerAr: "الشريك", headerEn: "Partner", render: (r) => (
    <div>
      <div style={{ fontWeight: 600, color: "#141414" }}>{r.name_en}</div>
      <div style={{ fontSize: ".78rem", opacity: .55, marginTop: 2 }}>{r.name_ar}</div>
    </div>
  )},
  { headerAr: "الرابط", headerEn: "Link", render: (r) => dim(r.url) },
  { headerAr: "الترتيب", headerEn: "Order", width: "70px", render: (r) => <span style={{ opacity: .7 }}>{r.sort_order}</span> },
  { headerAr: "النشر",  headerEn: "Status", width: "90px", render: (r) => r.is_published ? <span className="badge badge-green">Live</span> : <span className="badge badge-gold">Draft</span> },
];

export const partnerFields: FieldConfig[] = [
  { key: "name_en",      labelAr: "الاسم (إنجليزي)", labelEn: "Name (English)", type: "text", required: true },
  { key: "name_ar",      labelAr: "الاسم (عربي)",    labelEn: "Name (Arabic)",  type: "text", required: true },
  { key: "url",          labelAr: "رابط (اختياري)",  labelEn: "URL (optional)", type: "url",  placeholder: "https://…" },
  { key: "sort_order",   labelAr: "الترتيب",          labelEn: "Sort Order",     type: "number", placeholder: "0", defaultValue: "0" },
  { key: "is_published", labelAr: "نشر علناً",        labelEn: "Published",      type: "boolean", defaultValue: "true", placeholder: "Visible on public site" },
];

// ─── Stats ───────────────────────────────────────────────────────────────────
export interface StatRow { id: string; value: number; prefix: string | null; suffix: string | null; grouped: boolean; label_ar: string; label_en: string; accent: string | null; sort_order: number; is_published: boolean; created_at: string }

export const statColumns: ColumnConfig<StatRow>[] = [
  { headerAr: "القيمة", headerEn: "Value", width: "110px", render: (r) => <b>{(r.prefix ?? "") + (r.grouped ? r.value.toLocaleString() : r.value) + (r.suffix ?? "")}</b> },
  { headerAr: "التسمية", headerEn: "Label", render: (r) => (
    <div>
      <div style={{ fontWeight: 600, color: "#141414" }}>{r.label_en}</div>
      <div style={{ fontSize: ".78rem", opacity: .55, marginTop: 2 }}>{r.label_ar}</div>
    </div>
  )},
  { headerAr: "اللون", headerEn: "Accent", width: "90px", render: (r) => r.accent ? <span className={`badge ${r.accent === "red" ? "badge-red" : "badge-green"}`}>{r.accent}</span> : dim(null) },
  { headerAr: "الترتيب", headerEn: "Order", width: "70px", render: (r) => <span style={{ opacity: .7 }}>{r.sort_order}</span> },
  { headerAr: "النشر",  headerEn: "Status", width: "90px", render: (r) => r.is_published ? <span className="badge badge-green">Live</span> : <span className="badge badge-gold">Draft</span> },
];

export const statFields: FieldConfig[] = [
  { key: "value",        labelAr: "القيمة",           labelEn: "Value",          type: "number", required: true, placeholder: "180" },
  { key: "prefix",       labelAr: "بادئة",            labelEn: "Prefix",         type: "text",   placeholder: "e.g. $ (optional)" },
  { key: "suffix",       labelAr: "لاحقة",            labelEn: "Suffix",         type: "text",   placeholder: "e.g. + (optional)" },
  { key: "grouped",      labelAr: "فواصل الآلاف",     labelEn: "Group thousands", type: "boolean", defaultValue: "false", placeholder: "2,150 vs 2150" },
  { key: "label_en",     labelAr: "التسمية (إنجليزي)", labelEn: "Label (English)", type: "text", required: true },
  { key: "label_ar",     labelAr: "التسمية (عربي)",    labelEn: "Label (Arabic)",  type: "text", required: true },
  { key: "accent",       labelAr: "اللون المؤسسي",     labelEn: "Accent",         type: "select", defaultValue: "", options: [
    { value: "",      labelEn: "None (ink)" },
    { value: "green", labelEn: "Green" },
    { value: "red",   labelEn: "Red" },
  ]},
  { key: "sort_order",   labelAr: "الترتيب",           labelEn: "Sort Order",     type: "number", placeholder: "0", defaultValue: "0" },
  { key: "is_published", labelAr: "نشر علناً",         labelEn: "Published",      type: "boolean", defaultValue: "true", placeholder: "Visible on public site" },
];

// ─── Branches (migration 0016) ───────────────────────────────────────────────
export interface BranchRow { id: string; slug: string; name: string; governorate: string | null; address: string | null; phone: string | null; is_active: boolean; sort_order: number; created_at: string }

export const branchColumns: ColumnConfig<BranchRow>[] = [
  { headerAr: "الاسم",     headerEn: "Name",     render: (r) => <b>{r.name}</b> },
  { headerAr: "الإمارة",   headerEn: "Emirate",  render: (r) => r.governorate ?? dim(null) },
  { headerAr: "الهاتف",    headerEn: "Phone",    width: "150px", render: (r) => r.phone ?? dim(null) },
  { headerAr: "الترتيب",   headerEn: "Order",    width: "70px",  render: (r) => <span style={{ opacity: .7 }}>{r.sort_order}</span> },
  { headerAr: "الحالة",    headerEn: "Status",   width: "90px",  render: (r) => r.is_active ? <span className="badge badge-green">Active</span> : <span className="badge badge-gold">Hidden</span> },
];

export const branchFields: FieldConfig[] = [
  { key: "name",        labelAr: "الاسم",          labelEn: "Name",        type: "text",    required: true },
  { key: "slug",        labelAr: "المعرّف",         labelEn: "Slug",        type: "text",    required: true, placeholder: "e.g. al-majaz" },
  { key: "governorate", labelAr: "الإمارة",         labelEn: "Emirate",     type: "text",    placeholder: "e.g. Sharjah" },
  { key: "address",     labelAr: "العنوان",         labelEn: "Address",     type: "text" },
  { key: "phone",       labelAr: "الهاتف",          labelEn: "Phone",       type: "text",    placeholder: "+971 …" },
  { key: "sort_order",  labelAr: "الترتيب",         labelEn: "Sort Order",  type: "number",  defaultValue: "0" },
  { key: "is_active",   labelAr: "نشِط",            labelEn: "Active",      type: "boolean", defaultValue: "true" },
];

// ─── Classes (migration 0016) ────────────────────────────────────────────────
export interface ClassRow { id: string; title: string; level: string | null; format: string; capacity: number | null; fee_minor: number | null; currency: string; is_active: boolean; branch_id: string | null; primary_coach_id: string | null; created_at: string }

export const classColumns: ColumnConfig<ClassRow>[] = [
  { headerAr: "العنوان",  headerEn: "Title",    render: (r) => <b>{r.title}</b> },
  { headerAr: "المستوى",  headerEn: "Level",    width: "120px", render: (r) => r.level ? <span className="badge badge-green">{r.level}</span> : dim(null) },
  { headerAr: "الصيغة",   headerEn: "Format",   width: "120px", render: (r) => r.format },
  { headerAr: "السعة",    headerEn: "Capacity", width: "90px",  render: (r) => r.capacity ?? dim(null) },
  { headerAr: "الحالة",   headerEn: "Status",   width: "90px",  render: (r) => r.is_active ? <span className="badge badge-green">Active</span> : <span className="badge badge-gold">Hidden</span> },
];

export const classFields: FieldConfig[] = [
  { key: "title",            labelAr: "العنوان",         labelEn: "Title",        type: "text",     required: true },
  { key: "description",      labelAr: "الوصف",           labelEn: "Description",  type: "textarea" },
  { key: "format",           labelAr: "الصيغة",          labelEn: "Format",       type: "select",   defaultValue: "in_person", options: [
    { value: "in_person", labelEn: "In person" },
    { value: "online",    labelEn: "Online" },
    { value: "hybrid",    labelEn: "Hybrid" },
  ]},
  { key: "level",            labelAr: "المستوى",         labelEn: "Level",        type: "select",   defaultValue: "", options: [
    { value: "",             labelEn: "—" },
    { value: "beginner",     labelEn: "Beginner" },
    { value: "intermediate", labelEn: "Intermediate" },
    { value: "advanced",     labelEn: "Advanced" },
    { value: "elite",        labelEn: "Elite" },
  ]},
  { key: "capacity",         labelAr: "السعة",           labelEn: "Capacity",     type: "number",   placeholder: "e.g. 12" },
  { key: "fee_minor",        labelAr: "الرسوم (فلس)",     labelEn: "Fee (minor)",  type: "number",   placeholder: "AED in fils, e.g. 50000 = 500 AED" },
  { key: "currency",         labelAr: "العملة",          labelEn: "Currency",     type: "text",     defaultValue: "AED" },
  { key: "branch_id",        labelAr: "الفرع (معرّف)",    labelEn: "Branch ID",    type: "text",     placeholder: "Optional — branch UUID" },
  { key: "primary_coach_id", labelAr: "المدرّبة (معرّف)", labelEn: "Coach ID",     type: "text",     placeholder: "Optional — coach UUID" },
  { key: "is_active",        labelAr: "نشِط",            labelEn: "Active",       type: "boolean",  defaultValue: "true" },
];

