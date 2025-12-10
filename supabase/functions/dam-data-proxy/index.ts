import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEFAULT_WEBHOOK_URL = 'https://webhook.v1.vendopro.com.br/webhook/v1.represa.online';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('🚀 [PROXY] Iniciando requisição para webhook da represa...');

  try {
    // Buscar URL do webhook das configurações do site
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let webhookUrl = DEFAULT_WEBHOOK_URL;

    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('dam_webhook_url')
      .limit(1)
      .single();

    if (settingsError) {
      console.warn('⚠️ [PROXY] Erro ao buscar configurações, usando URL padrão:', settingsError.message);
    } else if (settings?.dam_webhook_url) {
      webhookUrl = settings.dam_webhook_url;
      console.log('📌 [PROXY] URL do webhook carregada do banco:', webhookUrl);
    } else {
      console.log('📌 [PROXY] Usando URL padrão do webhook');
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    console.log(`📡 [PROXY] Status da resposta: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [PROXY] Erro do webhook: ${errorText}`);
      return new Response(
        JSON.stringify({ 
          error: `Webhook error: ${response.status}`, 
          details: errorText,
          hint: 'Verifique se o workflow no n8n está ativo e a URL está correta nas configurações do admin.'
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log(`✅ [PROXY] Dados recebidos:`, JSON.stringify(data).substring(0, 200));

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ [PROXY] Erro na requisição:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        hint: 'Verifique a URL do webhook nas configurações do admin.'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
