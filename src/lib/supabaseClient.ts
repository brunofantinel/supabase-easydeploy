import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
  // Em produção, usa window.__ENV__. Em dev, usa import.meta.env
  // Importante: Vite exige o nome completo para substituição estática
  if (key === 'VITE_SUPABASE_URL') {
    return (window as any).__ENV__?.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
  }
  if (key === 'VITE_SUPABASE_ANON_KEY') {
    return (window as any).__ENV__?.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
  }
  return (window as any).__ENV__?.[key] || import.meta.env[key];
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// MUDANÇA AQUI: Transformamos em função () => ...
export const isConfigured = () => !!(supabaseUrl && supabaseAnonKey);

export const getConfigStatus = () => {
  return {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
    isReady: !!(supabaseUrl && supabaseAnonKey)
  };
};
