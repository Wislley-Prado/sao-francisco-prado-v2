
import React from 'react';
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
  return (
    <div className="mb-8 sm:mb-12">
      <DamDashboardHeader
        damData={damData}
        error={error}
        isLoading={isLoading}
        onRefresh={onRefresh}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 bg-white rounded-b-xl shadow-lg p-4 sm:p-6">
        <div className="lg:col-span-2">
          <DamLevelCard
            damData={damData}
            dataUpdatedAt={dataUpdatedAt}
            renderCount={renderCount}
          />
        </div>

        <div>
          <DamMetricsCards damData={damData} />
        </div>

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