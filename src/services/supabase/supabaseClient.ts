import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../../config/env';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Safe Supabase client initializer using VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
 * If credentials are not provided or invalid, returns null and application gracefully
 * falls back to local prototype storage.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!config.isSupabaseConfigured || !config.supabaseUrl || !config.supabaseAnonKey) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.supabaseUrl, config.supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return supabaseInstance;
}

/**
 * Test Supabase connection health.
 */
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      ok: false,
      message: 'Supabase credentials not configured in .env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)',
    };
  }

  try {
    // Attempt a lightweight ping query
    const { error } = await client.from('services').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116' && !error.message.includes('relation "services" does not exist')) {
      // If table doesn't exist yet, the connection itself is still reachable
      if (error.code === '42P01') {
        return { ok: true, message: 'Connected to Supabase successfully (database schema unmigrated).' };
      }
      return { ok: false, message: `Supabase connection responded with error: ${error.message}` };
    }
    return { ok: true, message: 'Connected to Supabase database successfully.' };
  } catch (err: any) {
    return { ok: false, message: `Failed to connect to Supabase: ${err?.message || err}` };
  }
}
