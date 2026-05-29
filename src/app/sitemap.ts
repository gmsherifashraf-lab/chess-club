import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n";

const SITE = "https://project-oimbc.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: {
    path: string;
    freq: "weekly" | "monthly";
    priority: number;
  }[] = [
    { path: "",             freq: "monthly", priority: 1.0 },
    { path: "/about",       freq: "monthly", priority: 0.8 },
    { path: "/news",        freq: "weekly",  priority: 0.7 },
    { path: "/tournaments", freq: "weekly",  priority: 0.7 },
    { path: "/gallery",     freq: "monthly", priority: 0.6 },
    { path: "/register",    freq: "monthly", priority: 0.6 },
  ];

  // Every public page exists in both locales; each entry advertises its
  // sibling via hreflang alternates.
  return routes.flatMap((r) =>
    LOCALES.map((locale) => ({
      url: `${SITE}/${locale}${r.path}`,
      lastModified: now,
      changeFrequency: r.freq,
      priority: r.priority,
      alternates: {
        languages: {
          "en-AE": `${SITE}/en${r.path}`,
          "ar-AE": `${SITE}/ar${r.path}`,
        },
      },
    })),
  );
}
