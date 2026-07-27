import { createClient } from '@supabase/supabase-js';
import { env } from './env';

const supabaseUrl = (env.SUPABASE_URL && env.SUPABASE_URL.startsWith('http'))
  ? env.SUPABASE_URL
  : 'https://placeholder.supabase.co';

const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

/**
 * Admin client uses service-role key.
 * Full DB access, bypasses Row Level Security.
 * NEVER expose this to the client.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
