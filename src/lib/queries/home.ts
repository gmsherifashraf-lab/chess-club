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
