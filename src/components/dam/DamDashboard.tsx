
import React, { useMemo } from 'react';
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
  AlertCircle,
  TrendingDown
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
  const currentLevel = damData?.volume_util_percentual ? parseFloat(damData.volume_util_percentual) : 82;
  const nivelAtualMetros = damData?.nivel_atual ? parseFloat(damData.nivel_atual) : 569.8;
  const afluencia = damData?.afluencia || '134';
  const defluencia = damData?.defluencia || '310';
  const tendencia = damData?.tendencia_represa || 'estável';
  
  const levelStatus = getStatusFromLevel(currentLevel);
  
  // Usar useMemo para garantir que os dados do gráfico sejam recalculados quando damData mudar
  const trendData = useMemo(() => {
    console.log('📊 [CHART] Recalculando dados do gráfico com historico_dias:', damData?.historico_dias?.length || 0);
    
    if (!damData?.historico_dias || damData.historico_dias.length === 0) {
      console.log('⚠️ [CHART] Sem dados de histórico, retornando array vazio');
      return [];
    }

    const chartData = damData.historico_dias
      .slice(-7) // Pegar os últimos 7 dias
      .reverse() // Inverter para mostrar do mais antigo para o mais recente
      .map((dia, index) => {
        const dataFormatada = new Date(dia.dia).toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        });
        
        const nivel = parseFloat(dia.vol_util_final) || 0;
        const aflData = parseFloat(dia.vazao_afl) || 0;
        const defData = parseFloat(dia.vazao_def) || 0;
        
        console.log(`📈 [CHART] Dia ${index + 1}: ${dataFormatada} - Nível: ${nivel}%, Afl: ${aflData}, Def: ${defData}`);
        
        return {
          time: dataFormatada,
          nivel: nivel,
          afluencia: aflData,
          defluencia: defData
        };
      });

    console.log('✅ [CHART] Dados do gráfico processados:', chartData);
    return chartData;
  }, [damData?.historico_dias]); // Dependência específica do histórico

  // Determinar ícone da tendência
  const getTendenciaIcon = () => {
    const tendenciaLower = tendencia.toLowerCase();
    if (tendenciaLower.includes('subindo') || tendenciaLower.includes('enchendo')) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (tendenciaLower.includes('descendo') || tendenciaLower.includes('baixando')) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <Activity className="h-4 w-4 text-blue-500" />;
  };

  const getTendenciaColor = () => {
    const tendenciaLower = tendencia.toLowerCase();
    if (tendenciaLower.includes('subindo') || tendenciaLower.includes('enchendo')) {
      return 'text-green-600 bg-green-50 border-green-200';
    } else if (tendenciaLower.includes('descendo') || tendenciaLower.includes('baixando')) {
      return 'text-red-600 bg-red-50 border-red-200';
    }
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  return (
    <div className="mb-8 sm:mb-12">
      {/* Header do Dashboard */}
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

      {/* Grid Principal Responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 bg-white rounded-b-xl shadow-lg p-4 sm:p-6">
        
        {/* Card de Nível Principal com Gráfico */}
        <div className="lg:col-span-2">
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
                {/* Nível em metros */}
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                    {nivelAtualMetros.toFixed(1)}m
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    Cota atual: {nivelAtualMetros.toFixed(1)} metros
                  </div>
                  
                  {/* Volume útil percentual */}
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
                
                {/* Gráfico de Tendência com dados reais */}
                {trendData.length > 0 && (
                  <div className="mt-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">
                      Tendência (7 dias) - {trendData.length} registros
                    </h5>
                    <div className="h-24 sm:h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} key={`chart-${dataUpdatedAt}`}>
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
                            formatter={(value, name) => [
                              `${value}${name === 'nivel' ? '%' : ' m³/s'}`,
                              name === 'nivel' ? 'Nível' : name === 'afluencia' ? 'Afluência' : 'Defluência'
                            ]}
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
                )}

                {trendData.length === 0 && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">Aguardando dados históricos...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards de Métricas */}
        <div className="space-y-4">
          {/* Tendência da Represa */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTendenciaIcon()}
                  <span className="text-sm font-medium text-gray-700">Tendência</span>
                </div>
              </div>
              <div className="mt-2">
                <Badge className={`${getTendenciaColor()} border px-2 py-1 text-sm capitalize`}>
                  {tendencia}
                </Badge>
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
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{afluencia}</div>
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
              <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{defluencia}</div>
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
                <span className="font-medium text-xs sm:text-sm">
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

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Dados históricos:</span>
                <Badge variant="outline">
                  {damData?.historico_dias?.length || 0} dias
                </Badge>
              </div>

              {damData && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Data:</span>
                    <span className="font-medium text-xs sm:text-sm">{damData.data_atualizacao}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Hora:</span>
                    <span className="font-medium text-xs sm:text-sm">{damData.hora_atualizacao}</span>
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
