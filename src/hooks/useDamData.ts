import { useQuery } from '@tanstack/react-query';
import { DamData } from '@/types/damData';
import { supabase } from '@/integrations/supabase/client';

// Interface para o formato da API do n8n
interface NewApiResponseItem {
  tipo: 'tempo_real' | 'historico';
  data_leitura: string;
  afluencia: string;
  nivel_inicial: string;
  volume_inicial: string;
  defluencia: string;
  nivel_atual: string;
  volume_percentual: string;
}

// Converter número brasileiro para float (564,24 → 564.24)
const parseNumberBR = (value: string): number => {
  if (!value || value === '--' || 
      value.toLowerCase().includes('verificar') || 
      value.toLowerCase().includes('detectado')) {
    return 0;
  }
  return parseFloat(value.replace(',', '.')) || 0;
};

// Converter data BR para ISO (01/12/2025 → 2025-12-01)
const parseDateBR = (dateStr: string): string => {
  if (!dateStr || !dateStr.includes('/')) return dateStr;
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};

// Verificar se os dados são válidos
const isValidData = (item: NewApiResponseItem): boolean => {
  return item.nivel_atual !== 'Não detectado' && 
         item.nivel_atual !== '--' &&
         item.volume_percentual !== '--';
};

// Calcular tendência baseada no histórico
const calcularTendencia = (historico: NewApiResponseItem[]): string => {
  if (historico.length < 2) return 'estável';
  
  const volumeRecente = parseNumberBR(historico[0].volume_percentual);
  const volumeAnterior = parseNumberBR(historico[1].volume_percentual);
  
  if (volumeRecente > volumeAnterior + 0.3) return 'subindo';
  if (volumeRecente < volumeAnterior - 0.3) return 'descendo';
  return 'estável';
};

// Mapear dados do formato da API para DamData
const mapNewApiDataToDamData = (apiData: NewApiResponseItem[]): DamData => {
  if (import.meta.env.DEV) console.log('🔄 [MAPPING] Processando dados da API:', apiData?.length || 0, 'itens');
  
  const tempoReal = apiData.find(item => item.tipo === 'tempo_real');
  const historico = apiData.filter(item => item.tipo === 'historico');
  
  const dadosAtuais = (tempoReal && isValidData(tempoReal)) 
    ? tempoReal 
    : historico[0];
  
  const usandoHistorico = !tempoReal || !isValidData(tempoReal);
  
  const nivelAtual = parseNumberBR(dadosAtuais?.nivel_atual || '0');
  const volumePercentual = parseNumberBR(dadosAtuais?.volume_percentual || '0');
  const afluencia = parseNumberBR(dadosAtuais?.afluencia || '0');
  const defluencia = parseNumberBR(dadosAtuais?.defluencia || '0');
  
  const historicoDias = historico.map(item => ({
    dia: parseDateBR(item.data_leitura),
    data_original: item.data_leitura,
    vazao_afl: parseNumberBR(item.afluencia).toString(),
    cota_inicial: parseNumberBR(item.nivel_inicial).toString(),
    vol_util_inicial: parseNumberBR(item.volume_inicial).toString(),
    vazao_def: parseNumberBR(item.defluencia).toString(),
    cota_final: parseNumberBR(item.nivel_atual).toString(),
    vol_util_final: parseNumberBR(item.volume_percentual).toString(),
  }));
  
  const tendencia = calcularTendencia(historico);
  const dataAtualizacao = dadosAtuais?.data_leitura || new Date().toLocaleDateString('pt-BR');
  
  return {
    nivel_atual: nivelAtual.toFixed(2),
    volume_util_percentual: volumePercentual.toFixed(1),
    afluencia: afluencia.toString(),
    defluencia: defluencia.toString(),
    data_atualizacao: dataAtualizacao,
    hora_atualizacao: new Date().toLocaleTimeString('pt-BR'),
    historico_dias: historicoDias,
    tendencia_represa: tendencia,
    usando_dados_historicos: usandoHistorico,
  };
};

