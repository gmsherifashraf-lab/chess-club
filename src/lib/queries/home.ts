import { createClient } from "@/lib/supabase/server";

export interface Tournament {
  id:          string | number;
  name:        string;
  date:        string | null;
  location:    string | null;
  description: string | null;
}

export interface NewsItem {
  id:           string | number;
  title:        string;
  category:     string | null;
  published_at: string | null;
  excerpt:      string | null;
  /**
   * CMS-ready optional fields. Not yet in the `news` select (adding a
   * non-existent column to .select() would fail the whole query). When
   * the columns exist, add them to getNews() below and the news
   * section will use them automatically.
   */
  image_url?:   string | null;
  slug?:        string | null;
}

export interface GalleryImage {
  id:          string;
  title_ar:    string;
  title_en:    string;
  subtitle_ar: string | null;
  subtitle_en: string | null;
  image_url:   string | null;
  emoji:       string | null;
  span:        "normal" | "wide" | "tall";
  accent:      "red" | "green" | "ink" | "gold";
  sort_order:  number;
}

export async function getTournaments(limit = 6): Promise<Tournament[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tournaments")
    .select("id, name, date, location, description")
    .order("date", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("getTournaments:", error.message);
    return [];
  }
  return (data ?? []) as Tournament[];
}

export async function getNews(limit = 3): Promise<NewsItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("id, title, category, published_at, excerpt")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getNews:", error.message);
    return [];
  }
  return (data ?? []) as NewsItem[];
}

export async function getGalleryImages(limit = 12): Promise<GalleryImage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_images")
    .select("id, title_ar, title_en, subtitle_ar, subtitle_en, image_url, emoji, span, accent, sort_order")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    // Table missing (migration not yet run) is non-fatal — the home
    // component falls back to its built-in placeholders.
    console.error("getGalleryImages:", error.message);
    return [];
  }
  return (data ?? []) as GalleryImage[];
}

// ── Board of Directors ──────────────────────────────────────────────────────
export interface BoardMember {
  ar: string;
  en: string;
  arRole: string;
  enRole: string;
  honorific?: { ar: string; en: string };
  photo?: string;
  category: "chair" | "secretary" | "member" | "executive";
}

export async function getBoardMembers(): Promise<BoardMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("board_members")
    .select("name_ar, name_en, role_ar, role_en, honorific_ar, honorific_en, photo, category, sort_order")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getBoardMembers:", error.message);
    return [];
  }
  return (data ?? []).map((r) => ({
    ar: r.name_ar,
    en: r.name_en,
    arRole: r.role_ar ?? "",
    enRole: r.role_en ?? "",
    honorific: r.honorific_ar && r.honorific_en
      ? { ar: r.honorific_ar, en: r.honorific_en }
      : undefined,
    photo: r.photo ?? undefined,
    category: r.category,
  })) as BoardMember[];
}

// ── Partners ────────────────────────────────────────────────────────────────
export interface Partner {
  ar: string;
  en: string;
  url?: string | null;
}

export async function getPartners(): Promise<Partner[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("partners")
    .select("ar:name_ar, en:name_en, url, sort_order")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getPartners:", error.message);
    return [];
  }
  return (data ?? []) as Partner[];
}

// ── Stats ───────────────────────────────────────────────────────────────────
export interface StatItem {
  to: number;
  prefix?: string | null;
  suffix?: string | null;
  group?: boolean;
  ar: string;
  en: string;
  accent?: "green" | "red" | null;
}

export async function getStats(): Promise<StatItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stats")
    .select("to:value, prefix, suffix, group:grouped, ar:label_ar, en:label_en, accent, sort_order")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getStats:", error.message);
    return [];
  }
  return (data ?? []) as StatItem[];
}
