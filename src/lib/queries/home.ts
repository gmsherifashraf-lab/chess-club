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
