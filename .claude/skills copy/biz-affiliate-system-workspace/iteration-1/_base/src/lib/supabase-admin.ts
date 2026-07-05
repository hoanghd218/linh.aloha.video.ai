import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// service_role client — bypass RLS. KHÔNG bao giờ expose ra client/browser.
let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error(
        "Supabase chưa cấu hình. Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY trong .env.local",
      );
    }
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
