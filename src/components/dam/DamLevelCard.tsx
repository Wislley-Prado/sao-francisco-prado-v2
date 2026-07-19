import React, { useMemo, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Droplets } from 'lucide-react';
import { DamData } from '@/types/damData';
import { getStatusFromLevel } from '@/utils/damStatus';

// Lazy load recharts to avoid 224KB eager load
const LazyChart = React.lazy(() => import('./DamLevelChart'));

interface DamLevelCardProps {
  damData: DamData | undefined;
  dataUpdatedAt: number;
  renderCount: number;
}

const DamLevelCard: React.FC<DamLevelCardProps> = ({
  damData,
  dataUpdatedAt,
  renderCount
}) => {
  const currentLevel = damData?.volume_util_percentual ? parseFloat(damData.volume_util_percentual) : 82;
  const nivelAtualMetros = damData?.nivel_atual ? parseFloat(damData.nivel_atual) : 569.8;
  const levelStatus = getStatusFromLevel(currentLevel);

  const trendData = useMemo(() => {
    if (!damData?.historico_dias || damData.historico_dias.length === 0) {
      return [];
    }

    const parseTs = (str: string) => {
      if (!str) return 0;
      const cleanStr = str.split('T')[0].trim();
      if (cleanStr.includes('-')) {
        const parts = cleanStr.split('-').map(Number);
        if (parts.length === 3 && !parts.some(isNaN)) {
          return parts[0] > 1900 
            ? new Date(parts[0], parts[1] - 1, parts[2]).getTime() 
            : new Date(parts[2], parts[1] - 1, parts[0]).getTime();
        }
      }
      if (cleanStr.includes('/')) {
        const parts = cleanStr.split('/').map(Number);
        if (parts.length === 3 && !parts.some(isNaN)) {
          return parts[2] > 1900 
            ? new Date(parts[2], parts[1] - 1, parts[0]).getTime() 
            : new Date(parts[0], parts[1] - 1, parts[2]).getTime();
        }
      }
      const t = new Date(cleanStr).getTime();
      return isNaN(t) ? 0 : t;
    };

    const sortedData = [...damData.historico_dias]
      .sort((a, b) => parseTs(a.dia || a.data_original) - parseTs(b.dia || b.data_original));

    const last9Days = sortedData.slice(-9);

    return last9Days.map((dia) => {
      const parts = dia.dia ? dia.dia.split('T')[0].split('-') : [];
      const dataFormatada = parts.length === 3 ? `${parts[2]}/${parts[1]}` : (dia.data_original ? dia.data_original.slice(0, 5) : dia.dia);
      
      return {
        time: dataFormatada,
        nivel: parseFloat(dia.vol_util_final) || 0,
        afluencia: parseFloat(dia.vazao_afl) || 0,
        defluencia: parseFloat(dia.vazao_def) || 0,
        dataCompleta: dia.dia
      };
    });
  }, [damData?.historico_dias]);

  return (
    <Card className="h-full border-0 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-base sm:text-lg">
          <div className="flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <span>Nível da Represa</span>
          </div>
          <Badge className={`${levelStatus.color} text-white text-xs sm:text-sm`}>
            {levelStatus.text}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              {nivelAtualMetros.toFixed(1)}m
            </div>
            <div className="text-sm text-gray-600 mb-3">
              Cota atual: {nivelAtualMetros.toFixed(1)} metros
            </div>
            
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
              {currentLevel.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mb-3">Volume útil</div>
            
            <Progress value={currentLevel} className="h-3 mb-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DamLevelCard;
