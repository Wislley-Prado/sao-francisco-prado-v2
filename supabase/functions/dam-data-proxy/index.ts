import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Tratar requisições preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('🚀 [PROXY] Buscando dados oficiais diretamente da API da CEMIG...');

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const timestamp = Date.now();
    const formData = new URLSearchParams();
    formData.append('action', 'buscar_dados_usina');
    formData.append('usina_id', 'UHE_TRES_MARIAS');
    formData.append('_t', timestamp.toString());

    const cemigRes = await fetch(`https://www.cemig.com.br/wp-json/api-busca-usinas/v1/send-form?_t=${timestamp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
      },
      body: formData.toString(),
    });

    if (!cemigRes.ok) {
      throw new Error(`Erro HTTP da Cemig: ${cemigRes.status}`);
    }

    const rawData = await cemigRes.json();
    console.log(`✅ [PROXY] Dados recebidos da CEMIG com sucesso!`);

    const dbPayload = {
      sucesso: true,
      origem: 'cemig_direto',
      raw_cemig: rawData,
      atualizado_em: new Date().toISOString()
    };

    const { error: upsertError } = await supabase
      .from('dam_data')
      .upsert({
        id: 1,
        data: dbPayload,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (upsertError) {
      console.error('❌ [PROXY] Erro ao salvar dados no banco:', upsertError.message);
    } else {
      console.log('💾 [PROXY] Dados salvos no banco Supabase com sucesso!');
    }

    return new Response(JSON.stringify({ 
      sucesso: true,
      raw_cemig: rawData,
      saved_to_db: !upsertError,
      updated_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ [PROXY] Erro ao conectar com a CEMIG:', error);
    return new Response(
      JSON.stringify({ 
        error: (error as Error).message || 'Erro ao conectar com a CEMIG'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
