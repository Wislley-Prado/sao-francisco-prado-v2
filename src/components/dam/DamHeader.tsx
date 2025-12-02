
import React from 'react';
import { RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { DamData } from '@/types/damData';
import { Badge } from '@/components/ui/badge';

interface DamHeaderProps {
  damData: DamData | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const DamHeader: React.FC<DamHeaderProps> = ({ damData, isLoading, error, refetch }) => {
  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Informações da Represa de Três Marias
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Dados em tempo real para planejamento da sua pescaria. 
        Informações atualizadas automaticamente.
      </p>
      
      <div className="flex flex-col items-center justify-center mt-4 gap-2">
        <div className="flex items-center space-x-2">
          {isLoading && (
            <>
              <RefreshCw className="h-4 w-4 animate-spin text-rio-blue" />
              <span className="text-sm text-rio-blue">Carregando dados...</span>
            </>
          )}
          {error && (
            <>
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-500">Erro ao carregar dados</span>
              <button 
                onClick={() => refetch()} 
                className="text-sm text-rio-blue hover:underline"
              >
                Tentar novamente
              </button>
            </>
          )}
          {damData && !isLoading && (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">Dados atualizados</span>
            </>
          )}
        </div>
        
        {/* Indicador de dados históricos */}
        {damData?.usando_dados_historicos && !isLoading && (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Dados em tempo real indisponíveis - exibindo último registro ({damData.data_atualizacao})
          </Badge>
        )}
      </div>
    </div>
  );
};

export default DamHeader;
