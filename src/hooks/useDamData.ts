
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { DamData } from '@/types/damData';

// Interface para os dados que vêm da nova API de produção
interface ProductionApiResponse {
  nivel_atual?: string;
  volume_util_percentual?: string;
  afluencia?: string;
  defluencia?: string;
  'Tendencia_da_represa '?: string;
  dados_painel?: {
    timestamp_atualizacao?: string;
  };
  historico_dias?: string;
}

// Função para converter o histórico de string JSON para array
const parseHistoricoDias = (historicoString: string | undefined) => {
  if (!historicoString) return [];
  try {
    return JSON.parse(historicoString);
  } catch (error) {
    console.error('❌ [PARSE] Erro ao fazer parse do histórico:', error);
    return [];
  }
};

// Função para extrair data e hora do timestamp
const extractDateTimeFromTimestamp = (timestamp: string | undefined) => {
  if (!timestamp) {
    const now = new Date();
    return {
      data_atualizacao: now.toLocaleDateString('pt-BR'),
      hora_atualizacao: now.toLocaleTimeString('pt-BR')
    };
  }
  
  try {
    const date = new Date(timestamp);
    return {
      data_atualizacao: date.toLocaleDateString('pt-BR'),
      hora_atualizacao: date.toLocaleTimeString('pt-BR')
    };
  } catch (error) {
    console.error('❌ [TIMESTAMP] Erro ao processar timestamp:', error);
    const now = new Date();
    return {
      data_atualizacao: now.toLocaleDateString('pt-BR'),
      hora_atualizacao: now.toLocaleTimeString('pt-BR')
    };
  }
};

// Função para converter os dados da API de produção para o formato esperado
const mapProductionDataToDamData = (productionData: ProductionApiResponse): DamData => {
  console.log('🔄 [MAPPING] Mapeando dados da API de produção:', productionData);
  
  const { data_atualizacao, hora_atualizacao } = extractDateTimeFromTimestamp(
    productionData.dados_painel?.timestamp_atualizacao
  );
  
  const historicoDias = parseHistoricoDias(productionData.historico_dias);
  
  const mappedData = {
    nivel_atual: productionData.nivel_atual || '0',
    volume_util_percentual: productionData.volume_util_percentual || '0',
    afluencia: productionData.afluencia || '0',
    defluencia: productionData.defluencia || '0',
    data_atualizacao,
    hora_atualizacao,
    historico_dias: historicoDias,
    // Campos adicionais da nova estrutura
    tendencia_represa: productionData['Tendencia_da_represa ']?.trim() || 'estável',
    timestamp_atualizacao: productionData.dados_painel?.timestamp_atualizacao
  };
  
  console.log('✅ [MAPPING] Dados mapeados da produção:', mappedData);
  return mappedData;
};

const fetchDamData = async (): Promise<DamData> => {
  const timestamp = new Date().toISOString();
  console.log(`🚀 [FETCH] ${timestamp} - Buscando dados da API de produção...`);
  
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
    console.log('📦 [FETCH] Dados brutos da API de produção:', responseData);
    
    // A resposta é um array, pegar o primeiro item
    let productionData: ProductionApiResponse;
    
    if (Array.isArray(responseData) && responseData.length > 0) {
      productionData = responseData[0];
      console.log('📋 [FETCH] Dados extraídos do array:', productionData);
    } else {
      productionData = responseData;
      console.log('📋 [FETCH] Dados diretos:', productionData);
    }
    
    // Converter para o formato esperado
    const damData = mapProductionDataToDamData(productionData);
    console.log('✅ [FETCH] Dados finais processados:', damData);
    console.log(`🎉 [FETCH] ${timestamp} - Busca da produção concluída com sucesso!`);
    
    return damData;
    
  } catch (error) {
    console.error('❌ [FETCH] Erro ao buscar dados da produção:', error);
    throw error;
  }
};

export const useDamData = () => {
  console.log('🔧 [HOOK] Inicializando hook useDamData para produção');
  
  const query = useQuery({
    queryKey: ['damData', 'production'],
    queryFn: fetchDamData,
    refetchInterval: 5 * 60 * 1000, // Refetch a cada 5 minutos
    staleTime: 2 * 60 * 1000, // Dados ficam fresh por 2 minutos
    retry: 2,
    retryDelay: 3000,
    throwOnError: false,
  });

  // Use useEffect for success/error logging instead of deprecated callbacks
  useEffect(() => {
    if (query.isSuccess && query.data) {
      console.log('🎊 [HOOK] Query Success - Dados da produção carregados:', query.data);
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError && query.error) {
      console.error('💥 [HOOK] Query Error - Erro no hook da produção:', query.error);
    }
  }, [query.isError, query.error]);

  useEffect(() => {
    console.log('🏁 [HOOK] Query Status Changed - Status da produção:', { 
      data: query.data, 
      error: query.error,
      status: query.status 
    });
  }, [query.status, query.data, query.error]);

  console.log('📊 [HOOK] Estado atual do query da produção:', {
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
