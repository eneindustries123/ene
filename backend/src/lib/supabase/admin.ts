import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { fetchWithTimeout } from '../fetchWithTimeout';

let supabaseAdminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (supabaseAdminClient) {
    return supabaseAdminClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey, {
    global: {
      fetch: fetchWithTimeout,
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdminClient;
}

export function isSupabaseConfigured(): boolean {
  if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
    return false;
  }
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(supabaseUrl && serviceRoleKey);
}
