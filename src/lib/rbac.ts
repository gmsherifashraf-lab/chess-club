import type { UserRole } from "@/lib/auth";

/**
 * Central role → permission matrix. The DB (RLS) is the real security
 * boundary; this mirror drives UI gating (hiding actions a role cannot
 * perform) and the sidebar. Keep the two in sync with 0008_multirole_rbac.
 */
export type Permission =
  | "users.manage"        // create/edit/delete accounts (ADMIN only)
  | "roles.assign"        // assign roles, link parent/coach (ADMIN only)
  | "analytics.view"
  | "gallery.manage"
  | "news.manage"
  | "joinRequests.view"
  | "players.manage"      // coach: their linked players
  | "assignments.manage"  // coach: create/grade tasks
  | "attendance.manage"
  | "evaluations.manage"
  | "material.upload"
  | "assignments.solve"   // player
  | "submissions.create"  // player
  | "progress.viewOwn"    // player
  | "child.monitor";      // parent: read-only child view

const MATRIX: Record<UserRole, Permission[]> = {
  admin: [
    "users.manage", "roles.assign", "analytics.view", "gallery.manage",
    "news.manage", "joinRequests.view", "players.manage",
    "assignments.manage", "attendance.manage", "evaluations.manage",
    "material.upload",
  ],
  editor: ["gallery.manage", "news.manage", "joinRequests.view"],
  coach: [
    "players.manage", "assignments.manage", "attendance.manage",
    "evaluations.manage", "material.upload",
  ],
  player: ["assignments.solve", "submissions.create", "progress.viewOwn"],
  parent: ["child.monitor"],
};

export function can(role: UserRole | null | undefined, perm: Permission): boolean {
  if (!role) return false;
  return MATRIX[role]?.includes(perm) ?? false;
}

export function permissionsFor(role: UserRole): Permission[] {
  return MATRIX[role] ?? [];
}

/** Sidebar navigation, per role. `key` maps to a dashboard tab. */
export interface RoleNavItem {
  key: string;
  icon: string;
  ar: string;
  en: string;
}

export const ROLE_NAV: Record<UserRole, RoleNavItem[]> = {
  admin: [
    { key: "overview",     icon: "⊞",  ar: "نظرة عامة",     en: "Overview" },
    { key: "users",        icon: "👥", ar: "المستخدمون",    en: "Users" },
    { key: "coaches",      icon: "🎯", ar: "المدربات",      en: "Coaches" },
    { key: "links",        icon: "🔗", ar: "الربط",         en: "Links" },
    { key: "assignments",  icon: "📝", ar: "المهام",        en: "Assignments" },
    { key: "submissions",  icon: "📥", ar: "التسليمات",     en: "Submissions" },
    { key: "tournaments",  icon: "♟", ar: "البطولات",      en: "Tournaments" },
    { key: "gallery",      icon: "🖼", ar: "المعرض",        en: "Gallery" },
    { key: "joinRequests", icon: "📨", ar: "طلبات الانضمام", en: "Join Requests" },
    { key: "analytics",    icon: "📊", ar: "التحليلات",     en: "Analytics" },
  ],
  editor: [
    { key: "overview",     icon: "⊞",  ar: "نظرة عامة",     en: "Overview" },
    { key: "news",         icon: "📰", ar: "الأخبار",       en: "News" },
    { key: "gallery",      icon: "🖼", ar: "المعرض",        en: "Gallery" },
    { key: "joinRequests", icon: "📨", ar: "طلبات الانضمام", en: "Join Requests" },
  ],
  coach: [
    { key: "overview",    icon: "⊞",  ar: "نظرة عامة",   en: "Overview" },
    { key: "players",     icon: "👥", ar: "لاعباتي",     en: "My Players" },
    { key: "assignments", icon: "📝", ar: "المهام",      en: "Assignments" },
    { key: "submissions", icon: "📥", ar: "التسليمات",   en: "Submissions" },
    { key: "attendance",  icon: "📅", ar: "الحضور",      en: "Attendance" },
    { key: "material",    icon: "📚", ar: "المواد",      en: "Material" },
  ],
  player: [
    { key: "overview", icon: "⊞",  ar: "نظرة عامة",     en: "Overview" },
    { key: "tasks",    icon: "📝", ar: "مهامي",          en: "My Tasks" },
    { key: "play",     icon: "♟",  ar: "اللعب والتدريب", en: "Play & Train" },
    { key: "history",  icon: "📚", ar: "السجل",          en: "History" },
    { key: "profile",  icon: "👤", ar: "ملفي",           en: "Profile" },
  ],
  parent: [
    { key: "overview",    icon: "⊞",  ar: "نظرة عامة",   en: "Overview" },
    { key: "assignments", icon: "📝", ar: "المهام",      en: "Assignments" },
    { key: "attendance",  icon: "📅", ar: "الحضور",      en: "Attendance" },
    { key: "progress",    icon: "📈", ar: "التقدّم",     en: "Progress" },
    { key: "notes",       icon: "🗒", ar: "ملاحظات المدرّبة", en: "Coach Notes" },
  ],
};