// Processar dados brutos do JSON da Cemig (usado pelo fetch direto e pelo banco)
const processCemigRawData = (raw: any): DamData => {
  const getLast = <T>(arr: T[] | undefined): T | null => (Array.isArray(arr) && arr.length > 0 ? arr[arr.length - 1] : null);

  const nivelObj = getLast(raw.VAL_NIVEL as Array<{ Value: number }>);
  const volObj = getLast(raw.VAL_VOLUTIL as Array<{ Value: number }>);
  const aflObj = getLast(raw.VAL_VAZAOAFLU as Array<{ Value: number }>);
  const defObj = getLast(raw.VAL_VAZAODEFLU as Array<{ Value: number }>);

  const nivelAtual = nivelObj ? nivelObj.Value.toFixed(2) : "571.60";
  const volumeUtilPercentual = volObj ? volObj.Value.toFixed(1) : "93.6";
  const afluencia = aflObj ? Math.round(aflObj.Value).toString() : "138";
  const defluencia = defObj ? Math.round(defObj.Value).toString() : "164";

  const dailyMap: Record<string, { cota?: number; vol?: number; afl?: number; def?: number }> = {};

  const processSeries = (arr: Array<{ Timestamp: string; Value: number }> | undefined, key: 'cota' | 'vol' | 'afl' | 'def') => {
    if (!Array.isArray(arr)) return;
    arr.forEach(item => {
      if (!item || !item.Timestamp) return;
      const val = item.Value;
      if (typeof val !== 'number' || isNaN(val)) return;
      const dateStr = item.Timestamp.split("T")[0];
      if (!dailyMap[dateStr]) dailyMap[dateStr] = {};
      dailyMap[dateStr][key] = val;
    });
  };

  processSeries(raw.VAL_NIVEL, "cota");
  processSeries(raw.VAL_VOLUTIL, "vol");
  processSeries(raw.VAL_VAZAOAFLU, "afl");
  processSeries(raw.VAL_VAZAODEFLU, "def");

  const sumarizados = raw.VAL_SUMARIZADOS || {};
  processSeries(sumarizados.VazaoAfluente, "afl");
  processSeries(sumarizados.VazaoDefluente, "def");
  processSeries(sumarizados.NivelMontante, "cota");
  processSeries(sumarizados.VolumeUtil, "vol");

  const fech = raw.VAL_FECHAMENTO || {};
  const cotas = (fech.CotaFinal || {}) as Record<string, number>;
  const vols = (fech.VolumeFinal || {}) as Record<string, number>;
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

  // Mapear dados históricos consolidados de fallback para preenchimento de lacunas de vazão
  const fallbackMap: Record<string, any> = {};
  if (DEFAULT_FALLBACK_DAM_DATA?.historico_dias) {
    DEFAULT_FALLBACK_DAM_DATA.historico_dias.forEach(fb => {
      if (fb.dia) fallbackMap[fb.dia] = fb;
    });
  }

  // Garantir que as datas recentes de fallback estejam no dailyMap
  Object.keys(fallbackMap).forEach(d => {
    if (!dailyMap[d]) dailyMap[d] = {};
  });

  const allDates = Object.keys(dailyMap).sort();
  const todayStr = new Date().toISOString().split("T")[0];
  const historicalDates = allDates.filter(d => d <= todayStr);
  const recentDates = historicalDates.length >= 7 ? historicalDates.slice(-9) : allDates.slice(-9);

  const historico_dias = recentDates.map(dateStr => {
    const item = dailyMap[dateStr] || {};
    const fallbackItem = fallbackMap[dateStr] || {};
    const formattedDataOriginal = dateStr && dateStr.includes("-") ? dateStr.split("-").reverse().join("/") : (dateStr || "");

    const aflVal = item.afl !== undefined 
      ? Math.round(item.afl).toString() 
      : (fallbackItem.vazao_afl || afluencia);

    const defVal = item.def !== undefined 
      ? Math.round(item.def).toString() 
      : (fallbackItem.vazao_def || defluencia);

    const cotaVal = item.cota !== undefined 
      ? item.cota.toFixed(2) 
      : (fallbackItem.cota_final || nivelAtual);

    const volVal = item.vol !== undefined 
      ? item.vol.toFixed(1) 
      : (fallbackItem.vol_util_final || volumeUtilPercentual);

    return {
      dia: dateStr || "",
      data_original: formattedDataOriginal,
      vazao_afl: aflVal,
      cota_inicial: cotaVal,
      vol_util_inicial: volVal,
      vazao_def: defVal,
      cota_final: cotaVal,
      vol_util_final: volVal,
    };
  });

  return {
    nivel_atual: nivelAtual,
    volume_util_percentual: volumeUtilPercentual,
    afluencia: afluencia,
    defluencia: defluencia,
    data_atualizacao: new Date().toLocaleDateString("pt-BR"),
    hora_atualizacao: new Date().toLocaleTimeString("pt-BR"),
    historico_dias: historico_dias,
    usando_dados_historicos: false
  };
};

