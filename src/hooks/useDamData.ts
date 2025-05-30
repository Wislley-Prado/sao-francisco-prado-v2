
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
    afluencia: extractNumber(webhookData?.reservatorio?.afluencia?.valor || '0'),
    defluencia: extractNumber(webhookData?.reservatorio?.defluencia?.valor || '0'),
    data_atualizacao: dataAtualizacao,
    hora_atualizacao: horaAtualizacao,
    historico_dias: [] // Por enquanto vazio, pode ser implementado depois
  };
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
    
    // Verificar se temos os dados necessários (agora tudo está dentro de reservatorio)
    if (!webhookData?.reservatorio) {
      console.error('Dados incompletos recebidos - reservatorio não encontrado:', webhookData);
      throw new Error('Estrutura de dados inválida: reservatorio não encontrado');
    }
    
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
