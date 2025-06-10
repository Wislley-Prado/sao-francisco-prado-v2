
import React, { useEffect } from 'react';
import { DamData } from '@/types/damData';
import DamDashboardHeader from './DamDashboardHeader';
import DamLevelCard from './DamLevelCard';
import DamMetricsCards from './DamMetricsCards';
import DamSystemInfoCard from './DamSystemInfoCard';

interface DamDashboardProps {
  damData: DamData | undefined;
  isLoading: boolean;
  error: Error | null;
  dataUpdatedAt: number;
  renderCount: number;
  onRefresh: () => void;
}

const DamDashboard: React.FC<DamDashboardProps> = ({
  damData,
  isLoading,
  error,
  dataUpdatedAt,
  renderCount,
  onRefresh
}) => {
  // Log sempre que o componente renderizar
  useEffect(() => {
    console.log('🎨 [DASHBOARD] Componente renderizou - Render #', renderCount);
    console.log('🎨 [DASHBOARD] damData:', damData);
    console.log('🎨 [DASHBOARD] dataUpdatedAt:', new Date(dataUpdatedAt).toISOString());
    console.log('🎨 [DASHBOARD] historico_dias length:', damData?.historico_dias?.length || 0);
  });

  return (
    <div className="mb-8 sm:mb-12">
      {/* Header do Dashboard */}
      <DamDashboardHeader
        damData={damData}
        error={error}
        isLoading={isLoading}
        onRefresh={onRefresh}
      />

      {/* Grid Principal Responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 bg-white rounded-b-xl shadow-lg p-4 sm:p-6">
        
        {/* Card de Nível Principal com Gráfico */}
        <div className="lg:col-span-2">
          <DamLevelCard
            damData={damData}
            dataUpdatedAt={dataUpdatedAt}
            renderCount={renderCount}
          />
        </div>

        {/* Cards de Métricas */}
        <div>
          <DamMetricsCards damData={damData} />
        </div>

        {/* Informações do Sistema */}
        <div>
          <DamSystemInfoCard
            damData={damData}
            isLoading={isLoading}
            error={error}
            dataUpdatedAt={dataUpdatedAt}
            renderCount={renderCount}
          />
        </div>
      </div>
    </div>
  );
};

export default DamDashboard;
