import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl &&
    serviceRoleKey &&
    supabaseUrl.startsWith("https://") &&
    !supabaseUrl.includes("your-project")
);

// Klien admin untuk API routes. Service role hanya hidup di server:
// jangan pernah mengimpor modul ini dari komponen client.
export const adminSupabase: SupabaseClient | null = isServerSupabaseConfigured
  ? createClient(supabaseUrl!, serviceRoleKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;
