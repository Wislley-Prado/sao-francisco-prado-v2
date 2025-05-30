
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Droplets, 
  TrendingUp, 
  Activity, 
  RefreshCw, 
  Clock,
  Database,
  Waves,
  BarChart3
} from 'lucide-react';
import { DamData } from '@/types/damData';
import { getStatusFromLevel } from '@/utils/damStatus';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';

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
  const currentLevel = damData?.nivel_atual ? parseFloat(damData.nivel_atual) : 0;
  const afluencia = damData?.afluencia || '0';
  const defluencia = damData?.defluencia || '0';
  const levelStatus = getStatusFromLevel(currentLevel);

  // Dados simulados para o gráfico de tendência
  const trendData = [
    { time: '6h', nivel: Math.max(0, currentLevel - 2) },
    { time: '4h', nivel: Math.max(0, currentLevel - 1.5) },
    { time: '2h', nivel: Math.max(0, currentLevel - 1) },
    { time: 'Agora', nivel: currentLevel },
  ];

  const chartConfig = {
    nivel: {
      label: 'Nível (%)',
      color: '#3b82f6',
    },
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 mb-8">
      {/* Header do Dashboard */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Dashboard da Represa</h3>
            <p className="text-sm text-gray-600">Dados em tempo real • Render #{renderCount}</p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Status Geral */}
        <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-lg font-bold text-gray-900">
                  {isLoading ? 'Carregando' : error ? 'Erro' : 'Online'}
                </p>
              </div>
              <div className={`p-2 rounded-full ${
                isLoading ? 'bg-yellow-100' : 
                error ? 'bg-red-100' : 
                'bg-green-100'
              }`}>
                <Database className={`h-5 w-5 ${
                  isLoading ? 'text-yellow-600' : 
                  error ? 'text-red-600' : 
                  'text-green-600'
                }`} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nível da Represa */}
        <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nível Atual</p>
                <p className="text-2xl font-bold text-blue-600">{currentLevel.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Droplets className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={currentLevel} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Afluência */}
        <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Afluência</p>
                <p className="text-xl font-bold text-green-600">{afluencia}</p>
                <p className="text-xs text-gray-500">m³/s</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Defluência */}
        <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Defluência</p>
                <p className="text-xl font-bold text-orange-600">{defluencia}</p>
                <p className="text-xs text-gray-500">m³/s</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <Waves className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Tendência e Informações Técnicas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Tendência */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>Tendência do Nível</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorNivel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    domain={[0, 100]}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="nivel"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorNivel)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Informações Técnicas */}
        <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <span>Informações</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status:</span>
              <Badge className={`${levelStatus.color} text-white`}>
                {levelStatus.text}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Última atualização:</span>
              <span className="text-sm font-medium">
                {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'N/A'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Dados presentes:</span>
              <span className={`text-sm font-medium ${damData ? 'text-green-600' : 'text-red-600'}`}>
                {damData ? 'Sim' : 'Não'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Data:</span>
              <span className="text-sm font-medium">
                {damData?.data_atualizacao || '--'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hora:</span>
              <span className="text-sm font-medium">
                {damData?.hora_atualizacao || '--'}
              </span>
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Estado da conexão:</span>
                <div className={`w-2 h-2 rounded-full ${
                  damData ? 'bg-green-500' : 'bg-red-500'
                } animate-pulse`}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DamDashboard;
