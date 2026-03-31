import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase credentials: " +
        `NEXT_PUBLIC_SUPABASE_URL=${!url ? "undefined" : "set"}, ` +
        `SUPABASE_SERVICE_ROLE_KEY=${!key ? "undefined" : "set"}`
    );
  }

  return createClient(url, key);
}