// Buscar da API da Cemig diretamente com trava anti-cache móbile
const fetchCemigDirectly = async (): Promise<DamData> => {
  if (import.meta.env.DEV) console.log('🔄 [FETCH] Buscando dados diretamente da API Cemig...');
  const timestamp = Date.now();
  const formData = new URLSearchParams();
  formData.append('action', 'buscar_dados_usina');
  formData.append('usina_id', 'UHE_TRES_MARIAS');
  formData.append('_t', timestamp.toString());

  const response = await fetch(`https://www.cemig.com.br/wp-json/api-busca-usinas/v1/send-form?_t=${timestamp}`, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP Cemig: ${response.status}`);
  }

  const raw = await response.json();
  return processCemigRawData(raw);
};

// Buscar dados com prioridade no Supabase e suporte resiliente a API Cemig
const fetchDamDataFromDB = async (): Promise<DamData> => {
  // 1. Verificar se existe registro atualizado no banco de dados Supabase (row 1)
  try {
    const { data, error } = await supabase
      .from('dam_data')
      .select('data, updated_at')
      .eq('id', 1)
      .single();

    if (!error && data?.data) {
      const responseData = data.data as any;
      if (import.meta.env.DEV) console.log('✅ [FETCH] Dados encontrados no Supabase:', data.updated_at);
      
      if (responseData?.raw_cemig) {
        return processCemigRawData(responseData.raw_cemig);
      }
      if (responseData && responseData.nivel_atual && Array.isArray(responseData.historico_dias)) {
        return responseData as DamData;
      }
    }
  } catch (err) {
    if (import.meta.env.DEV) console.warn('⚠️ [FETCH] Erro ao ler dados do Supabase:', err);
  }

  // 2. Se o banco estiver vazio, tenta a busca direta na API oficial da Cemig
  try {
    if (import.meta.env.DEV) console.log('⚡ [FETCH] Banco sem dados. Carregando direto da Cemig...');
    const cemigData = await fetchCemigDirectly();
    if (cemigData && Array.isArray(cemigData.historico_dias) && cemigData.historico_dias.length > 0) {
      return cemigData;
    }
  } catch (cemigErr) {
    if (import.meta.env.DEV) console.warn('⚠️ [FETCH] Erro no fetch direto da Cemig:', cemigErr);
  }

  // 3. Tentar via Edge Function no Supabase (Proxy servidor 100% sem CORS)
  try {
    const { data: edgeData, error: edgeErr } = await supabase.functions.invoke('dam-data-proxy');
    if (!edgeErr && edgeData?.raw_cemig) {
      return processCemigRawData(edgeData.raw_cemig);
    }
  } catch (edgeErr) {
    if (import.meta.env.DEV) console.warn('⚠️ [FETCH] Erro na Edge Function:', edgeErr);
  }

  // 4. Fallback de segurança contendo a medição mais recente (19/07/2026)
  return DEFAULT_FALLBACK_DAM_DATA;
};

// Dados padrão iniciais contendo o histórico consolidado recente da represa
export const DEFAULT_FALLBACK_DAM_DATA: DamData = {
  nivel_atual: "571.60",
  volume_util_percentual: "93.6",
  afluencia: "138",
  defluencia: "164",
  data_atualizacao: "19/07/2026",
  hora_atualizacao: "09:26:02",
  historico_dias: [
    { dia: "2026-07-11", data_original: "11/07/2026", vazao_afl: "101", cota_inicial: "571.71", vol_util_inicial: "94.5", vazao_def: "364", cota_final: "571.71", vol_util_final: "94.5" },
    { dia: "2026-07-12", data_original: "12/07/2026", vazao_afl: "90",  cota_inicial: "571.69", vol_util_inicial: "94.4", vazao_def: "413", cota_final: "571.69", vol_util_final: "94.4" },
    { dia: "2026-07-13", data_original: "13/07/2026", vazao_afl: "190", cota_inicial: "571.67", vol_util_inicial: "94.3", vazao_def: "534", cota_final: "571.67", vol_util_final: "94.3" },
    { dia: "2026-07-14", data_original: "14/07/2026", vazao_afl: "233", cota_inicial: "571.64", vol_util_inicial: "94.0", vazao_def: "546", cota_final: "571.64", vol_util_final: "94.0" },
    { dia: "2026-07-15", data_original: "15/07/2026", vazao_afl: "178", cota_inicial: "571.62", vol_util_inicial: "93.9", vazao_def: "340", cota_final: "571.62", vol_util_final: "93.9" },
    { dia: "2026-07-16", data_original: "16/07/2026", vazao_afl: "181", cota_inicial: "571.61", vol_util_inicial: "93.8", vazao_def: "384", cota_final: "571.61", vol_util_final: "93.8" },
    { dia: "2026-07-17", data_original: "17/07/2026", vazao_afl: "207", cota_inicial: "571.59", vol_util_inicial: "93.7", vazao_def: "342", cota_final: "571.59", vol_util_final: "93.7" },
    { dia: "2026-07-18", data_original: "18/07/2026", vazao_afl: "222", cota_inicial: "571.58", vol_util_inicial: "93.6", vazao_def: "691", cota_final: "571.58", vol_util_final: "93.6" },
    { dia: "2026-07-19", data_original: "19/07/2026", vazao_afl: "138", cota_inicial: "571.60", vol_util_inicial: "93.6", vazao_def: "164", cota_final: "571.60", vol_util_final: "93.6" }
  ],
  usando_dados_historicos: false
};

export const useDamData = () => {
  return useQuery({
    queryKey: ['damData'],
    queryFn: fetchDamDataFromDB,
    placeholderData: DEFAULT_FALLBACK_DAM_DATA,
    refetchInterval: 5 * 60 * 1000, // Verifica a cada 5 min
    staleTime: 4 * 60 * 1000, // Dados ficam fresh por 4 min
    retry: 2,
    retryDelay: 3000,
  });
};
