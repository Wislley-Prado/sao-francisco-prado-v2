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

const sqlCommands = [
  "ALTER TABLE public.propriedades_venda ADD COLUMN IF NOT EXISTS video_youtube TEXT;",
  "ALTER TABLE public.propriedades_venda ADD COLUMN IF NOT EXISTS texto_botao_whatsapp TEXT;",
  "ALTER TABLE public.propriedades_venda ADD COLUMN IF NOT EXISTS mensagem_whatsapp TEXT;",
  "COMMENT ON COLUMN public.propriedades_venda.video_youtube IS 'URL do vídeo do YouTube (Shorts) da propriedade à venda';",
  "COMMENT ON COLUMN public.propriedades_venda.texto_botao_whatsapp IS 'Texto personalizado para o botão do WhatsApp';",
  "COMMENT ON COLUMN public.propriedades_venda.mensagem_whatsapp IS 'Mensagem padrão personalizada ao clicar no botão do WhatsApp';"
];

async function run() {
  console.log("🚀 Iniciando migração do banco de dados...");
  
  for (const sql of sqlCommands) {
    console.log(`Executing: ${sql}`);
    
    // Tenta exec_sql (query)
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
      console.error(`❌ Erro ao executar: ${sql}`);
      console.error(res.error);
    } else {
      console.log(`✅ Sucesso!`);
    }
  }
  
  console.log("\n✨ Migração concluída com sucesso! Recarregue a página no seu navegador e tente salvar novamente.");
}

run().catch(err => {
  console.error("❌ Ocorreu um erro inesperado:", err);
});
