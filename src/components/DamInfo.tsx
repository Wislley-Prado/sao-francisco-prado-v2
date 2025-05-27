
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Droplets, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

const DamInfo = () => {
  const currentLevel = 86;
  const currentVolume = 19.3;
  const maxVolume = 22.5;
  
  const conditions = [
    {
      label: "Nível da Represa",
      value: `${currentLevel}%`,
      status: "excellent",
      icon: <Droplets className="h-5 w-5" />,
      trend: "stable"
    },
    {
      label: "Volume Útil",
      value: `${currentVolume} bi m³`,
      status: "good",
      icon: <TrendingUp className="h-5 w-5" />,
      trend: "up"
    },
    {
      label: "Vertedouro",
      value: "Fechado",
      status: "excellent",
      icon: <CheckCircle className="h-5 w-5" />,
      trend: "stable"
    },
    {
      label: "Qualidade da Água",
      value: "Excelente",
      status: "excellent",
      icon: <CheckCircle className="h-5 w-5" />,
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

  return (
    <section id="represa" className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Informações da Represa de Três Marias
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dados em tempo real da CEMIG para planejamento da sua pescaria. 
            Informações atualizadas a cada 6 horas.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader className="bg-rio-blue text-white">
                <CardTitle className="text-2xl flex items-center">
                  <Droplets className="mr-3 h-6 w-6" />
                  Status Atual da Represa
                </CardTitle>
                <p className="text-blue-100">
                  Última atualização: Hoje às 12:00
                </p>
              </CardHeader>
              <CardContent className="p-6">
                {/* Main Level Display */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Nível: {currentLevel}%
                    </h3>
                    <Badge className="bg-green-500 text-white">
                      Condições Ideais
                    </Badge>
                  </div>
                  <Progress value={currentLevel} className="h-4 mb-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Mínimo (40%)</span>
                    <span>Atual: {currentLevel}%</span>
                    <span>Máximo (100%)</span>
                  </div>
                </div>

                {/* Conditions Grid */}
                <div className="grid md:grid-cols-2 gap-6">
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

                {/* Historical Chart Placeholder */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Variação do Nível - Últimos 30 dias
                  </h4>
                  <div className="h-32 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <p className="text-gray-500">Gráfico de tendência do nível da represa</p>
                  </div>
                </div>
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
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Acesso total aos pontos de pesca</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Navegação sem restrições</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Peixes ativos em todas as profundidades</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Atenção às correntezas próximo à barragem</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Impact */}
            <Card className="shadow-lg">
              <CardHeader className="bg-sunset-orange text-white">
                <CardTitle className="flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Previsão
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">Próximos 7 dias</p>
                    <p className="text-sm text-gray-600">Chuvas leves previstas</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Nível esperado</p>
                    <p className="text-sm text-gray-600">Estável entre 85-87%</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Recomendação</p>
                    <p className="text-sm text-gray-600">Condições ideais mantidas</p>
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
                    <span className="text-gray-600">Cota atual:</span>
                    <span className="font-medium">567,2m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Volume máximo:</span>
                    <span className="font-medium">22,5 bi m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Área do espelho:</span>
                    <span className="font-medium">1.092 km²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profundidade máx:</span>
                    <span className="font-medium">65m</span>
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
