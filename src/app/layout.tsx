import type { Metadata } from "next";
import { IBM_Plex_Sans, Cairo } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { LangProvider } from "@/context/LangContext";
import { AuthProvider } from "@/context/AuthContext";
import { isLocale, dirOf, DEFAULT_LOCALE } from "@/lib/i18n";

/**
 * Federation type system.
 *   Latin  → IBM Plex Sans  (UI, body, and display via weight contrast)
 *   Arabic → Cairo          (co-primary, true bilingual parity)
 *
 * The legacy CSS-variable names (--font-inter / --font-playfair /
 * --font-cairo / --font-tajawal) are intentionally reused so the ~115
 * existing references across the codebase keep resolving with no churn.
 * They now point at the federation fonts, not the old serif/Inter pair.
 */
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const plexDisplay = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const cairoDisplay = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

const SITE_URL  = "https://project-oimbc.vercel.app";
const SITE_NAME = "Chess & Culture Club for Women — Sharjah";
const DESCRIPTION_AR =
  "نادي الشطرنج والثقافة للفتيات بالشارقة — مؤسسة رائدة منذ 1991 في تطوير لاعبات الشطرنج الإماراتيات وتمكين الفتيات من خلال الرياضة والثقافة والقيادة.";
const DESCRIPTION_EN =
  "Chess & Culture Club for Women, Sharjah — a leading UAE institution since 1991 developing female chess champions and empowering girls through sport, culture, and leadership.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | نادي الشطرنج والثقافة للفتيات بالشارقة`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `${DESCRIPTION_EN} ${DESCRIPTION_AR}`,
  keywords: [
    "Chess Club", "Sharjah", "UAE", "Women Chess", "Girls Chess",
    "Ladies Chess Club", "نادي الشطرنج", "الشارقة", "الإمارات",
    "Chess and Culture", "Chess Championship UAE", "Women Empowerment",
  ],
  authors: [{ name: "Chess & Culture Club for Women, Sharjah" }],
  creator: "Chess & Culture Club for Women, Sharjah",
  publisher: "Chess & Culture Club for Women, Sharjah",
  category: "Sports & Culture",
  openGraph: {
    type: "website",
    locale: "en_AE",
    alternateLocale: ["ar_AE"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DESCRIPTION_EN,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DESCRIPTION_EN,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Locale is resolved by middleware and forwarded as `x-locale`, so the
  // direction is correct at server-render time — no client-side flip.
  const headerLocale = (await headers()).get("x-locale");
  const locale = isLocale(headerLocale) ? headerLocale : DEFAULT_LOCALE;

  return (
    <html lang={locale} dir={dirOf(locale)} suppressHydrationWarning>
      <body className={`${plex.variable} ${plexDisplay.variable} ${cairo.variable} ${cairoDisplay.variable}`}>
        <AuthProvider>
          <LangProvider lang={locale}>{children}</LangProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
