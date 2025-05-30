
import { useQuery } from '@tanstack/react-query';
import { DamData } from '@/types/damData';

// Interface para os dados que vêm do novo webhook (estrutura atualizada)
interface WebhookResponse {
  data_atualizacao?: string;
  hora_atualizacao?: string;
  nivel_atual?: number;
  nivel_atual_metros?: number;
  nivel_maximo_metros?: number;
  nivel_minimo_metros?: number;
  volume_util?: number;
  volume_util_percentual?: number;
  percentual_volume_util?: number;
  afluencia?: {
    valor: number;
    data?: string;
    hora?: string;
    timestamp?: string;
    unidade?: string;
  };
  defluencia?: {
    valor: number;
    data?: string;
    hora?: string;
    timestamp?: string;
    unidade?: string;
  };
  afluencia_m3s?: number;
  defluencia_m3s?: number;
  afluencia_metros_cubicos_por_segundo?: number;
  defluencia_metros_cubicos_por_segundo?: number;
  // Estrutura anterior (para compatibilidade)
  reservatorio?: {
    nome: string;
    nivel_atual: {
      data_hora: string;
      valor: string;
    };
    nivel_maximo: string;
    nivel_minimo: string;
    percentual_volume_util: string;
    afluencia: {
      data_hora: string;
      valor: string;
    };
    defluencia: {
      data_hora: string;
      valor: string;
    };
  };
}

// Função para extrair apenas o número de uma string (remove unidades)
const extractNumber = (value: string | number): string => {
  if (typeof value === 'number') return value.toString();
  if (!value) return '0';
  const match = value.toString().match(/[\d.,]+/);
  return match ? match[0].replace(',', '.') : '0';
};

// Função para converter os dados do webhook para o formato esperado
const mapWebhookDataToDamData = (webhookData: WebhookResponse): DamData => {
  console.log('🔄 [MAPPING] Iniciando mapeamento dos dados do webhook:', webhookData);
  
  // Verificar se é a estrutura nova ou antiga
  if (webhookData.reservatorio) {
    console.log('📋 [MAPPING] Usando estrutura antiga (reservatorio)');
    const { reservatorio } = webhookData;
    const dateTimeParts = reservatorio.nivel_atual.data_hora.split(' - ');
    
    const mappedData = {
      nivel_atual: extractNumber(reservatorio.percentual_volume_util),
      volume_util_percentual: extractNumber(reservatorio.percentual_volume_util),
      afluencia: extractNumber(reservatorio.afluencia.valor),
      defluencia: extractNumber(reservatorio.defluencia.valor),
      data_atualizacao: dateTimeParts[0] || '',
      hora_atualizacao: dateTimeParts[1] || '',
      historico_dias: []
    };
    
    console.log('✅ [MAPPING] Dados mapeados (estrutura antiga):', mappedData);
    return mappedData;
  } else {
    console.log('📋 [MAPPING] Usando estrutura nova (direta)');
    
    // Estrutura nova (direta) - verificar todos os possíveis campos
    const volumePercentual = webhookData.volume_util_percentual || 
                           webhookData.percentual_volume_util || 
                           webhookData.volume_util || 0;
    
    // Buscar afluencia em todas as possíveis estruturas
    const afluenciaValor = webhookData.afluencia?.valor || 
                          webhookData.afluencia_m3s || 
                          webhookData.afluencia_metros_cubicos_por_segundo || 0;
    
    // Buscar defluencia em todas as possíveis estruturas  
    const defluenciaValor = webhookData.defluencia?.valor || 
                           webhookData.defluencia_m3s ||
                           webhookData.defluencia_metros_cubicos_por_segundo || 0;
    
    console.log('🔍 [MAPPING] Valores extraídos:', {
      volumePercentual,
      afluenciaValor,
      defluenciaValor,
      data_atualizacao: webhookData.data_atualizacao,
      hora_atualizacao: webhookData.hora_atualizacao
    });
    
    const mappedData = {
      nivel_atual: extractNumber(volumePercentual),
      volume_util_percentual: extractNumber(volumePercentual),
      afluencia: extractNumber(afluenciaValor),
      defluencia: extractNumber(defluenciaValor),
      data_atualizacao: webhookData.data_atualizacao || '',
      hora_atualizacao: webhookData.hora_atualizacao || '',
      historico_dias: []
    };
    
    console.log('✅ [MAPPING] Dados mapeados (estrutura nova):', mappedData);
    return mappedData;
  }
};

const fetchDamData = async (): Promise<DamData> => {
  const timestamp = new Date().toISOString();
  console.log(`🚀 [FETCH] ${timestamp} - Iniciando busca de dados do webhook...`);
  
  try {
    const response = await fetch('https://n8n.prado.vendopro.com.br/webhook/v1.teste.represa.online', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
      cache: 'no-cache',
    });
    
    console.log(`📡 [FETCH] Status da resposta: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
    }
    
    const responseData = await response.json();
    console.log('📦 [FETCH] Dados brutos recebidos:', responseData);
    
    // Extrair os dados da estrutura correta
    let webhookData: WebhookResponse;
    
    if (Array.isArray(responseData) && responseData.length > 0) {
      console.log('🔄 [FETCH] Resposta é um array, extraindo primeiro item...');
      const firstItem = responseData[0];
      if (firstItem?.message?.content) {
        webhookData = firstItem.message.content;
        console.log('📋 [FETCH] Dados extraídos de message.content:', webhookData);
      } else {
        webhookData = firstItem;
        console.log('📋 [FETCH] Dados extraídos do primeiro item:', webhookData);
      }
    } else {
      webhookData = responseData;
      console.log('📋 [FETCH] Dados extraídos diretamente:', webhookData);
    }
    
    // Converter para o formato esperado
    const damData = mapWebhookDataToDamData(webhookData);
    console.log('✅ [FETCH] Dados finais processados:', damData);
    console.log(`🎉 [FETCH] ${timestamp} - Busca concluída com sucesso!`);
    
    return damData;
    
  } catch (error) {
    console.error('❌ [FETCH] Erro ao buscar dados:', error);
    throw error;
  }
};

export const useDamData = () => {
  console.log('🔧 [HOOK] Inicializando hook useDamData');
  
  const query = useQuery({
    queryKey: ['damData'],
    queryFn: fetchDamData,
    refetchInterval: 6 * 60 * 60 * 1000, // Refetch a cada 6 horas
    staleTime: 30 * 60 * 1000, // Dados ficam fresh por 30 minutos
    retry: 1,
    retryDelay: 5000,
    throwOnError: false, // Não lançar erro, usar dados mock em caso de falha
    onSuccess: (data) => {
      console.log('🎊 [HOOK] onSuccess - Dados carregados com sucesso:', data);
    },
    onError: (error) => {
      console.error('💥 [HOOK] onError - Erro no hook:', error);
    },
    onSettled: (data, error) => {
      console.log('🏁 [HOOK] onSettled - Query finalizada', { data, error });
    }
  });

  console.log('📊 [HOOK] Estado atual do query:', {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    isSuccess: query.isSuccess,
    data: query.data,
    error: query.error,
    dataUpdatedAt: new Date(query.dataUpdatedAt).toISOString()
  });

  return query;
};
