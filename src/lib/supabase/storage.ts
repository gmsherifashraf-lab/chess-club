import { createClient } from "@/lib/supabase/client";

export type UploadBucket = "submissions" | "training-material";

/**
 * Uploads a file to a public Storage bucket under a random, unguessable
 * key and returns its public URL (stored in submissions.file_url /
 * tasks.attachment_url, which the dashboards already render as links).
 *
 * Buckets are public-with-uuid-path: simple, and keeps the existing
 * read/display code unchanged. Acceptable for club coursework; can be
 * hardened to private + signed URLs later if needed.
 */
export async function uploadFile(bucket: UploadBucket, file: File): Promise<string> {
  const supabase = createClient();
  const dot = file.name.lastIndexOf(".");
  const ext = dot > -1 ? file.name.slice(dot + 1).toLowerCase() : "bin";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
