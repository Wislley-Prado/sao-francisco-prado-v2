import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

if (!fs.existsSync('.env')) {
  console.error("❌ Arquivo .env não encontrado!");
  process.exit(1);
}

const envConfig = dotenv.parse(fs.readFileSync('.env'));
for (const k in envConfig) process.env[k] = envConfig[k];

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("🔍 Verificando estado atual das colunas no banco de dados...");
  
  // 1. Tentar fazer uma consulta selecionando os campos
  console.log("1. Tentando consultar as novas colunas...");
  const { data, error } = await supabase
    .from('propriedades_venda')
    .select('id, video_youtube, texto_botao_whatsapp, mensagem_whatsapp')
    .limit(1);

  if (error) {
    console.log("❌ Falha na consulta direta:");
    console.log(error);
    
    // 2. Se falhar por causa do cache do schema, tentar forçar o recarregamento do cache (schema cache reload)
    if (error.message && error.message.includes('schema cache')) {
      console.log("\n🔄 Tentando forçar a atualização do cache do Supabase (NOTIFY pgrst, 'reload schema')...");
      const reloadQuery = "NOTIFY pgrst, 'reload schema';";
      
      let reloadRes = await supabase.rpc('exec_sql', { query: reloadQuery });
      if (reloadRes.error) {
        reloadRes = await supabase.rpc('exec_sql', { sql: reloadQuery });
      }
      if (reloadRes.error) {
        reloadRes = await supabase.rpc('execute_sql', { sql_query: reloadQuery });
      }
      
      if (reloadRes.error) {
        console.error("❌ Falha ao enviar notificação de reload para o PostgREST:", reloadRes.error);
      } else {
        console.log("✅ Comando de recarregamento enviado com sucesso! Aguardando 3 segundos...");
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Tentar novamente a consulta
        console.log("2. Tentando consultar novamente após o reload...");
        const retry = await supabase
          .from('propriedades_venda')
          .select('id, video_youtube, texto_botao_whatsapp, mensagem_whatsapp')
          .limit(1);
          
        if (retry.error) {
          console.error("❌ A consulta ainda falhou:", retry.error);
        } else {
          console.log("🎉 Sucesso! As colunas agora estão visíveis e utilizáveis!");
        }
      }
    }
  } else {
    console.log("✅ Sucesso! As colunas existem e estão acessíveis no banco de dados.");
    console.log("Dados de teste retornados:", data);
  }
}

check().catch(console.error);
