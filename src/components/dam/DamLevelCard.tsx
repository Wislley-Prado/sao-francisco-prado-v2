
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

    const sortedData = [...damData.historico_dias]
      .sort((a, b) => new Date(a.dia).getTime() - new Date(b.dia).getTime());

    const last7Days = sortedData.slice(-7);

    return last7Days.map((dia) => {
      const dataFormatada = new Date(dia.dia).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
      
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
          
          {trendData.length > 0 && (
            <Suspense fallback={<div className="h-24 sm:h-32 flex items-center justify-center text-sm text-muted-foreground">Carregando gráfico...</div>}>
              <LazyChart trendData={trendData} dataUpdatedAt={dataUpdatedAt} renderCount={renderCount} />
            </Suspense>
          )}

          {trendData.length === 0 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Aguardando dados históricos...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DamLevelCard;
