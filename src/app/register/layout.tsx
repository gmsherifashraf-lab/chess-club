import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register — Chess & Culture Club for Women, Sharjah",
  description:
    "Join the Chess & Culture Club for Women in Sharjah. Submit a membership request to the club founded in 1991.",
  alternates: { canonical: "/register" },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
