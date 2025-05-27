
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun, Star } from 'lucide-react';

const LunarCalendar = () => {
  const lunarPhases = [
    {
      phase: "Nova",
      date: "15 Nov",
      icon: <div className="w-6 h-6 bg-gray-800 rounded-full"></div>,
      fishing: "Excelente",
      color: "bg-green-500"
    },
    {
      phase: "Crescente",
      date: "22 Nov",
      icon: <div className="w-6 h-6 bg-gradient-to-r from-gray-800 to-gray-300 rounded-full"></div>,
      fishing: "Bom",
      color: "bg-yellow-500"
    },
    {
      phase: "Cheia",
      date: "30 Nov",
      icon: <div className="w-6 h-6 bg-gray-300 rounded-full"></div>,
      fishing: "Regular",
      color: "bg-orange-500"
    },
    {
      phase: "Minguante",
      date: "7 Dez",
      icon: <div className="w-6 h-6 bg-gradient-to-l from-gray-800 to-gray-300 rounded-full"></div>,
      fishing: "Bom",
      color: "bg-yellow-500"
    }
  ];

  const bestTimes = [
    { time: "05:30 - 07:00", activity: "Nascente do Sol" },
    { time: "17:30 - 19:00", activity: "Pôr do Sol" },
    { time: "22:00 - 00:30", activity: "Lua Alta" },
    { time: "03:00 - 05:00", activity: "Madrugada" }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Lunar Calendar */}
          <Card className="shadow-xl border-2 border-rio-blue border-opacity-20">
            <CardHeader className="bg-gradient-to-r from-rio-blue to-water-green text-white">
              <CardTitle className="text-2xl flex items-center">
                <Moon className="mr-3 h-6 w-6" />
                Calendário Lunar - Novembro 2024
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {lunarPhases.map((phase, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-sand-beige rounded-lg">
                    <div className="flex items-center space-x-4">
                      {phase.icon}
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
                {bestTimes.map((time, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border-l-4 border-sunset-orange bg-orange-50">
                    <div>
                      <h4 className="font-semibold text-gray-900">{time.time}</h4>
                      <p className="text-sm text-gray-600">{time.activity}</p>
                    </div>
                    <div className="text-sunset-orange">
                      <Star className="h-5 w-5 fill-current" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Conditions */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-sand-beige rounded-lg">
                  <h5 className="font-semibold text-gray-900">Lua Atual</h5>
                  <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto my-2"></div>
                  <p className="text-sm text-gray-600">Cheia - 89%</p>
                </div>
                <div className="text-center p-4 bg-sand-beige rounded-lg">
                  <h5 className="font-semibold text-gray-900">Próxima Fase</h5>
                  <div className="w-8 h-8 bg-gradient-to-l from-gray-800 to-gray-300 rounded-full mx-auto my-2"></div>
                  <p className="text-sm text-gray-600">Em 3 dias</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h5 className="font-semibold text-water-green mb-2">
                  Condição Atual: Excelente
                </h5>
                <p className="text-sm text-gray-700">
                  Condições ideais para pesca de tucunaré e dourado. 
                  Recomendamos iscas artificiais no período da manhã.
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
