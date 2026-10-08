/**
 * Central configuration module for DigiGovAssist.
 * Supports progressive enhancement: works fully with mock providers out of the box,
 * and dynamically enables real cloud APIs (Supabase, Gemini, DigiLocker, API Setu)
 * when valid keys are provided.
 */

export interface AppConfig {
  isSupabaseConfigured: boolean;
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
  isGeminiConfigured: boolean;
  geminiApiKey: string | null;
  isDemoMode: boolean;
  version: string;
}

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim() || null;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim() || null;
const geminiApiKey = (import.meta.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '').trim() || null;

export const config: AppConfig = {
  isSupabaseConfigured: Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')),
  supabaseUrl,
  supabaseAnonKey,
  isGeminiConfigured: Boolean(geminiApiKey && geminiApiKey.length > 10),
  geminiApiKey,
  isDemoMode: true, // Always true for prototype to clearly identify simulated data
  version: '1.0.0-prototype',
};

export const FUTURE_INTEGRATION_CONFIG = {
  digilocker: {
    enabled: false,
    label: 'DigiLocker (API Setu)',
    description: 'Direct citizen document fetch via National DigiLocker gateway',
  },
  apiSetu: {
    enabled: false,
    label: 'API Setu / MeitY',
    description: 'Federal data exchange for state and central government services',
  },
  parivahan: {
    enabled: false,
    label: 'Parivahan Sewa API',
    description: 'Ministry of Road Transport and Highways (MoRTH) endpoint',
  },
};
