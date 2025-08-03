
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun, Star } from 'lucide-react';
import { useLunarData } from '@/hooks/useLunarData';

const LunarCalendar = () => {
  const { data: lunarData, isLoading, error } = useLunarData();

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Moon className="h-8 w-8 animate-pulse text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Carregando dados lunares...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !lunarData) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Erro ao carregar dados lunares</p>
          </div>
        </div>
      </section>
    );
  }

  const getMoonIcon = (phase: string, illumination: number) => {
    const baseClasses = "w-6 h-6 rounded-full shadow-sm";
    
    switch (phase) {
      case 'Nova':
        return <div className={`${baseClasses} bg-gray-800`}></div>;
      case 'Crescente':
        return <div className={`${baseClasses} bg-gradient-to-r from-gray-800 to-yellow-200`}></div>;
      case 'Crescente Gibosa':
        return <div className={`${baseClasses} bg-gradient-to-r from-gray-600 to-yellow-100`}></div>;
      case 'Cheia':
        return <div className={`${baseClasses} bg-yellow-100 border-2 border-yellow-300`}></div>;
      case 'Minguante Gibosa':
        return <div className={`${baseClasses} bg-gradient-to-l from-gray-600 to-yellow-100`}></div>;
      case 'Minguante':
        return <div className={`${baseClasses} bg-gradient-to-l from-gray-800 to-yellow-200`}></div>;
      case 'Minguante Crescente':
        return <div className={`${baseClasses} bg-gradient-to-r from-gray-700 to-gray-800`}></div>;
      default:
        return <div className={`${baseClasses} bg-gray-500`}></div>;
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />;
      case 'good':
        return <Star className="h-5 w-5 fill-blue-400 text-blue-400" />;
      default:
        return <Star className="h-5 w-5 text-gray-400" />;
    }
  };

  const getCurrentMoonIcon = (phase: string, illumination: number) => {
    const baseClasses = "w-12 h-12 rounded-full mx-auto my-2 shadow-lg";
    
    switch (phase) {
      case 'Nova':
        return <div className={`${baseClasses} bg-gray-800`}></div>;
      case 'Crescente':
        return <div className={`${baseClasses} bg-gradient-to-r from-gray-800 to-yellow-200`}></div>;
      case 'Crescente Gibosa':
        return <div className={`${baseClasses} bg-gradient-to-r from-gray-600 to-yellow-100 border border-yellow-200`}></div>;
      case 'Cheia':
        return <div className={`${baseClasses} bg-yellow-100 border-2 border-yellow-300`}></div>;
      case 'Minguante Gibosa':
        return <div className={`${baseClasses} bg-gradient-to-l from-gray-600 to-yellow-100 border border-yellow-200`}></div>;
      case 'Minguante':
        return <div className={`${baseClasses} bg-gradient-to-l from-gray-800 to-yellow-200`}></div>;
      case 'Minguante Crescente':
        return <div className={`${baseClasses} bg-gradient-to-r from-gray-700 to-gray-800`}></div>;
      default:
        return <div className={`${baseClasses} bg-gray-500`}></div>;
    }
  };

  const nextPhase = lunarData.phases[0];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Lunar Calendar */}
          <Card className="shadow-xl border-0 overflow-hidden bg-white">
            <CardHeader className="bg-white border-b border-gray-100 pb-6">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <Moon className="mr-3 h-5 w-5 text-blue-600" />
                Calendário Lunar - {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase())}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <div className="space-y-4">
                {lunarData.phases.map((phase, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      {getMoonIcon(phase.phase, phase.illumination)}
                      <div>
                        <h4 className="font-semibold text-gray-900">Lua {phase.phase}</h4>
                        <p className="text-sm text-gray-600">{phase.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${phase.color} text-white text-sm px-3 py-1`}>
                        {phase.fishing}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">para pesca</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h5 className="font-semibold text-blue-700 mb-2 flex items-center">
                  <Star className="mr-2 h-4 w-4 fill-blue-400 text-blue-400" />
                  Dica dos Especialistas
                </h5>
                <p className="text-sm text-gray-700">
                  As fases da lua nova e minguante são ideais para a pesca de espécies maiores. 
                  A pressão atmosférica e luminosidade favorecem a atividade dos peixes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Best Fishing Times */}
          <Card className="shadow-xl border-0 overflow-hidden bg-white">
            <CardHeader className="bg-white border-b border-gray-100 pb-6">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <Sun className="mr-3 h-5 w-5 text-orange-500" />
                Melhores Horários - Hoje
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <div className="space-y-3">
                {lunarData.bestFishingTimes.map((time, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400 hover:shadow-sm transition-all duration-200">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{time.time}</h4>
                        <p className="text-sm text-gray-600 font-medium">{time.activity}</p>
                      </div>
                      <div className="ml-4">
                        {getQualityIcon(time.quality)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Conditions */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-100">
                  <h5 className="font-bold text-gray-900 mb-2">Lua Atual</h5>
                  {getCurrentMoonIcon(lunarData.currentPhase.phase, lunarData.currentPhase.illumination)}
                  <p className="text-sm text-gray-600 font-medium">
                    {lunarData.currentPhase.phase}
                  </p>
                  <p className="text-xs text-gray-500">
                    {lunarData.currentPhase.illumination}% iluminada
                  </p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-100">
                  <h5 className="font-bold text-gray-900 mb-2">Próxima Fase</h5>
                  {getMoonIcon(nextPhase.phase, nextPhase.illumination)}
                  <p className="text-sm text-gray-600 font-medium mt-3">{nextPhase.phase}</p>
                  <p className="text-xs text-gray-500">{nextPhase.date}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
                <h5 className="font-bold text-green-700 mb-2">
                  Condição Atual: {
                    lunarData.currentPhase.phase === 'Nova' || lunarData.currentPhase.phase === 'Minguante Crescente' 
                      ? 'Excelente' 
                      : lunarData.currentPhase.phase === 'Crescente' || lunarData.currentPhase.phase === 'Minguante'
                      ? 'Boa' 
                      : lunarData.currentPhase.phase === 'Crescente Gibosa' || lunarData.currentPhase.phase === 'Minguante Gibosa'
                      ? 'Regular'
                      : 'Fraca'
                  }
                </h5>
                <p className="text-sm text-gray-700">
                  {lunarData.currentPhase.phase === 'Nova' || lunarData.currentPhase.phase === 'Minguante Crescente'
                    ? 'Condições ideais para pesca de tucunaré e dourado. Recomendamos iscas artificiais no período da manhã.'
                    : lunarData.currentPhase.phase === 'Crescente' || lunarData.currentPhase.phase === 'Minguante'
                    ? 'Boa atividade dos peixes. Horários de madrugada e entardecer são mais promissores.'
                    : lunarData.currentPhase.phase === 'Crescente Gibosa' || lunarData.currentPhase.phase === 'Minguante Gibosa'
                    ? 'Fase gibosa com atividade moderada. Peixes mais ativos durante mudanças de luz.'
                    : 'Lua cheia pode reduzir a atividade diurna. Concentre na pesca noturna e madrugada.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LunarCalendar;
