
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FishingTabProps {
  current: {
    temperature: number;
    sunrise: number;
    wind_speed: number;
    clouds: number;
    pressure: number;
    [key: string]: unknown;
  };
  fishingCondition: { text: string; color: string };
}

const FishingTab = ({ current, fishingCondition }: FishingTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Condições Atuais para Pesca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
            <span className="text-sm sm:text-base">Condição Geral</span>
            <Badge className={`${fishingCondition.color} text-white text-xs sm:text-sm`}>
              {fishingCondition.text}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm">Temperatura da Água (est.)</span>
              <span className="font-medium text-sm sm:text-base">{Math.max(current.temperature - 3, 18)}°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm">Atividade dos Peixes</span>
              <span className="font-medium text-sm sm:text-base">
                {current.temperature >= 22 && current.temperature <= 26 ? 'Alta' :
                  current.temperature >= 18 && current.temperature <= 30 ? 'Moderada' : 'Baixa'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm">Melhor Período</span>
              <span className="font-medium text-sm sm:text-base">
                {new Date(current.sunrise * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} -
                {new Date(current.sunrise * 1000 + 2 * 3600000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm">Condições do Vento</span>
              <span className="font-medium text-sm sm:text-base">
                {current.wind_speed <= 10 ? 'Excelente' :
                  current.wind_speed <= 20 ? 'Boa' : 'Desafiadora'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Dicas para Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-xs sm:text-sm">
            {current.wind_speed <= 15 && (
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p>Vento favorável para pesca com isca artificial</p>
              </div>
            )}

            {current.clouds >= 20 && current.clouds <= 70 && (
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p>Nebulosidade ideal - peixes mais ativos</p>
              </div>
            )}

            {current.pressure >= 1013 && current.pressure <= 1020 && (
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p>Pressão atmosférica estável - boa para pesca</p>
              </div>
            )}

            {current.temperature >= 20 && current.temperature <= 28 && (
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p>Temperatura ideal para atividade dos peixes</p>
              </div>
            )}

            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p>Melhores horários: madrugada e entardecer</p>
            </div>

            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <p>Use iscas de acordo com a atividade dos peixes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FishingTab;
