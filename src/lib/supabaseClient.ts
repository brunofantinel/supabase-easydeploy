import { createClient } from '@supabase/supabase-js';

// Função para pegar a variável do ambiente injetado ou do Vite (fallback local)
const getEnv = (key: string) => {
  return (window as any).__ENV__?.[key] || import.meta.env[key];
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: Variáveis do Supabase não encontradas!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
