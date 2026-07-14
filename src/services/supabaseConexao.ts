import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Variáveis VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY não encontradas. ' +
    'Confirme se o arquivo .env existe na raiz do projeto e se o servidor foi reiniciado após criá-lo.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)