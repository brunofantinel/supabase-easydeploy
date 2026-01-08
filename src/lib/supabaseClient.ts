import { createClient } from '@supabase/supabase-js';

// Função auxiliar para ler as variáveis de produção (env.js) ou local (.env)
const getEnv = (key: string) => {
  return (window as any).__ENV__?.[key] || import.meta.env[key];
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// 1. Exporta o cliente principal
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. Exporta a função isConfigured que o Index.tsx está pedindo
export const isConfigured = !!(supabaseUrl && supabaseAnonKey);

// 3. Exporta a função getConfigStatus que o Index.tsx está pedindo
export const getConfigStatus = () => {
  return {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
    isReady: !!(supabaseUrl && supabaseAnonKey)
  };
};
