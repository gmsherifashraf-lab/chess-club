import type { Metadata } from "next";
import { Inter, Playfair_Display, Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/context/LangContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "نادي الشطرنج والثقافة للفتيات بالشارقة | Chess & Culture Club Sharjah",
  description:
    "نادٍ رائد في الشارقة يُعنى بتطوير مهارات الشطرنج والثقافة للفتيات منذ 2017. " +
    "Premier chess and culture club developing girls in Sharjah, UAE since 2017.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${cairo.variable} ${tajawal.variable}`}>
        {/*
         * AuthProvider must wrap everything so any component can call useAuth().
         * LangProvider is nested inside so its dir/lang attributes only affect
         * the inner div, not the <html> element (which AuthProvider manages
         * indirectly via middleware redirects).
         *
         * Note: LangContext manages html[dir] via useEffect, so the html element
         * starts as dir="rtl" (server default) and updates client-side on toggle.
         */}
        <AuthProvider>
          <LangProvider>{children}</LangProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
