import { createClient } from "@supabase/supabase-js";

export function createPublicServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase public credentials: " +
        `NEXT_PUBLIC_SUPABASE_URL=${!url ? "undefined" : "set"}, ` +
        `NEXT_PUBLIC_SUPABASE_ANON_KEY=${!key ? "undefined" : "set"}`
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
