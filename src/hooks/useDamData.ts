
import { useQuery } from '@tanstack/react-query';
import { DamData } from '@/types/damData';

const fetchDamData = async (): Promise<DamData> => {
  console.log('Fetching dam data from test webhook...');
  const response = await fetch('https://n8n.prado.vendopro.com.br/webhook-test/represatresmarias', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}), // Enviando um body vazio para o POST
  });
  
  if (!response.ok) {
    throw new Error('Erro ao buscar dados da represa');
  }
  
  const data = await response.json();
  console.log('Dam data received:', data);
  return data;
};

export const useDamData = () => {
  return useQuery({
    queryKey: ['damData'],
    queryFn: fetchDamData,
    refetchInterval: 6 * 60 * 60 * 1000, // Refetch a cada 6 horas
    staleTime: 30 * 60 * 1000, // Dados ficam fresh por 30 minutos
  });
};
