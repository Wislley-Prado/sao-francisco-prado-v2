
import React from 'react';
import { RefreshCw, Database, Wifi, WifiOff } from 'lucide-react';
import { DamData } from '@/types/damData';

interface DamDashboardHeaderProps {
  damData: DamData | undefined;
  error: Error | null;
  isLoading: boolean;
  onRefresh: () => void;
}

const DamDashboardHeader: React.FC<DamDashboardHeaderProps> = ({
  damData,
  error,
  isLoading,
  onRefresh
}) => {
  return (
    <div className="bg-white rounded-t-xl shadow-lg border-b border-gray-200">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Dashboard de Monitoramento</h3>
              <p className="text-sm text-gray-600">Sistema de controle em tempo real</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            {/* Status da Conexão */}
            <div className="flex items-center space-x-2">
              {damData && !error ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">Offline</span>
                </>
              )}
            </div>
            
            {/* Botão de Refresh */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="text-sm text-blue-600 hidden sm:inline">Atualizar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DamDashboardHeader;
