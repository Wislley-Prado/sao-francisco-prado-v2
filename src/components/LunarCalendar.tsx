
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
    const baseClasses = "w-6 h-6 rounded-full";
    
    switch (phase) {
      case 'Nova':
        return <div className={`${baseClasses} bg-gray-800`}></div>;
      case 'Crescente':
        return <div className={`${baseClasses} bg-gradient-to-r from-gray-800 to-gray-300`}></div>;
      case 'Cheia':
        return <div className={`${baseClasses} bg-gray-300`}></div>;
      case 'Minguante':
        return <div className={`${baseClasses} bg-gradient-to-l from-gray-800 to-gray-300`}></div>;
      default:
        return <div className={`${baseClasses} bg-gray-500`}></div>;
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return <Star className="h-5 w-5 fill-current text-yellow-500" />;
      case 'good':
        return <Star className="h-5 w-5 fill-current text-blue-500" />;
      default:
        return <Star className="h-5 w-5 text-gray-400" />;
    }
  };

  const getCurrentMoonIcon = (phase: string, illumination: number) => {
    const baseClasses = "w-8 h-8 rounded-full mx-auto my-2";
    
    if (phase === 'Nova') {
      return <div className={`${baseClasses} bg-gray-800`}></div>;
    } else if (phase === 'Crescente') {
      return <div className={`${baseClasses} bg-gradient-to-r from-gray-800 to-gray-300`}></div>;
    } else if (phase === 'Cheia') {
      return <div className={`${baseClasses} bg-gray-300`}></div>;
    } else {
      return <div className={`${baseClasses} bg-gradient-to-l from-gray-800 to-gray-300`}></div>;
    }
  };

  const nextPhase = lunarData.phases[0];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Lunar Calendar */}
          <Card className="shadow-xl border-2 border-rio-blue border-opacity-20">
            <CardHeader className="bg-gradient-to-r from-rio-blue to-water-green text-white">
              <CardTitle className="text-2xl flex items-center">
                <Moon className="mr-3 h-6 w-6" />
                Calendário Lunar - Dezembro 2024
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {lunarData.phases.map((phase, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-sand-beige rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getMoonIcon(phase.phase, phase.illumination)}
                      <div>
                        <h4 className="font-semibold text-gray-900">Lua {phase.phase}</h4>
                        <p className="text-sm text-gray-600">{phase.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${phase.color} text-white`}>
                        {phase.fishing}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">para pesca</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-rio-blue mb-2 flex items-center">
                  <Star className="mr-2 h-4 w-4" />
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
          <Card className="shadow-xl border-2 border-water-green border-opacity-20">
            <CardHeader className="bg-gradient-to-r from-water-green to-sunset-orange text-white">
              <CardTitle className="text-2xl flex items-center">
                <Sun className="mr-3 h-6 w-6" />
                Melhores Horários - Hoje
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {lunarData.bestFishingTimes.map((time, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border-l-4 border-sunset-orange bg-orange-50">
                    <div>
                      <h4 className="font-semibold text-gray-900">{time.time}</h4>
                      <p className="text-sm text-gray-600">{time.activity}</p>
                    </div>
                    <div className="text-sunset-orange">
                      {getQualityIcon(time.quality)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Conditions */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-sand-beige rounded-lg">
                  <h5 className="font-semibold text-gray-900">Lua Atual</h5>
                  {getCurrentMoonIcon(lunarData.currentPhase.phase, lunarData.currentPhase.illumination)}
                  <p className="text-sm text-gray-600">
                    {lunarData.currentPhase.phase} - {lunarData.currentPhase.illumination}%
                  </p>
                </div>
                <div className="text-center p-4 bg-sand-beige rounded-lg">
                  <h5 className="font-semibold text-gray-900">Próxima Fase</h5>
                  {getMoonIcon(nextPhase.phase, nextPhase.illumination)}
                  <p className="text-sm text-gray-600">{nextPhase.date}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h5 className="font-semibold text-water-green mb-2">
                  Condição Atual: {
                    lunarData.currentPhase.phase === 'Nova' || lunarData.currentPhase.phase === 'Minguante' 
                      ? 'Excelente' 
                      : lunarData.currentPhase.phase === 'Crescente' 
                      ? 'Boa' 
                      : 'Regular'
                  }
                </h5>
                <p className="text-sm text-gray-700">
                  {lunarData.currentPhase.phase === 'Nova' || lunarData.currentPhase.phase === 'Minguante'
                    ? 'Condições ideais para pesca de tucunaré e dourado. Recomendamos iscas artificiais no período da manhã.'
                    : lunarData.currentPhase.phase === 'Crescente'
                    ? 'Boa atividade dos peixes. Horários de madrugada e entardecer são mais promissores.'
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
