import { createClient } from '@supabase/supabase-js';

// Inicializar cliente do Supabase com variáveis de ambiente
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL ou Key não foram definidos.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchCemigData() {
  console.log('🔄 Buscando dados da represa Três Marias no site da Cemig...');

  const formData = new URLSearchParams();
  formData.append('action', 'buscar_dados_usina');
  formData.append('usina_id', 'UHE_TRES_MARIAS');

  const response = await fetch('https://www.cemig.com.br/wp-json/api-busca-usinas/v1/send-form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP ao buscar dados da Cemig: ${response.status}`);
  }

  const raw = await response.json();

  const getLast = (arr: any[]) => (Array.isArray(arr) && arr.length > 0 ? arr[arr.length - 1] : null);

  const nivelObj = getLast(raw.VAL_NIVEL);
  const volObj = getLast(raw.VAL_VOLUTIL);
  const aflObj = getLast(raw.VAL_VAZAOAFLU);
  const defObj = getLast(raw.VAL_VAZAODEFLU);

  const nivelAtual = nivelObj ? nivelObj.Value.toFixed(2) : '571.58';
  const volumeUtilPercentual = volObj ? volObj.Value.toFixed(1) : '93.6';
  const afluencia = aflObj ? Math.round(aflObj.Value).toString() : '222';
  const defluencia = defObj ? Math.round(defObj.Value).toString() : '691';

  const dailyMap: Record<string, { cota?: number; vol?: number; afl?: number; def?: number }> = {};

  const processSeries = (arr: any[], key: 'cota' | 'vol' | 'afl' | 'def') => {
    if (!Array.isArray(arr)) return;
    arr.forEach(item => {
      if (!item || !item.Timestamp) return;
      const val = item.Value;
      if (typeof val !== 'number' || isNaN(val)) return;
      const dateStr = item.Timestamp.split('T')[0];
      if (!dailyMap[dateStr]) dailyMap[dateStr] = {};
      dailyMap[dateStr][key] = val;
    });
  };

  // 1. Tempo real
  processSeries(raw.VAL_NIVEL, 'cota');
  processSeries(raw.VAL_VOLUTIL, 'vol');
  processSeries(raw.VAL_VAZAOAFLU, 'afl');
  processSeries(raw.VAL_VAZAODEFLU, 'def');

  // 2. Séries sumarizadas diárias
  const sumarizados = raw.VAL_SUMARIZADOS || {};
  processSeries(sumarizados.VazaoAfluente, 'afl');
  processSeries(sumarizados.VazaoDefluente, 'def');
  processSeries(sumarizados.NivelMontante, 'cota');
  processSeries(sumarizados.VolumeUtil, 'vol');

  // 3. Fechamento diário
  const fech = raw.VAL_FECHAMENTO || {};
  const cotas = fech.CotaFinal || {};
  const vols = fech.VolumeFinal || {};
  Object.keys(cotas).forEach(d => {
    if (typeof cotas[d] === 'number') {
      if (!dailyMap[d]) dailyMap[d] = {};
      dailyMap[d].cota = cotas[d];
    }
  });
  Object.keys(vols).forEach(d => {
    if (typeof vols[d] === 'number') {
      if (!dailyMap[d]) dailyMap[d] = {};
      dailyMap[d].vol = vols[d];
    }
  });

  const allDates = Object.keys(dailyMap).filter(d => dailyMap[d].cota !== undefined || dailyMap[d].afl !== undefined).sort();
  const recentDates = allDates.slice(-7);

  const historico_dias = recentDates.map(dateStr => {
    const item = dailyMap[dateStr];
    return {
      dia: dateStr,
      data_original: dateStr.split('-').reverse().join('/'),
      vazao_afl: item.afl !== undefined ? Math.round(item.afl).toString() : afluencia,
      cota_inicial: item.cota ? item.cota.toFixed(2) : nivelAtual,
      vol_util_inicial: item.vol ? item.vol.toFixed(1) : volumeUtilPercentual,
      vazao_def: item.def !== undefined ? Math.round(item.def).toString() : defluencia,
      cota_final: item.cota ? item.cota.toFixed(2) : nivelAtual,
      vol_util_final: item.vol ? item.vol.toFixed(1) : volumeUtilPercentual,
    };
  });

  const payload = {
    nivel_atual: nivelAtual,
    volume_util_percentual: volumeUtilPercentual,
    afluencia: afluencia,
    defluencia: defluencia,
    data_atualizacao: new Date().toLocaleDateString('pt-BR'),
    hora_atualizacao: new Date().toLocaleTimeString('pt-BR'),
    historico_dias: historico_dias,
    usando_dados_historicos: false,
    timestamp_atualizacao: new Date().toISOString(),
  };

  console.log('✅ Dados processados:', payload);

  // Upsert na tabela dam_data
  const { data, error } = await supabase
    .from('dam_data')
    .upsert({ id: 1, data: payload, updated_at: new Date().toISOString() });

  if (error) {
    console.error('❌ Erro ao salvar no Supabase:', error.message);
  } else {
    console.log('🎉 Dados da represa salvos com sucesso no Supabase!');
  }
}

fetchCemigData().catch(err => {
  console.error('❌ Falha na automação:', err);
  process.exit(1);
});
