
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  RefreshCw, 
  Droplets, 
  TrendingUp, 
  Activity, 
  Clock,
  Database,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { DamData } from '@/types/damData';
import { getStatusFromLevel } from '@/utils/damStatus';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const currentLevel = damData?.nivel_atual ? parseFloat(damData.nivel_atual) : 86;
  const volumePercentual = damData?.volume_util_percentual ? parseFloat(damData.volume_util_percentual) : 86;
  const afluencia = damData?.afluencia || '--';
  const defluencia = damData?.defluencia || '--';
  
  const levelStatus = getStatusFromLevel(currentLevel);
  
  // Dados mockados para o gráfico de tendência
  const trendData = [
    { time: '00:00', nivel: currentLevel - 2 },
    { time: '04:00', nivel: currentLevel - 1.5 },
    { time: '08:00', nivel: currentLevel - 1 },
    { time: '12:00', nivel: currentLevel - 0.5 },
    { time: '16:00', nivel: currentLevel },
    { time: '20:00', nivel: currentLevel + 0.2 },
    { time: '24:00', nivel: currentLevel }
  ];

  return (
    <div className="mb-12">
      {/* Header do Dashboard */}
      <div className="bg-white rounded-t-xl shadow-lg border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Dashboard de Monitoramento</h3>
                <p className="text-sm text-gray-600">Sistema de controle em tempo real</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
                <span className="text-sm text-blue-600">Atualizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid lg:grid-cols-4 gap-6 bg-white rounded-b-xl shadow-lg p-6">
        
        {/* Card de Nível Principal */}
        <div className="lg:col-span-2">
          <Card className="h-full border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <span>Nível da Represa</span>
                </div>
                <Badge className={`${levelStatus.color} text-white`}>
                  {levelStatus.text}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {currentLevel.toFixed(1)}%
                  </div>
                  <Progress value={currentLevel} className="h-3 mb-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                {/* Gráfico de Tendência */}
                <div className="mt-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Tendência (24h)</h5>
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="time" 
                        fontSize={10}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        fontSize={10}
                        stroke="#6b7280"
                        domain={['dataMin - 1', 'dataMax + 1']}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: 'none', 
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="nivel" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards de Métricas */}
        <div className="space-y-4">
          {/* Volume Útil */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Volume Útil</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Estável
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-gray-900">{volumePercentual.toFixed(1)}%</div>
                <Progress value={volumePercentual} className="h-2 mt-2" />
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
              <div className="text-2xl font-bold text-gray-900 mt-2">{afluencia}</div>
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
              <div className="text-2xl font-bold text-gray-900 mt-2">{defluencia}</div>
            </CardContent>
          </Card>
        </div>

        {/* Informações do Sistema */}
        <div className="space-y-4">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Status do Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Última atualização:</span>
                <span className="font-medium">
                  {new Date(dataUpdatedAt).toLocaleTimeString('pt-BR')}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Renders:</span>
                <Badge variant="outline">{renderCount}</Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status da API:</span>
                <div className="flex items-center space-x-1">
                  {error ? (
                    <>
                      <AlertCircle className="h-3 w-3 text-red-500" />
                      <span className="text-red-600">Erro</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-green-600">OK</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Carregando:</span>
                <Badge variant={isLoading ? "default" : "outline"}>
                  {isLoading ? "Sim" : "Não"}
                </Badge>
              </div>

              {damData && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Data:</span>
                    <span className="font-medium">{damData.data_atualizacao}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Hora:</span>
                    <span className="font-medium">{damData.hora_atualizacao}</span>
                  </div>
                </>
              )}

              {error && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  {error.message}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DamDashboard;
