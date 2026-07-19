
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Droplets, TrendingUp, Activity, RefreshCw } from 'lucide-react';
import { useDamData } from '@/hooks/useDamData';
import { getStatusFromLevel } from '@/utils/damStatus';
import { Condition } from '@/types/damData';
import DamHeader from './dam/DamHeader';
import ConditionsGrid from './dam/ConditionsGrid';
import HistoryTable from './dam/HistoryTable';
import DamDashboard from './dam/DamDashboard';
import DamHistoryChart from './dam/DamHistoryChart';

const DamInfo = () => {
  const { data: damData, isLoading, error, refetch, dataUpdatedAt } = useDamData();
  const renderCount = useRef(0);
  renderCount.current += 1;

  const nivelAtualMetros = damData?.nivel_atual ? parseFloat(damData.nivel_atual) : 569.8;
  const volumePercentual = damData?.volume_util_percentual ? parseFloat(damData.volume_util_percentual) : 82;
  const afluencia = damData?.afluencia || '--';
  const defluencia = damData?.defluencia || '--';

  const levelStatus = getStatusFromLevel(volumePercentual);

  const conditions: Condition[] = [
    {
      label: "Nível da Represa",
      value: `${nivelAtualMetros.toFixed(1)}m`,
      status: levelStatus.status,
      icon: <Droplets className="h-5 w-5" />,
      trend: "stable"
    },
    {
      label: "Volume Útil",
      value: `${volumePercentual.toFixed(1)}%`,
      status: levelStatus.status,
      icon: <TrendingUp className="h-5 w-5" />,
      trend: "stable"
    },
    {
      label: "Afluência",
      value: `${afluencia} m³/s`,
      status: "good",
      icon: <Activity className="h-5 w-5" />,
      trend: "stable"
    },
    {
      label: "Defluência",
      value: `${defluencia} m³/s`,
      status: "good",
      icon: <Activity className="h-5 w-5" />,
      trend: "stable"
    }
  ];

  const handleRefetch = () => {
    refetch();
  };

  const errorForComponents = error instanceof Error ? error : new Error('Unknown error occurred');

  return (
    <section id="represa" className="py-10 sm:py-16 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <DamHeader 
          damData={damData}
          isLoading={isLoading}
          error={error ? errorForComponents : undefined}
          refetch={handleRefetch}
        />

        <DamDashboard
          damData={damData}
          isLoading={isLoading}
          error={error ? errorForComponents : undefined}
          dataUpdatedAt={dataUpdatedAt}
          renderCount={renderCount.current}
          onRefresh={handleRefetch}
        />

        <DamHistoryChart damData={damData} />

        <HistoryTable historicoDias={damData?.historico_dias || []} />
      </div>
    </section>
  );
};

export default DamInfo;