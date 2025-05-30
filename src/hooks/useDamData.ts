
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
  const match = value.match(/[\d.,]+/);
  return match ? match[0].replace(',', '.') : '0';
};

// Função para separar data e hora
const separateDateAndTime = (dateTimeString: string) => {
  const parts = dateTimeString.split(' - ');
  return {
    date: parts[0] || '',
    time: parts[1] || ''
  };
};

// Função para converter os dados do webhook para o formato esperado
const mapWebhookDataToDamData = (webhookData: WebhookResponse): DamData => {
  const { date: dataAtualizacao, time: horaAtualizacao } = separateDateAndTime(
    webhookData.reservatorio.nivel_atual.data_hora
  );

  return {
    nivel_atual: extractNumber(webhookData.reservatorio.percentual_volume_util),
    volume_util_percentual: extractNumber(webhookData.reservatorio.percentual_volume_util),
    afluencia: extractNumber(webhookData.hidreletrica.afluencia.valor),
    defluencia: extractNumber(webhookData.hidreletrica.defluencia.valor),
    data_atualizacao: dataAtualizacao,
    hora_atualizacao: horaAtualizacao,
    historico_dias: [] // Por enquanto vazio, pode ser implementado depois
  };
};

const fetchDamData = async (): Promise<DamData> => {
  console.log('Fetching dam data from production webhook URL...');
  const response = await fetch('https://n8n.prado.vendopro.com.br/webhook/v1.teste.represa.online', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  
  if (!response.ok) {
    throw new Error('Erro ao buscar dados da represa');
  }
  
  const responseData = await response.json();
  console.log('Raw webhook response:', responseData);
  
  // Os dados agora vêm direto, sem o campo 'output'
  const webhookData = responseData[0]?.message?.role === 'assistant' ? 
    responseData[0].message.content : responseData;
    
  console.log('Extracted webhook data:', webhookData);
  
  // Converter para o formato esperado
  const damData = mapWebhookDataToDamData(webhookData);
  console.log('Mapped dam data:', damData);
  
  return damData;
};

export const useDamData = () => {
  return useQuery({
    queryKey: ['damData'],
    queryFn: fetchDamData,
    refetchInterval: 6 * 60 * 60 * 1000, // Refetch a cada 6 horas
    staleTime: 30 * 60 * 1000, // Dados ficam fresh por 30 minutos
  });
};
