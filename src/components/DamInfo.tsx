
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Droplets, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Activity, Clock, RefreshCw } from 'lucide-react';

interface DamData {
  nivel_atual: string;
  volume_util_percentual: string;
  afluencia: string;
  defluencia: string;
  historico_dias: Array<{
    dia: string;
    vazao_afl: string;
    cota_inicial: string;
    vol_util_inicial: string;
    vazao_def: string;
    cota_final: string;
    vol_util_final: string;
  }>;
}

const fetchDamData = async (): Promise<DamData> => {
  console.log('Fetching dam data from webhook...');
  const response = await fetch('https://n8n.prado.vendopro.com.br/webhook-test/represaonlinepradoaqui');
  if (!response.ok) {
    throw new Error('Erro ao buscar dados da represa');
  }
  const data = await response.json();
  console.log('Dam data received:', data);
  return data;
};

const DamInfo = () => {
  const { data: damData, isLoading, error, refetch } = useQuery({
    queryKey: ['damData'],
    queryFn: fetchDamData,
    refetchInterval: 6 * 60 * 60 * 1000, // Refetch a cada 6 horas
    staleTime: 30 * 60 * 1000, // Dados ficam fresh por 30 minutos
  });

  console.log('Current dam data:', damData);
  console.log('Loading state:', isLoading);
  console.log('Error state:', error);

  // Valores padrão enquanto carrega ou em caso de erro
  const currentLevel = damData?.nivel_atual ? parseFloat(damData.nivel_atual) : 86;
  const volumePercentual = damData?.volume_util_percentual ? parseFloat(damData.volume_util_percentual) : 86;
  const afluencia = damData?.afluencia || '--';
  const defluencia = damData?.defluencia || '--';

  const getStatusFromLevel = (level: number) => {
    if (level >= 80) return { status: 'excellent', text: 'Excelente', color: 'bg-green-500' };
    if (level >= 60) return { status: 'good', text: 'Bom', color: 'bg-yellow-500' };
    if (level >= 40) return { status: 'warning', text: 'Atenção', color: 'bg-orange-500' };
    return { status: 'critical', text: 'Crítico', color: 'bg-red-500' };
  };

  const levelStatus = getStatusFromLevel(currentLevel);

  const conditions = [
    {
      label: "Nível da Represa",
      value: `${currentLevel.toFixed(1)}%`,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-yellow-500';
      case 'warning': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bom';
      case 'warning': return 'Atenção';
      case 'critical': return 'Crítico';
      default: return 'Indefinido';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '--';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
    <section id="represa" className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Informações da Represa de Três Marias
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dados em tempo real para planejamento da sua pescaria. 
            Informações atualizadas automaticamente.
          </p>
          
          {/* Status de carregamento */}
          <div className="flex items-center justify-center mt-4 space-x-2">
            {isLoading && (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-rio-blue" />
                <span className="text-sm text-rio-blue">Carregando dados...</span>
              </>
            )}
            {error && (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-500">Erro ao carregar dados</span>
                <button 
                  onClick={() => refetch()} 
                  className="text-sm text-rio-blue hover:underline"
                >
                  Tentar novamente
                </button>
              </>
            )}
            {damData && !isLoading && (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Dados atualizados</span>
              </>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader className="bg-rio-blue text-white">
                <CardTitle className="text-2xl flex items-center justify-between">
                  <div className="flex items-center">
                    <Droplets className="mr-3 h-6 w-6" />
                    Status Atual da Represa
                  </div>
                  <button 
                    onClick={() => refetch()} 
                    className="p-2 hover:bg-blue-600 rounded-full transition-colors"
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </CardTitle>
                <p className="text-blue-100">
                  {damData ? 'Dados em tempo real' : 'Últimos dados disponíveis'}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                {/* Main Level Display */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Nível: {currentLevel.toFixed(1)}%
                    </h3>
                    <Badge className={`${levelStatus.color} text-white`}>
                      {levelStatus.text}
                    </Badge>
                  </div>
                  <Progress value={currentLevel} className="h-4 mb-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Mínimo (40%)</span>
                    <span>Atual: {currentLevel.toFixed(1)}%</span>
                    <span>Máximo (100%)</span>
                  </div>
                </div>

                {/* Conditions Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {conditions.map((condition, index) => (
                    <div key={index} className="bg-sand-beige rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 text-gray-700">
                          {condition.icon}
                          <span className="font-medium">{condition.label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {condition.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                          {condition.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                          {condition.trend === 'stable' && <div className="w-4 h-4"></div>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-900">
                          {condition.value}
                        </span>
                        <Badge className={`${getStatusColor(condition.status)} text-white`}>
                          {getStatusText(condition.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Historical Data Table */}
                {damData?.historico_dias && damData.historico_dias.length > 0 && (
                  <div className="mt-8">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Histórico Recente
                    </h4>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Afluência</TableHead>
                            <TableHead>Defluência</TableHead>
                            <TableHead>Cota Final</TableHead>
                            <TableHead>Vol. Útil Final</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {damData.historico_dias.slice(0, 5).map((dia, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {formatDate(dia.dia)}
                              </TableCell>
                              <TableCell>{dia.vazao_afl} m³/s</TableCell>
                              <TableCell>{dia.vazao_def} m³/s</TableCell>
                              <TableCell>{dia.cota_final} m</TableCell>
                              <TableCell>{dia.vol_util_final}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            {/* Impact on Fishing */}
            <Card className="shadow-lg">
              <CardHeader className="bg-water-green text-white">
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Impacto na Pesca
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${currentLevel >= 60 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm text-gray-700">
                      {currentLevel >= 60 ? 'Acesso total aos pontos de pesca' : 'Acesso limitado a alguns pontos'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${currentLevel >= 70 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm text-gray-700">
                      {currentLevel >= 70 ? 'Navegação sem restrições' : 'Navegação com cuidado'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${currentLevel >= 50 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <span className="text-sm text-gray-700">
                      {currentLevel >= 50 ? 'Peixes ativos em várias profundidades' : 'Peixes concentrados em áreas mais profundas'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Sempre observe as condições locais</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Stats */}
            <Card className="shadow-lg">
              <CardHeader className="bg-sunset-orange text-white">
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Dados Atuais
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">Nível Atual</p>
                    <p className="text-sm text-gray-600">{currentLevel.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Volume Útil</p>
                    <p className="text-sm text-gray-600">{volumePercentual.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Afluência</p>
                    <p className="text-sm text-gray-600">{afluencia} m³/s</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Defluência</p>
                    <p className="text-sm text-gray-600">{defluencia} m³/s</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Dados Técnicos</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Área do espelho:</span>
                    <span className="font-medium">1.092 km²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Volume máximo:</span>
                    <span className="font-medium">22,5 bi m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profundidade máx:</span>
                    <span className="font-medium">65m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status da conexão:</span>
                    <span className={`font-medium ${damData ? 'text-green-600' : 'text-orange-600'}`}>
                      {damData ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DamInfo;
