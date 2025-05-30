
import { useQuery } from '@tanstack/react-query';
import { DamData } from '@/types/damData';

const fetchDamData = async (): Promise<DamData> => {
  console.log('Fetching dam data from new webhook...');
  const response = await fetch('https://n8n.prado.vendopro.com.br/webhook/teste.represa', {
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
  
  // Extrair e fazer parse do campo 'output' que contém o JSON como string
  if (!responseData.output) {
    throw new Error('Campo output não encontrado na resposta');
  }
  
  const damData = JSON.parse(responseData.output);
  console.log('Parsed dam data:', damData);
  
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
