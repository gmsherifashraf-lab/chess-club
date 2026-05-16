import type { MetadataRoute } from "next";

const SITE = "https://project-oimbc.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; freq: "weekly" | "monthly"; priority: number }[] = [
    { path: "",             freq: "monthly", priority: 1.0 },
    { path: "/about",       freq: "monthly", priority: 0.8 },
    { path: "/news",        freq: "weekly",  priority: 0.7 },
    { path: "/tournaments", freq: "weekly",  priority: 0.7 },
    { path: "/register",    freq: "monthly", priority: 0.6 },
  ];
  return routes.map((r) => ({
    url: `${SITE}${r.path || "/"}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
