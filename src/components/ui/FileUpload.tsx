"use client";

import { useRef, useState } from "react";
import { uploadFile, type UploadBucket } from "@/lib/supabase/storage";

/**
 * Bilingual file-upload field. Uploads to a Storage bucket on pick and
 * reports the resulting public URL via onChange. Shows progress, the
 * current file as a link, and a remove action.
 */
export default function FileUpload({
  bucket,
  value,
  onChange,
  disabled,
}: {
  bucket: UploadBucket;
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr]   = useState<string | null>(null);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      const url = await uploadFile(bucket, file);
      onChange(url);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
      <input
        ref={inputRef}
        type="file"
        onChange={pick}
        disabled={disabled || busy}
        style={{ fontSize: ".82rem" }}
      />
      {busy && (
        <span style={{ fontSize: ".75rem", opacity: 0.6 }}>
          <span className="ar">جاري الرفع…</span>
          <span className="en">Uploading…</span>
        </span>
      )}
      {value && !busy && (
        <div style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".8rem" }}>
          <a href={value} target="_blank" rel="noopener" style={{ color: "#1E5BAA" }}>
            📎 <span className="ar">الملف المرفوع</span><span className="en">Uploaded file</span>
          </a>
          {!disabled && (
            <button
              type="button"
              onClick={() => onChange(null)}
              style={{ border: "none", background: "none", color: "#B02030", cursor: "pointer", fontSize: ".75rem", padding: 0 }}
            >
              <span className="ar">إزالة</span><span className="en">Remove</span>
            </button>
          )}
        </div>
      )}
      {err && <span style={{ fontSize: ".75rem", color: "#B02030" }}>{err}</span>}
    </div>
  );
}
