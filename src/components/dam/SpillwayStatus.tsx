
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Waves, AlertTriangle, Info } from 'lucide-react';
import { analyzeSpillwayStatus, getSpillwayRecommendation } from '@/utils/spillwayUtils';

interface SpillwayStatusProps {
  defluencia: string;
}

const SpillwayStatus: React.FC<SpillwayStatusProps> = ({ defluencia }) => {
  const spillwayStatus = analyzeSpillwayStatus(defluencia);
  const recommendation = getSpillwayRecommendation(spillwayStatus);
  
  const getAlertVariant = () => {
    if (spillwayStatus.level === 'critical' || spillwayStatus.level === 'high') {
      return 'destructive';
    }
    return 'default';
  };

  const getIcon = () => {
    if (spillwayStatus.level === 'critical' || spillwayStatus.level === 'high') {
      return <AlertTriangle className="h-4 w-4" />;
    }
    return <Info className="h-4 w-4" />;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="flex items-center">
          <Waves className="mr-2 h-5 w-5" />
          Status do Vertedouro
        </CardTitle>
        <p className="text-blue-100 text-sm">
          Informações sobre liberação de água
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Status Principal */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Status Atual</h4>
              <p className="text-2xl font-bold text-gray-900">
                {parseFloat(defluencia).toFixed(1)} m³/s
              </p>
            </div>
            <Badge className={`${spillwayStatus.color} text-white text-sm px-3 py-1`}>
              {spillwayStatus.description}
            </Badge>
          </div>

          {/* Explicação */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Defluência:</strong> Volume de água que sai da represa, incluindo turbinas e vertedouro.
            </p>
          </div>

          {/* Status em linguagem simples */}
          <Alert variant={getAlertVariant()}>
            {getIcon()}
            <AlertDescription>
              <strong>{spillwayStatus.message}</strong>
            </AlertDescription>
          </Alert>

          {/* Recomendações para pesca */}
          <div className="bg-green-50 p-3 rounded-lg">
            <h5 className="font-medium text-green-800 mb-1">Impacto na Pesca</h5>
            <p className="text-sm text-green-700">{recommendation}</p>
          </div>

          {/* Indicador visual */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Fechado</span>
              <span>Moderado</span>
              <span>Intenso</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${spillwayStatus.color}`}
                style={{ 
                  width: `${Math.min(100, Math.max(10, (parseFloat(defluencia) / 400) * 100))}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpillwayStatus;
