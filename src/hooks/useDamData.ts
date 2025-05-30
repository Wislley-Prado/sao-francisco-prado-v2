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
  
  // Tentar diferentes métodos de requisição
  const methods = [
    // Primeiro tentar GET
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    },
    // Se não funcionar, tentar POST sem body
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    },
    // Último recurso: POST com body vazio
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    }
  ];

  for (let i = 0; i < methods.length; i++) {
    try {
      console.log(`Tentativa ${i + 1}: ${methods[i].method}`);
      
      const response = await fetch('https://n8n.prado.vendopro.com.br/webhook/v1.teste.represa.online', {
        ...methods[i],
        mode: 'cors',
        cache: 'no-cache',
      });
      
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        console.log(`HTTP error: ${response.status} - ${response.statusText}`);
        continue; // Tentar próximo método
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
        continue; // Tentar próximo método
      }
      
      // Converter para o formato esperado
      const damData = mapWebhookDataToDamData(webhookData);
      console.log('Mapped dam data:', damData);
      console.log('✅ Dados carregados com sucesso!');
      
      return damData;
      
    } catch (error) {
      console.error(`Erro na tentativa ${i + 1}:`, error);
      if (i === methods.length - 1) {
        // Se foi a última tentativa, lançar o erro
        throw error;
      }
    }
  }
  
  // Se chegou aqui, nenhum método funcionou
  throw new Error('Todos os métodos de requisição falharam');
};

export const useDamData = () => {
  return useQuery({
    queryKey: ['damData'],
    queryFn: fetchDamData,
    refetchInterval: 6 * 60 * 60 * 1000, // Refetch a cada 6 horas
    staleTime: 30 * 60 * 1000, // Dados ficam fresh por 30 minutos
    retry: 1, // Reduzir ainda mais as tentativas
    retryDelay: 5000, // Aumentar delay
    throwOnError: false, // Não lançar erro, usar dados mock em caso de falha
  });
};
