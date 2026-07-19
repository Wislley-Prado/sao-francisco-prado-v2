
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Droplets, TrendingUp, Activity, RefreshCw } from 'lucide-react';
import { useDamData, DEFAULT_FALLBACK_DAM_DATA } from '@/hooks/useDamData';
import { getStatusFromLevel } from '@/utils/damStatus';
import { Condition } from '@/types/damData';
import DamHeader from './dam/DamHeader';
import HistoryTable from './dam/HistoryTable';
import DamDashboard from './dam/DamDashboard';
import DamHistoryChart from './dam/DamHistoryChart';

const DamInfo = () => {
  const { data: damDataRaw, isLoading, error, refetch, dataUpdatedAt } = useDamData();
  const renderCount = useRef(0);
  renderCount.current += 1;

  // Garantir que mesmo ao limpar o cache a aplicação NUNCA fique com dados undefined ou cause tela branca
  const damData = damDataRaw || DEFAULT_FALLBACK_DAM_DATA;

  const handleRefetch = () => {
    refetch();
  };

  const errorForComponents = error instanceof Error ? error : undefined;

  return (
    <section id="represa" className="py-10 sm:py-16 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <DamHeader 
          damData={damData}
          isLoading={isLoading}
          error={errorForComponents}
          refetch={handleRefetch}
        />

        <DamDashboard
          damData={damData}
          isLoading={isLoading}
          error={errorForComponents}
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