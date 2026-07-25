import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { env } from './env';

/**
 * Admin client uses service-role key.
 * Full DB access, bypasses Row Level Security.
 * NEVER expose this to the client.
 *
 * Uses `ws` package as WebSocket transport for Node.js < 22 compatibility.
 */
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    realtime: {
      // ws is compatible at runtime; cast needed due to type mismatch between
      // ws@8 constructor signature and Supabase's WebSocketLikeConstructor
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transport: ws as unknown as any,
    },
  }
);
