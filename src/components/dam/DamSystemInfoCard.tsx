
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { DamData } from '@/types/damData';

interface DamSystemInfoCardProps {
  damData: DamData | undefined;
  isLoading: boolean;
  error: Error | null;
  dataUpdatedAt: number;
  renderCount: number;
}

const DamSystemInfoCard: React.FC<DamSystemInfoCardProps> = ({
  damData,
  isLoading,
  error,
  dataUpdatedAt,
  renderCount
}) => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>Status do Sistema</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Última atualização:</span>
          <span className="font-medium text-xs sm:text-sm">
            {new Date(dataUpdatedAt).toLocaleTimeString('pt-BR')}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Renders:</span>
          <Badge variant="outline">{renderCount}</Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Status da API:</span>
          <div className="flex items-center space-x-1">
            {error ? (
              <>
                <AlertCircle className="h-3 w-3 text-red-500" />
                <span className="text-red-600">Erro</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-green-600">OK</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Carregando:</span>
          <Badge variant={isLoading ? "default" : "outline"}>
            {isLoading ? "Sim" : "Não"}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Dados históricos:</span>
          <Badge variant="outline">
            {damData?.historico_dias?.length || 0} dias
          </Badge>
        </div>

        {damData && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Data:</span>
              <span className="font-medium text-xs sm:text-sm">{damData.data_atualizacao}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Hora:</span>
              <span className="font-medium text-xs sm:text-sm">{damData.hora_atualizacao}</span>
            </div>
          </>
        )}

        {error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            {error.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DamSystemInfoCard;
