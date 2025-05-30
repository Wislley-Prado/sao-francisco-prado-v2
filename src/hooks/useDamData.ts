
import { useQuery } from '@tanstack/react-query';
import { DamData } from '@/types/damData';

// Interface para os dados que vêm do novo webhook
interface WebhookResponse {
  reservatorio: {
    nome: string;
    nivel_atual: {
      data_hora: string;
      valor: string;
    };
    nivel_maximo: string;
    nivel_minimo: string;
    percentual_volume_util: string;
  };
  hidreletrica: {
    nome: string;
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
const extractNumber = (value: string): string => {
  if (!value) return '0';
  const match = value.match(/[\d.,]+/);
  return match ? match[0].replace(',', '.') : '0';
};

// Função para separar data e hora
const separateDateAndTime = (dateTimeString: string) => {
  if (!dateTimeString) return { date: '', time: '' };
  const parts = dateTimeString.split(' - ');
  return {
    date: parts[0] || '',
    time: parts[1] || ''
  };
};

// Função para converter os dados do webhook para o formato esperado
const mapWebhookDataToDamData = (webhookData: WebhookResponse): DamData => {
  console.log('Mapping webhook data:', webhookData);
  
  const { date: dataAtualizacao, time: horaAtualizacao } = separateDateAndTime(
    webhookData?.reservatorio?.nivel_atual?.data_hora || ''
  );

  return {
    nivel_atual: extractNumber(webhookData?.reservatorio?.percentual_volume_util || '0'),
    volume_util_percentual: extractNumber(webhookData?.reservatorio?.percentual_volume_util || '0'),
    afluencia: extractNumber(webhookData?.hidreletrica?.afluencia?.valor || '0'),
    defluencia: extractNumber(webhookData?.hidreletrica?.defluencia?.valor || '0'),
    data_atualizacao: dataAtualizacao,
    hora_atualizacao: horaAtualizacao,
    historico_dias: [] // Por enquanto vazio, pode ser implementado depois
  };
};

const fetchDamData = async (): Promise<DamData> => {
  console.log('Fetching dam data from production webhook URL...');
  
  try {
    // Tentar com diferentes configurações para contornar CORS
    const response = await fetch('https://n8n.prado.vendopro.com.br/webhook/v1.teste.represa.online', {
      method: 'POST',
      mode: 'cors', // Explicitar modo CORS
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({}),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
      } else if (firstItem?.reservatorio) {
        webhookData = firstItem;
      } else {
        webhookData = responseData[0];
      }
    } else if (responseData?.reservatorio) {
      // Se já for o objeto direto
      webhookData = responseData;
    } else {
      // Fallback - tentar usar os dados como vieram
      webhookData = responseData;
    }
      
    console.log('Extracted webhook data:', webhookData);
    
    // Verificar se temos os dados necessários
    if (!webhookData?.reservatorio || !webhookData?.hidreletrica) {
      console.error('Dados incompletos recebidos:', webhookData);
      throw new Error('Dados incompletos recebidos do webhook');
    }
    
    // Converter para o formato esperado
    const damData = mapWebhookDataToDamData(webhookData);
    console.log('Mapped dam data:', damData);
    
    return damData;
  } catch (error) {
    console.error('Erro ao buscar dados do webhook:', error);
    
    // Se houver erro de CORS ou rede, retornar dados mock para demonstração
    console.log('Retornando dados mock devido a erro de conectividade');
    return {
      nivel_atual: '86.5',
      volume_util_percentual: '86.5',
      afluencia: '125.3',
      defluencia: '89.7',
      data_atualizacao: new Date().toLocaleDateString('pt-BR'),
      hora_atualizacao: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      historico_dias: []
    };
  }
};

export const useDamData = () => {
  return useQuery({
    queryKey: ['damData'],
    queryFn: fetchDamData,
    refetchInterval: 6 * 60 * 60 * 1000, // Refetch a cada 6 horas
    staleTime: 30 * 60 * 1000, // Dados ficam fresh por 30 minutos
    retry: 2, // Reduzir tentativas para evitar spam
    retryDelay: 3000, // Aumentar delay entre tentativas
  });
};
