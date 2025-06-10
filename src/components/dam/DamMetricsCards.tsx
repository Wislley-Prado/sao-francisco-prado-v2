
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { DamData } from '@/types/damData';

interface DamMetricsCardsProps {
  damData: DamData | undefined;
}

const DamMetricsCards: React.FC<DamMetricsCardsProps> = ({ damData }) => {
  const afluencia = damData?.afluencia || '134';
  const defluencia = damData?.defluencia || '310';
  const tendencia = damData?.tendencia_represa || 'estável';

  // Determinar ícone da tendência
  const getTendenciaIcon = () => {
    const tendenciaLower = tendencia.toLowerCase();
    if (tendenciaLower.includes('subindo') || tendenciaLower.includes('enchendo')) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (tendenciaLower.includes('descendo') || tendenciaLower.includes('baixando')) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Activity className="h-4 w-4 text-blue-500" />;
  };

  const getTendenciaColor = () => {
    const tendenciaLower = tendencia.toLowerCase();
    if (tendenciaLower.includes('subindo') || tendenciaLower.includes('enchendo')) {
      return 'text-green-600 bg-green-50 border-green-200';
    } else if (tendenciaLower.includes('descendo') || tendenciaLower.includes('baixando')) {
      return 'text-red-600 bg-red-50 border-red-200';
    }
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  return (
    <div className="space-y-4">
      {/* Tendência da Represa */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getTendenciaIcon()}
              <span className="text-sm font-medium text-gray-700">Tendência</span>
            </div>
          </div>
          <div className="mt-2">
            <Badge className={`${getTendenciaColor()} border px-2 py-1 text-sm capitalize`}>
              {tendencia}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Afluência */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Afluência</span>
            </div>
            <div className="text-xs text-gray-500">m³/s</div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{afluencia}</div>
        </CardContent>
      </Card>

      {/* Defluência */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">Defluência</span>
            </div>
            <div className="text-xs text-gray-500">m³/s</div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{defluencia}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DamMetricsCards;
