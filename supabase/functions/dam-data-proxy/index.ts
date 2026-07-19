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

    // 1. Salvar JSON bruto no dam_data (row 1)
    const dbPayload = {
      sucesso: true,
      origem: 'cemig_direto',
      raw_cemig: rawData,
      atualizado_em: new Date().toISOString()
    };

    await supabase
      .from('dam_data')
      .upsert({
        id: 1,
        data: dbPayload,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    // 2. Extrair dados por data e salvar na tabela pontual dam_history
    const dailyMap: Record<string, { cota?: number; vol?: number; afl?: number; def?: number }> = {};

    const processSeries = (arr: Array<{ Timestamp: string; Value: number }> | undefined, key: 'cota' | 'vol' | 'afl' | 'def') => {
      if (!Array.isArray(arr)) return;
      arr.forEach(item => {
        if (!item || typeof item.Timestamp !== 'string') return;
        const val = item.Value;
        if (typeof val !== 'number' || isNaN(val)) return;
        const dateStr = item.Timestamp.split("T")[0];
        if (!dateStr) return;
        if (!dailyMap[dateStr]) dailyMap[dateStr] = {};
        dailyMap[dateStr][key] = val;
      });
    };

    processSeries(rawData.VAL_NIVEL, "cota");
    processSeries(rawData.VAL_VOLUTIL, "vol");
    processSeries(rawData.VAL_VAZAOAFLU, "afl");
    processSeries(rawData.VAL_VAZAODEFLU, "def");

    const sumarizados = rawData.VAL_SUMARIZADOS || {};
    processSeries(sumarizados.VazaoAfluente, "afl");
    processSeries(sumarizados.VazaoDefluente, "def");
    processSeries(sumarizados.NivelMontante, "cota");
    processSeries(sumarizados.VolumeUtil, "vol");

    const fech = rawData.VAL_FECHAMENTO || {};
    const cotas = (typeof fech.CotaFinal === 'object' && fech.CotaFinal !== null ? fech.CotaFinal : {}) as Record<string, number>;
    const vols = (typeof fech.VolumeFinal === 'object' && fech.VolumeFinal !== null ? fech.VolumeFinal : {}) as Record<string, number>;

    Object.keys(cotas).forEach(d => {
      if (typeof cotas[d] === 'number' && !isNaN(cotas[d])) {
        if (!dailyMap[d]) dailyMap[d] = {};
        dailyMap[d].cota = cotas[d];
      }
    });

    Object.keys(vols).forEach(d => {
      if (typeof vols[d] === 'number' && !isNaN(vols[d])) {
        if (!dailyMap[d]) dailyMap[d] = {};
        dailyMap[d].vol = vols[d];
      }
    });

    const todayStr = new Date().toISOString().split("T")[0];
    const historyEntries = Object.keys(dailyMap)
      .filter(d => d <= todayStr)
      .map(dateStr => {
        const item = dailyMap[dateStr];
        return {
          data_leitura: dateStr,
          nivel_cota: item.cota !== undefined ? Number(item.cota.toFixed(2)) : 571.60,
          volume_percentual: item.vol !== undefined ? Number(item.vol.toFixed(1)) : 93.60,
          afluencia: item.afl !== undefined ? Math.round(item.afl) : 138,
          defluencia: item.def !== undefined ? Math.round(item.def) : 164,
          updated_at: new Date().toISOString()
        };
      });

    if (historyEntries.length > 0) {
      const { error: historyUpsertErr } = await supabase
        .from('dam_history')
        .upsert(historyEntries, { onConflict: 'data_leitura' });

      if (historyUpsertErr) {
        console.warn('⚠️ [PROXY] Tabela dam_history ainda não criada ou erro ao inserir:', historyUpsertErr.message);
      } else {
        console.log(`💾 [PROXY] ${historyEntries.length} dias inseridos/atualizados na tabela dam_history!`);
      }
    }

    // 3. OPÇÃO A: Limpeza automática de registros antigos (remover com mais de 15 dias)
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    const cutoffDate = fifteenDaysAgo.toISOString().split("T")[0];

    const { error: deleteError } = await supabase
      .from('dam_history')
      .delete()
      .lt('data_leitura', cutoffDate);

    if (!deleteError) {
      console.log(`🧹 [PROXY] Registros anteriores a ${cutoffDate} limpos com sucesso!`);
    }

    return new Response(JSON.stringify({ 
      sucesso: true,
      raw_cemig: rawData,
      entries_updated: historyEntries.length,
      cutoff_date_cleaned: cutoffDate,
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
