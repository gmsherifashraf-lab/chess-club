"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LangContext";
import { LOGO_URI } from "@/lib/logo";

export interface NavItem {
  key:     string;
  icon:    string;
  ar:      string;
  en:      string;
}

interface Props {
  roleAr:      string;
  roleEn:      string;
  roleColor:   string;
  userInitial: string;
  navItems:    NavItem[];
  activeTab:   string;
  onTab:       (key: string) => void;
  children:    React.ReactNode;
}

export default function DashboardShell({
  roleAr, roleEn, roleColor,
  userInitial, navItems,
  activeTab, onTab,
  children,
}: Props) {
  const { user, signOut } = useAuth();
  const { lang, dir }     = useLang();
  const [sbOpen, setSbOpen] = useState(false);

  const displayName =
    user?.user_metadata?.full_name?.split("—")[0]?.trim() ??
    (lang === "ar" ? "المستخدم" : "User");

  const currentLabel = navItems.find(n => n.key === activeTab);

  return (
    <div className="dash-wrap">
      {/* ── Overlay (mobile) ── */}
      {sbOpen && (
        <div
          className="dash-ovl on"
          onClick={() => setSbOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`dash-sb${sbOpen ? " open" : ""}`}>
        {/* Logo + role badge */}
        <div style={{ padding: "1.25rem 1rem", borderBottom: "1px solid rgba(248,245,240,.07)" }}>
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", gap: ".65rem", marginBottom: ".85rem", textDecoration: "none" }}
          >
            <img
              src={LOGO_URI}
              alt="Logo"
              style={{ height: 36, width: "auto", background: "rgba(255,255,255,.9)", padding: 2, borderRadius: 2 }}
            />
            <span
              className="font-disp"
              style={{ fontSize: ".78rem", color: "#F8F5F0", lineHeight: 1.3 }}
            >
              <span className="ar">نادي الشطرنج</span>
              <span className="en">Chess Club</span>
            </span>
          </Link>

          {/* Role pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: ".22rem .6rem", background: `${roleColor}22` }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: roleColor }} />
            <span style={{ fontSize: ".55rem", letterSpacing: ".12em", textTransform: "uppercase", color: roleColor, fontFamily: "'Noto Sans Arabic','DM Sans',sans-serif" }}>
              <span className="ar">{roleAr}</span>
              <span className="en">{roleEn}</span>
            </span>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: ".5rem 0", overflowY: "auto" }}>
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { onTab(item.key); setSbOpen(false); }}
              className={`sb-nav-btn${activeTab === item.key ? " active" : ""}`}
            >
              <span style={{ fontSize: ".9rem" }}>{item.icon}</span>
              <span className="ar">{item.ar}</span>
              <span className="en">{item.en}</span>
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div style={{ padding: "1rem", borderTop: "1px solid rgba(248,245,240,.07)", display: "flex", alignItems: "center", gap: ".75rem" }}>
          <div
            style={{ width: 32, height: 32, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".75rem", fontWeight: 700, color: "#fff", background: roleColor }}
          >
            {userInitial}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: ".8rem", color: "#F8F5F0", fontFamily: "'Noto Serif Arabic',var(--font-playfair),serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {displayName}
            </div>
            <div style={{ fontSize: ".6rem", color: "rgba(248,245,240,.28)", marginTop: 2, fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.email}
            </div>
          </div>
          <button
            onClick={signOut}
            style={{ fontSize: ".62rem", color: "rgba(248,245,240,.28)", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", flexShrink: 0 }}
          >
            <span className="ar">خروج</span>
            <span className="en">Exit</span>
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="dash-main">
        {/* Top bar */}
        <div className="dash-top">
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
            {/* Hamburger — shown on small screens */}
            <button
              onClick={() => setSbOpen(true)}
              style={{ display: "flex", flexDirection: "column", gap: 4, padding: 4, background: "none", border: "none", cursor: "pointer" }}
              className="lg:hidden"
              aria-label="Open sidebar"
            >
              <span style={{ display: "block", width: 20, height: 1.5, background: "#141414" }} />
              <span style={{ display: "block", width: 20, height: 1.5, background: "#141414" }} />
              <span style={{ display: "block", width: 20, height: 1.5, background: "#141414" }} />
            </button>

            {/* Current page title */}
            {currentLabel && (
              <h2 className="font-disp" style={{ fontSize: "1rem", color: "#141414" }}>
                <span className="ar">{currentLabel.ar}</span>
                <span className="en">{currentLabel.en}</span>
              </h2>
            )}
          </div>

          {/* Avatar */}
          <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".75rem", fontWeight: 700, color: "#fff", background: roleColor, cursor: "default" }}>
            {userInitial}
          </div>
        </div>

        {/* Page content */}
        <div className="dash-content">{children}</div>
      </div>
    </div>
  );
}
