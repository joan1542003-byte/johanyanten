import { createClient } from "@supabase/supabase-js";

// Public values: safe to ship to the browser. Row Level Security protects the data.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://hxcvuhrsbeqakgzohyhx.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_ufwmyDHePC_RWYXWjzDIkA_Nwlbgu2d";

export const MEDIA_BUCKET = "media";

// Stateless client for server-side reads of public content
export function createPublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Client acting as a signed-in user, for verifying requests from the admin panel
export function createUserClient(accessToken: string) {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}
