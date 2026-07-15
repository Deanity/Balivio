import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

// Initialize Supabase Client with service-role key for backend operations
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
