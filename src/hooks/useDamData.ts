
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
  console.log('Mapping webhook data:', webhookData);
  
  // Verificar se é a estrutura nova ou antiga
  if (webhookData.reservatorio) {
    // Estrutura antiga com reservatorio
    const { reservatorio } = webhookData;
    const dateTimeParts = reservatorio.nivel_atual.data_hora.split(' - ');
    
    return {
      nivel_atual: extractNumber(reservatorio.percentual_volume_util),
      volume_util_percentual: extractNumber(reservatorio.percentual_volume_util),
      afluencia: extractNumber(reservatorio.afluencia.valor),
      defluencia: extractNumber(reservatorio.defluencia.valor),
      data_atualizacao: dateTimeParts[0] || '',
      hora_atualizacao: dateTimeParts[1] || '',
      historico_dias: []
    };
  } else {
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
    
    console.log('Extracted values:', {
      volumePercentual,
      afluenciaValor,
      defluenciaValor
    });
    
    return {
      nivel_atual: extractNumber(volumePercentual),
      volume_util_percentual: extractNumber(volumePercentual),
      afluencia: extractNumber(afluenciaValor),
      defluencia: extractNumber(defluenciaValor),
      data_atualizacao: webhookData.data_atualizacao || '',
      hora_atualizacao: webhookData.hora_atualizacao || '',
      historico_dias: []
    };
  }
};

const fetchDamData = async (): Promise<DamData> => {
  console.log('Fetching dam data from production webhook URL...');
  
  try {
    const response = await fetch('https://n8n.prado.vendopro.com.br/webhook/v1.teste.represa.online', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
      cache: 'no-cache',
    });
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
    }
    
    const responseData = await response.json();
    console.log('Raw webhook response:', responseData);
    
    // Extrair os dados da estrutura correta
    let webhookData: WebhookResponse;
    
    if (Array.isArray(responseData) && responseData.length > 0) {
      // Se for um array, pegar o primeiro item e extrair o content
      const firstItem = responseData[0];
      if (firstItem?.message?.content) {
        webhookData = firstItem.message.content;
      } else {
        webhookData = firstItem;
      }
    } else {
      webhookData = responseData;
    }
      
    console.log('Extracted webhook data:', webhookData);
    
    // Converter para o formato esperado
    const damData = mapWebhookDataToDamData(webhookData);
    console.log('Mapped dam data:', damData);
    console.log('✅ Dados carregados com sucesso!');
    
    return damData;
    
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    throw error;
  }
};

export const useDamData = () => {
  return useQuery({
    queryKey: ['damData'],
    queryFn: fetchDamData,
    refetchInterval: 6 * 60 * 60 * 1000, // Refetch a cada 6 horas
    staleTime: 30 * 60 * 1000, // Dados ficam fresh por 30 minutos
    retry: 1,
    retryDelay: 5000,
    throwOnError: false, // Não lançar erro, usar dados mock em caso de falha
  });
};
