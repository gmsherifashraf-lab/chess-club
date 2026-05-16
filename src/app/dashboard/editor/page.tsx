"use client";

import { useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/context/AuthContext";
import { ROLE_NAV } from "@/lib/rbac";
import { ROLE_COLOR, ROLE_LABEL } from "@/lib/auth";
import CrudShell from "@/components/admin/CrudShell";
import EnrollmentsList from "@/components/admin/EnrollmentsList";
import {
  newsColumns,
  newsFields,
  type NewsRow,
  galleryColumns,
  galleryFields,
  type GalleryRow,
} from "@/components/admin/configs";

export default function EditorDashboard() {
  const { loading } = useRequireAuth("editor");
  const { profile } = useAuth();
  const [tab, setTab] = useState("overview");

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100 text-3xl text-text-4">
        ♟
      </div>
    );

  const name = profile?.full_name ?? profile?.email ?? "Editor";
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <DashboardShell
      roleAr={ROLE_LABEL.editor.ar}
      roleEn={ROLE_LABEL.editor.en}
      roleColor={ROLE_COLOR.editor}
      userInitial={initial}
      navItems={ROLE_NAV.editor}
      activeTab={tab}
      onTab={setTab}
    >
      {tab === "overview" && (
        <div className="rounded-[4px] border border-line bg-white p-8 shadow-card sm:p-10">
          <div className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-forest-700">
            <span className="ar">منطقة المحرّرة</span>
            <span className="en">Editor Workspace</span>
          </div>
          <h2 className="mt-3 font-disp text-2xl font-bold text-text-1">
            <span className="ar">أهلاً، {name}</span>
            <span className="en">Welcome, {name}</span>
          </h2>
          <p className="mt-2 max-w-lg text-[0.95rem] leading-relaxed text-text-3">
            <span className="ar">
              تحرير الأخبار والمعرض، والاطّلاع على طلبات الانضمام. لا تملكين
              صلاحية إدارة المستخدمين.
            </span>
            <span className="en">
              Manage news and the gallery, and review join requests. You
              cannot manage users or permissions.
            </span>
          </p>
        </div>
      )}

      {tab === "news" && (
        <CrudShell<NewsRow>
          table="news"
          titleAr="إدارة الأخبار"
          titleEn="News &amp; Announcements"
          addLabelAr="+ مقال جديد"
          addLabelEn="+ New Article"
          columns={newsColumns}
          fields={newsFields}
          orderBy={{ column: "published_at", ascending: false }}
        />
      )}

      {tab === "gallery" && (
        <CrudShell<GalleryRow>
          table="gallery_images"
          titleAr="إدارة معرض الصور"
          titleEn="Gallery"
          addLabelAr="+ صورة جديدة"
          addLabelEn="+ Add Image"
          columns={galleryColumns}
          fields={galleryFields}
          orderBy={{ column: "sort_order", ascending: true }}
        />
      )}

      {tab === "joinRequests" && <EnrollmentsList />}
    </DashboardShell>
  );
}
