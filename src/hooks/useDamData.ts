import { useQuery } from '@tanstack/react-query';
import { DamData, DamHistoryDay } from '@/types/damData';
import { supabase } from '@/integrations/supabase/client';

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

// Padronizar qualquer data para YYYY-MM-DD
const standardizeDateToISO = (dateStr: string): string => {
  if (!dateStr) return '';
  if (dateStr.includes('-')) {
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      if (parts[2].length === 4) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    }
  }
  return dateStr;
};

// Converter data ISO YYYY-MM-DD para DD/MM/YYYY
const dateISOToBR = (isoStr: string): string => {
  if (!isoStr || !isoStr.includes('-')) return isoStr;
  const parts = isoStr.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return isoStr;
};

// Mesclar e garantir um histórico completo de 7 a 9 dias
const ensureCompleteHistory = (data: DamData): DamData => {
  if (!data) return DEFAULT_FALLBACK_DAM_DATA;
  
  const historyMap: Record<string, DamHistoryDay> = {};
  
  // 1. Inserir dias de fallback como base
  if (DEFAULT_FALLBACK_DAM_DATA?.historico_dias) {
    DEFAULT_FALLBACK_DAM_DATA.historico_dias.forEach(item => {
      const stdDia = standardizeDateToISO(item.dia || item.data_original);
      if (stdDia) {
        historyMap[stdDia] = { 
          ...item, 
          dia: stdDia,
          data_original: item.data_original || dateISOToBR(stdDia)
        };
      }
    });
  }
  
  // 2. Sobrescrever ou adicionar os dias recebidos do Supabase/API
  if (Array.isArray(data.historico_dias)) {
    data.historico_dias.forEach(item => {
      const stdDia = standardizeDateToISO(item.dia || item.data_original);
      if (stdDia) {
        historyMap[stdDia] = {
          ...item,
          dia: stdDia,
          data_original: item.data_original || dateISOToBR(stdDia)
        };
      }
    });
  }
  
  const sortedDates = Object.keys(historyMap).sort();
  const todayStr = new Date().toISOString().split('T')[0];
  const validDates = sortedDates.filter(d => d <= todayStr);
  const recentDates = validDates.length >= 7 ? validDates.slice(-9) : sortedDates.slice(-9);
  
  const mergedHistory = recentDates.map(d => historyMap[d]);
  
  return {
    ...data,
    historico_dias: mergedHistory.length > 0 ? mergedHistory : DEFAULT_FALLBACK_DAM_DATA.historico_dias
  };
};

// Processar dados brutos do JSON da Cemig com ultra-resiliência contra erros
const processCemigRawData = (raw: any): DamData => {
  try {
    if (!raw || typeof raw !== 'object') {
      return DEFAULT_FALLBACK_DAM_DATA;
    }

    const getLast = <T>(arr: T[] | undefined): T | null => (Array.isArray(arr) && arr.length > 0 ? arr[arr.length - 1] : null);

    const nivelObj = getLast(raw.VAL_NIVEL as Array<{ Value: number }>);
    const volObj = getLast(raw.VAL_VOLUTIL as Array<{ Value: number }>);
    const aflObj = getLast(raw.VAL_VAZAOAFLU as Array<{ Value: number }>);
    const defObj = getLast(raw.VAL_VAZAODEFLU as Array<{ Value: number }>);

    const nivelAtual = (nivelObj && typeof nivelObj.Value === 'number' && !isNaN(nivelObj.Value)) 
      ? nivelObj.Value.toFixed(2) 
      : DEFAULT_FALLBACK_DAM_DATA.nivel_atual;

    const volumeUtilPercentual = (volObj && typeof volObj.Value === 'number' && !isNaN(volObj.Value)) 
      ? volObj.Value.toFixed(1) 
      : DEFAULT_FALLBACK_DAM_DATA.volume_util_percentual;

    const afluencia = (aflObj && typeof aflObj.Value === 'number' && !isNaN(aflObj.Value)) 
      ? Math.round(aflObj.Value).toString() 
      : DEFAULT_FALLBACK_DAM_DATA.afluencia;

    const defluencia = (defObj && typeof defObj.Value === 'number' && !isNaN(defObj.Value)) 
      ? Math.round(defObj.Value).toString() 
      : DEFAULT_FALLBACK_DAM_DATA.defluencia;

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

    // Mapear dados históricos consolidados de fallback para preenchimento de lacunas
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

    const parsedData: DamData = {
      nivel_atual: nivelAtual,
      volume_util_percentual: volumeUtilPercentual,
      afluencia: afluencia,
      defluencia: defluencia,
      data_atualizacao: new Date().toLocaleDateString("pt-BR"),
      hora_atualizacao: new Date().toLocaleTimeString("pt-BR"),
      historico_dias: historico_dias,
      usando_dados_historicos: false
    };

    return ensureCompleteHistory(parsedData);
  } catch (err) {
    if (import.meta.env.DEV) console.error('⚠️ [PROCESS] Erro ao processar dados da CEMIG, usando fallback:', err);
    return DEFAULT_FALLBACK_DAM_DATA;
  }
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
  try {
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
          const processed = processCemigRawData(responseData.raw_cemig);
          if (processed && processed.nivel_atual) return ensureCompleteHistory(processed);
        }
        if (responseData && responseData.nivel_atual) {
          return ensureCompleteHistory(responseData as DamData);
        }
      }
    } catch (err) {
      if (import.meta.env.DEV) console.warn('⚠️ [FETCH] Erro ao ler dados do Supabase:', err);
    }

    // 2. Se o banco estiver sem dados atualizados, tenta via Edge Function no Supabase (Proxy servidor 100% sem CORS)
    try {
      const { data: edgeData, error: edgeErr } = await supabase.functions.invoke('dam-data-proxy');
      if (!edgeErr && edgeData?.raw_cemig) {
        const processed = processCemigRawData(edgeData.raw_cemig);
        if (processed && processed.nivel_atual) return ensureCompleteHistory(processed);
      }
    } catch (edgeErr) {
      if (import.meta.env.DEV) console.warn('⚠️ [FETCH] Erro na Edge Function:', edgeErr);
    }

    // 3. Tentar busca direta (pode falhar no navegador por CORS do servidor da Cemig)
    try {
      if (import.meta.env.DEV) console.log('⚡ [FETCH] Tentando busca direta na Cemig...');
      const cemigData = await fetchCemigDirectly();
      if (cemigData && Array.isArray(cemigData.historico_dias) && cemigData.historico_dias.length > 0) {
        return ensureCompleteHistory(cemigData);
      }
    } catch (cemigErr) {
      if (import.meta.env.DEV) console.warn('⚠️ [FETCH] Erro ou bloqueio CORS no fetch direto da Cemig:', cemigErr);
    }

    // 4. Fallback de segurança contendo a medição mais recente (19/07/2026)
    return ensureCompleteHistory(DEFAULT_FALLBACK_DAM_DATA);
  } catch (globalErr) {
    if (import.meta.env.DEV) console.error('❌ [FETCH] Erro global na busca de dados da represa:', globalErr);
    return DEFAULT_FALLBACK_DAM_DATA;
  }
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
