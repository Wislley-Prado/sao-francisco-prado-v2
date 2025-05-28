
import React from 'react';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { DamData } from '@/types/damData';

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
      
      <div className="flex items-center justify-center mt-4 space-x-2">
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
    </div>
  );
};

export default DamHeader;
