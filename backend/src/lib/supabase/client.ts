import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { fetchWithTimeout } from '../fetchWithTimeout';

let supabaseAnonClient: SupabaseClient | null = null;

export function getSupabaseAnonClient(): SupabaseClient | null {
  if (supabaseAnonClient) {
    return supabaseAnonClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return null;
  }

  supabaseAnonClient = createClient(supabaseUrl, anonKey, {
    global: {
      fetch: fetchWithTimeout,
    },
  });
  return supabaseAnonClient;
}
