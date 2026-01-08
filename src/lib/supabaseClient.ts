import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Extend Window interface for runtime env
declare global {
  interface Window {
    __ENV__?: {
      VITE_SUPABASE_URL?: string;
      VITE_SUPABASE_ANON_KEY?: string;
    };
  }
}

// Get env from runtime (production) or Vite (development)
const getEnvVar = (key: string): string => {
  // First try runtime env (injected by Docker entrypoint)
  const runtimeValue = window.__ENV__?.[key as keyof typeof window.__ENV__];
  if (runtimeValue) return runtimeValue;
  
  // Fallback to Vite env (development)
  return import.meta.env[key] || '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Validation
export const isConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

export const getConfigStatus = () => ({
  hasUrl: Boolean(supabaseUrl),
  hasKey: Boolean(supabaseAnonKey),
  urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'Not configured',
  keyPreview: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'Not configured',
});

// Create client (will throw if not configured, but we handle it in the app)
let supabase: SupabaseClient | null = null;

if (isConfigured()) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
export default supabase;
