
import { useQuery } from '@tanstack/react-query';
import { DamData } from '@/types/damData';

// Interface para o novo formato da API do n8n
interface NewApiResponseItem {
  tipo: 'tempo_real' | 'historico';
  data_leitura: string;        // "02/12/2025" (formato BR)
  afluencia: string;           // "192" ou "Verificar site"
  nivel_inicial: string;       // "564,24" ou "--"
  volume_inicial: string;      // "51,1" ou "--"
  defluencia: string;          // "448" ou "--"
  nivel_atual: string;         // "564,18" ou "Não detectado"
  volume_percentual: string;   // "50,8" ou "--"
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

// Mapear dados do novo formato da API para DamData
const mapNewApiDataToDamData = (apiData: NewApiResponseItem[]): DamData => {
  console.log('🔄 [MAPPING] Processando novo formato da API:', apiData);
  
  // 1. Separar dados em tempo real e histórico
  const tempoReal = apiData.find(item => item.tipo === 'tempo_real');
  const historico = apiData.filter(item => item.tipo === 'historico');
  
  console.log('📊 [MAPPING] Tempo real:', tempoReal);
  console.log('📊 [MAPPING] Histórico:', historico.length, 'registros');
  
  // 2. Se tempo real não tem dados válidos, usar primeiro histórico
  const dadosAtuais = (tempoReal && isValidData(tempoReal)) 
    ? tempoReal 
    : historico[0];
  
  const usandoHistorico = !tempoReal || !isValidData(tempoReal);
  if (usandoHistorico) {
    console.log('⚠️ [MAPPING] Dados em tempo real indisponíveis, usando histórico mais recente');
  }
  
  // 3. Extrair valores atuais
  const nivelAtual = parseNumberBR(dadosAtuais?.nivel_atual || '0');
  const volumePercentual = parseNumberBR(dadosAtuais?.volume_percentual || '0');
  const afluencia = parseNumberBR(dadosAtuais?.afluencia || '0');
  const defluencia = parseNumberBR(dadosAtuais?.defluencia || '0');
  
  // 4. Mapear histórico para DamHistoryDay[]
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
  
  // 5. Calcular tendência baseada no histórico
  const tendencia = calcularTendencia(historico);
  
  // 6. Extrair data/hora de atualização
  const dataAtualizacao = dadosAtuais?.data_leitura || new Date().toLocaleDateString('pt-BR');
  
  const mappedData: DamData = {
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
  
  console.log('✅ [MAPPING] Dados mapeados:', mappedData);
  return mappedData;
};

const fetchDamData = async (): Promise<DamData> => {
  const timestamp = new Date().toISOString();
  console.log(`🚀 [FETCH] ${timestamp} - Buscando dados da API...`);
  
  try {
    const response = await fetch('https://n8n.prado.vendopro.com.br/webhook/v1.represa.online', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'no-cache',
    });
    
    console.log(`📡 [FETCH] Status da resposta: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
    }
    
    const responseData = await response.json();
    console.log('📦 [FETCH] Dados brutos da API:', responseData);
    
    // Verificar se é o novo formato (array com campo 'tipo')
    if (Array.isArray(responseData) && responseData.length > 0 && 'tipo' in responseData[0]) {
      console.log('✅ [FETCH] Detectado novo formato da API');
      return mapNewApiDataToDamData(responseData as NewApiResponseItem[]);
    }
    
    // Fallback: se for array sem 'tipo', tentar processar como novo formato mesmo assim
    if (Array.isArray(responseData) && responseData.length > 0) {
      console.log('⚠️ [FETCH] Array sem campo tipo, tentando processar...');
      return mapNewApiDataToDamData(responseData as NewApiResponseItem[]);
    }
    
    throw new Error('Formato de dados não reconhecido');
    
  } catch (error) {
    console.error('❌ [FETCH] Erro ao buscar dados:', error);
    throw error;
  }
};

export const useDamData = () => {
  console.log('🔧 [HOOK] Inicializando hook useDamData');
  
  const query = useQuery({
    queryKey: ['damData', 'production'],
    queryFn: fetchDamData,
    refetchInterval: 5 * 60 * 1000, // Refetch a cada 5 minutos
    staleTime: 2 * 60 * 1000, // Dados ficam fresh por 2 minutos
    retry: 2,
    retryDelay: 3000,
  });

  return query;
};
