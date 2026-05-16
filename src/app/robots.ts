import type { MetadataRoute } from "next";

const SITE = "https://project-oimbc.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/login", "/api", "/auth"],
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
