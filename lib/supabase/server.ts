import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

/**
 * Creates a server-side Supabase client.
 * For administrative write operations, set useServiceRole to true to bypass RLS policies.
 * For public read operations, use false (uses the anon key).
 */
export const createServerSupabase = (useServiceRole = false) => {
  const key = useServiceRole 
    ? (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
  if (!supabaseUrl || !key) {
    console.warn("Supabase URL or Key is missing on the server-side environment.");
  }
    
  return createClient(supabaseUrl, key || "");
};
