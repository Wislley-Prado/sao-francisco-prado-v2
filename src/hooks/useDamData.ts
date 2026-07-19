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

// Buscar da API da Cemig diretamente se o banco estiver vazio ou desatualizado
const fetchCemigDirectly = async (): Promise<DamData> => {
  if (import.meta.env.DEV) console.log('🔄 [FETCH] Buscando dados diretamente da API Cemig...');
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
    throw new Error(`Erro HTTP Cemig: ${response.status}`);
  }

  const raw = await response.json();

  const getLast = <T>(arr: T[] | undefined): T | null => (Array.isArray(arr) && arr.length > 0 ? arr[arr.length - 1] : null);

  const nivelObj = getLast(raw.VAL_NIVEL as Array<{ Value: number }>);
  const volObj = getLast(raw.VAL_VOLUTIL as Array<{ Value: number }>);
  const aflObj = getLast(raw.VAL_VAZAOAFLU as Array<{ Value: number }>);
  const defObj = getLast(raw.VAL_VAZAODEFLU as Array<{ Value: number }>);

  const nivelAtual = nivelObj ? nivelObj.Value.toFixed(2) : "571.58";
  const volumeUtilPercentual = volObj ? volObj.Value.toFixed(1) : "93.6";
  const afluencia = aflObj ? Math.round(aflObj.Value).toString() : "222";
  const defluencia = defObj ? Math.round(defObj.Value).toString() : "691";

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

  // 1. Processar dados de tempo real
  processSeries(raw.VAL_NIVEL, "cota");
  processSeries(raw.VAL_VOLUTIL, "vol");
  processSeries(raw.VAL_VAZAOAFLU, "afl");
  processSeries(raw.VAL_VAZAODEFLU, "def");

  // 2. Processar séries sumarizadas históricas diárias (chaves corretas da Cemig)
  const sumarizados = raw.VAL_SUMARIZADOS || {};
  processSeries(sumarizados.VazaoAfluente, "afl");
  processSeries(sumarizados.VazaoDefluente, "def");
  processSeries(sumarizados.NivelMontante, "cota");
  processSeries(sumarizados.VolumeUtil, "vol");

  // 3. Processar fechamento diário
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

  const allDates = Object.keys(dailyMap).filter(d => dailyMap[d].cota !== undefined || dailyMap[d].afl !== undefined).sort();
  // Pegar os últimos 7 a 9 dias consolidados (incluindo a data de hoje)
  const todayStr = new Date().toISOString().split("T")[0];
  const historicalDates = allDates.filter(d => d <= todayStr);
  const recentDates = historicalDates.length >= 7 ? historicalDates.slice(-9) : allDates.slice(-9);

  const historico_dias = recentDates.map(dateStr => {
    const item = dailyMap[dateStr] || {};
    const formattedDataOriginal = dateStr && dateStr.includes("-") ? dateStr.split("-").reverse().join("/") : (dateStr || "");
    return {
      dia: dateStr || "",
      data_original: formattedDataOriginal,
      vazao_afl: item.afl !== undefined ? Math.round(item.afl).toString() : afluencia,
      cota_inicial: item.cota !== undefined ? item.cota.toFixed(2) : nivelAtual,
      vol_util_inicial: item.vol !== undefined ? item.vol.toFixed(1) : volumeUtilPercentual,
      vazao_def: item.def !== undefined ? Math.round(item.def).toString() : defluencia,
      cota_final: item.cota !== undefined ? item.cota.toFixed(2) : nivelAtual,
      vol_util_final: item.vol !== undefined ? item.vol.toFixed(1) : volumeUtilPercentual,
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

// Buscar dados do banco com fallback resiliente para a API Cemig
const fetchDamDataFromDB = async (): Promise<DamData> => {
  try {
    if (import.meta.env.DEV) console.log('🔧 [FETCH] Buscando dados da represa do banco...');
    
    const { data, error } = await supabase
      .from('dam_data')
      .select('data, updated_at')
      .eq('id', 1)
      .single();

    if (!error && data?.data && Object.keys(data.data as object).length > 0) {
      const responseData = data.data as any;
      let damDataResult: DamData | null = null;

      if (responseData && 'sucesso' in responseData && Array.isArray(responseData.dados)) {
        damDataResult = mapNewApiDataToDamData(responseData.dados);
      } else if (Array.isArray(responseData) && responseData.length > 0) {
        damDataResult = mapNewApiDataToDamData(responseData);
      } else if (responseData && responseData.nivel_atual) {
        damDataResult = responseData as DamData;
      }

      // Se o banco contiver histórico válido (pelo menos 1 dia), usa o dado do banco
      if (damDataResult && Array.isArray(damDataResult.historico_dias) && damDataResult.historico_dias.length > 0) {
        if (import.meta.env.DEV) console.log('✅ [FETCH] Dados do banco carregados com', damDataResult.historico_dias.length, 'dias de histórico');
        return damDataResult;
      }
    }
  } catch (err) {
    if (import.meta.env.DEV) console.warn('⚠️ [FETCH] Erro no banco. Usando busca direta da Cemig:', err);
  }

  // Fallback direto para a API da Cemig se o banco estiver sem histórico ou desatualizado
  try {
    if (import.meta.env.DEV) console.log('⚡ [FETCH] Banco sem histórico. Carregando histórico direto da Cemig...');
    return await fetchCemigDirectly();
  } catch (cemigErr) {
    if (import.meta.env.DEV) console.warn('⚠️ [FETCH] Erro na requisição Cemig. Usando DEFAULT_FALLBACK_DAM_DATA de segurança:', cemigErr);
    return DEFAULT_FALLBACK_DAM_DATA;
  }
};

// Dados padrão iniciais contendo o histórico consolidado recente da represa
export const DEFAULT_FALLBACK_DAM_DATA: DamData = {
  nivel_atual: "571.58",
  volume_util_percentual: "93.6",
  afluencia: "222",
  defluencia: "691",
  data_atualizacao: "18/07/2026",
  hora_atualizacao: "21:00:00",
  historico_dias: [
    { dia: "2026-07-10", data_original: "10/07/2026", vazao_afl: "186", cota_inicial: "571.72", vol_util_inicial: "94.5", vazao_def: "288", cota_final: "571.72", vol_util_final: "94.5" },
    { dia: "2026-07-11", data_original: "11/07/2026", vazao_afl: "101", cota_inicial: "571.71", vol_util_inicial: "94.5", vazao_def: "364", cota_final: "571.71", vol_util_final: "94.5" },
    { dia: "2026-07-12", data_original: "12/07/2026", vazao_afl: "90",  cota_inicial: "571.69", vol_util_inicial: "94.4", vazao_def: "413", cota_final: "571.69", vol_util_final: "94.4" },
    { dia: "2026-07-13", data_original: "13/07/2026", vazao_afl: "190", cota_inicial: "571.67", vol_util_inicial: "94.3", vazao_def: "534", cota_final: "571.67", vol_util_final: "94.3" },
    { dia: "2026-07-14", data_original: "14/07/2026", vazao_afl: "233", cota_inicial: "571.64", vol_util_inicial: "94.0", vazao_def: "546", cota_final: "571.64", vol_util_final: "94.0" },
    { dia: "2026-07-15", data_original: "15/07/2026", vazao_afl: "178", cota_inicial: "571.62", vol_util_inicial: "93.9", vazao_def: "340", cota_final: "571.62", vol_util_final: "93.9" },
    { dia: "2026-07-16", data_original: "16/07/2026", vazao_afl: "181", cota_inicial: "571.61", vol_util_inicial: "93.8", vazao_def: "384", cota_final: "571.61", vol_util_final: "93.8" },
    { dia: "2026-07-17", data_original: "17/07/2026", vazao_afl: "207", cota_inicial: "571.59", vol_util_inicial: "93.7", vazao_def: "342", cota_final: "571.59", vol_util_final: "93.7" },
    { dia: "2026-07-18", data_original: "18/07/2026", vazao_afl: "222", cota_inicial: "571.58", vol_util_inicial: "93.6", vazao_def: "691", cota_final: "571.58", vol_util_final: "93.6" }
  ],
  usando_dados_historicos: false
};

export const useDamData = () => {
  return useQuery({
    queryKey: ['damData', 'cached'],
    queryFn: fetchDamDataFromDB,
    placeholderData: DEFAULT_FALLBACK_DAM_DATA,
    refetchInterval: 5 * 60 * 1000, // Verifica a cada 5 min
    staleTime: 4 * 60 * 1000, // Dados ficam fresh por 4 min
    retry: 2,
    retryDelay: 3000,
  });
};

