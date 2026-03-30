import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url) throw new Error("Missing SUPABASE_URL");
  if (!key) throw new Error("Missing SUPABASE_SERVICE_KEY");
  _client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _client;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export async function uploadToStorage(
  bucket: string,
  path: string,
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  const client = getSupabase();
  const { error } = await client.storage
    .from(bucket)
    .upload(path, buffer, { contentType: mimeType, upsert: false });
  if (error) throw new Error(`Supabase Storage upload failed: ${error.message}`);
  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
