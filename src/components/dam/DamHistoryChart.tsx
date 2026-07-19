
import React, { useMemo, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { DamData } from '@/types/damData';

// Lazy load the actual chart component with recharts
const LazyHistoryCharts = React.lazy(() => import('./DamHistoryCharts'));

interface DamHistoryChartProps {
  damData: DamData | undefined;
}

// Converter string de data para timestamp sem sofre alteração de fuso horário UTC ou NaN
const parseDateToTimestamp = (dateStr: string): number => {
  if (!dateStr) return 0;
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return new Date(y, m - 1, d).getTime();
    }
  }
  if (dateStr.includes('/')) {
    const [d, m, y] = dateStr.split('/').map(Number);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return new Date(y, m - 1, d).getTime();
    }
  }
  return 0;
};

const DamHistoryChart: React.FC<DamHistoryChartProps> = ({ damData }) => {
  const chartData = useMemo(() => {
    if (!damData?.historico_dias || damData.historico_dias.length === 0) {
      return [];
    }

    const sortedData = [...damData.historico_dias]
      .sort((a, b) => parseDateToTimestamp(a.dia || a.data_original) - parseDateToTimestamp(b.dia || b.data_original))
      .slice(-7);

    return sortedData.map(dia => {
      let formattedDate = dia.data_original ? dia.data_original.slice(0, 5) : dia.dia;
      if (dia.dia && dia.dia.includes('-')) {
        const parts = dia.dia.split('-');
        if (parts.length === 3) {
          formattedDate = `${parts[2]}/${parts[1]}`;
        }
      }
      return {
        data: formattedDate,
        dataCompleta: dia.dia || dia.data_original,
        nivel: parseFloat(dia.vol_util_final) || 0,
        cota: parseFloat(dia.cota_final) || 0,
        afluencia: parseFloat(dia.vazao_afl) || 0,
        defluencia: parseFloat(dia.vazao_def) || 0,
      };
    });
  }, [damData?.historico_dias]);

  const nivelVariacao = useMemo(() => {
    if (chartData.length < 2) return { valor: 0, tipo: 'estável' };
    const primeiro = chartData[0].nivel;
    const ultimo = chartData[chartData.length - 1].nivel;
    const variacao = ultimo - primeiro;
    return {
      valor: Math.abs(variacao).toFixed(1),
      tipo: variacao > 0.3 ? 'subindo' : variacao < -0.3 ? 'descendo' : 'estável'
    };
  }, [chartData]);

  const getTrendIcon = () => {
    switch (nivelVariacao.tipo) {
      case 'subindo': return <TrendingUp className="h-4 w-4" />;
      case 'descendo': return <TrendingDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    switch (nivelVariacao.tipo) {
      case 'subindo': return 'bg-green-100 text-green-700 border-green-300';
      case 'descendo': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="pb-2 p-3 sm:p-6">
        <CardTitle className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <span className="text-base sm:text-lg">Evolução da Represa</span>
          </div>
          <Badge variant="outline" className={`gap-1.5 text-xs ${getTrendColor()}`}>
            {getTrendIcon()}
            {nivelVariacao.tipo === 'estável' 
              ? 'Estável' 
              : `${nivelVariacao.tipo === 'subindo' ? '+' : '-'}${nivelVariacao.valor}%`
            }
          </Badge>
        </CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Últimos {chartData.length} dias de monitoramento
        </p>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
        <Suspense fallback={<div className="h-44 sm:h-56 flex items-center justify-center text-xs sm:text-sm text-muted-foreground">Carregando gráficos...</div>}>
          <LazyHistoryCharts chartData={chartData} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default DamHistoryChart;
