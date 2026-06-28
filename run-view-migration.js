import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables from .env
if (!fs.existsSync('.env')) {
  console.error("❌ Arquivo .env não encontrado no diretório raiz!");
  process.exit(1);
}

const envConfig = dotenv.parse(fs.readFileSync('.env'));
for (const k in envConfig) process.env[k] = envConfig[k];

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ VITE_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidos no arquivo .env");
  process.exit(1);
}

console.log(`📡 Conectando ao Supabase em: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseKey);

const sql = `DROP VIEW IF EXISTS public.site_settings_public CASCADE;

CREATE OR REPLACE VIEW public.site_settings_public AS
SELECT
  id, telefone_contato, email_contato, copyright_text,
  facebook_url, instagram_url, youtube_url, tiktok_url, twitter_url,
  reserva_button_text, reserva_button_link, autor_avatar_url,
  whatsapp_numero, whatsapp_titulo, whatsapp_mensagem_padrao,
  whatsapp_saudacao, whatsapp_instrucao, whatsapp_horario, whatsapp_opcoes,
  youtube_live_url, youtube_video_url, youtube_institucional_url,
  facebook_pixel, google_analytics, google_tag_manager, custom_head_scripts,
  created_at, updated_at
FROM public.site_settings;`;

async function run() {
  console.log("🚀 Atualizando a view site_settings_public no Supabase...");
  
  // Tenta exec_sql
  let res = await supabase.rpc('exec_sql', { query: sql });
  if (res.error) {
    // Tenta exec_sql (sql)
    res = await supabase.rpc('exec_sql', { sql: sql });
  }
  if (res.error) {
    // Tenta execute_sql (sql_query)
    res = await supabase.rpc('execute_sql', { sql_query: sql });
  }
  
  if (res.error) {
    console.error("❌ Erro ao atualizar a view:");
    console.error(res.error);
  } else {
    console.log("✅ View site_settings_public atualizada com sucesso!");
  }
}

run().catch(err => {
  console.error("❌ Ocorreu um erro inesperado:", err);
});
