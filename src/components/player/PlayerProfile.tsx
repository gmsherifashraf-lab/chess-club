"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

export default function PlayerProfile() {
  const supabase = createClient();
  const { profile, refreshProfile } = useAuth();

  const [fullName,  setFullName]  = useState("");
  const [bio,       setBio]       = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving,    setSaving]    = useState(false);
  const [savedAt,   setSavedAt]   = useState<number | null>(null);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setBio(profile.bio ?? "");
      setAvatarUrl(profile.avatar_url ?? "");
    }
  }, [profile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);
    setSavedAt(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name:  fullName.trim() || null,
        bio:        bio.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      })
      .eq("id", profile.id);

    setSaving(false);
    if (error) { setError(error.message); return; }
    setSavedAt(Date.now());
    refreshProfile();
  }

  if (!profile) {
    return <div className="empty"><div className="empty-ic">…</div></div>;
  }

  return (
    <form onSubmit={handleSave} className="panel" style={{ maxWidth: 640 }}>
      <div className="panel-hd">
        <div className="panel-ttl">
          <span className="ar">ملفي الشخصي</span>
          <span className="en">My Profile</span>
        </div>
      </div>

      <div className="panel-pad" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {error && (
          <div style={{ background: "rgba(212,43,60,.08)", border: "1px solid rgba(212,43,60,.25)", padding: ".7rem 1rem", fontSize: ".82rem", color: "#B02030" }}>
            {error}
          </div>
        )}
        {savedAt && (
          <div style={{ background: "rgba(0,122,56,.08)", border: "1px solid rgba(0,122,56,.25)", padding: ".7rem 1rem", fontSize: ".82rem", color: "#007A38" }}>
            <span className="ar">تم الحفظ ✓</span>
            <span className="en">Saved ✓</span>
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ width: 64, height: 64, background: avatarUrl ? "transparent" : "#141414", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", fontWeight: 700, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
            {avatarUrl ? <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : ((fullName || profile.email || "?").charAt(0).toUpperCase())}
          </div>
          <div style={{ fontSize: ".85rem" }}>
            <div style={{ color: "#141414", fontWeight: 600 }}>{profile.email}</div>
            <div style={{ color: "#666", fontSize: ".75rem", marginTop: 3, textTransform: "uppercase", letterSpacing: ".12em" }}>{profile.role}</div>
          </div>
        </div>

        <div>
          <label className="form-lbl"><span className="ar">الاسم الكامل</span><span className="en">Full Name</span></label>
          <input className="form-inp" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={saving} />
        </div>

        <div>
          <label className="form-lbl"><span className="ar">رابط الصورة</span><span className="en">Avatar URL</span></label>
          <input className="form-inp" type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} disabled={saving} placeholder="https://…" />
        </div>

        <div>
          <label className="form-lbl"><span className="ar">نبذة عنك</span><span className="en">Bio</span></label>
          <textarea className="form-inp" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} disabled={saving} />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: ".5rem" }}>
          <button type="submit" disabled={saving} className="btn btn-primary btn-sm" style={{ opacity: saving ? .7 : 1 }}>
            <span className="ar">{saving ? "جاري الحفظ…" : "حفظ التغييرات"}</span>
            <span className="en">{saving ? "Saving…"      : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
