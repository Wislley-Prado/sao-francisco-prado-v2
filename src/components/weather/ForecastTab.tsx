
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

interface ForecastTabProps {
  weatherData: {
    daily: Array<{
      dt: number;
      weather_icon: string;
      weather_description: string;
      pop: number;
      wind_speed: number;
      temp_min: number;
      temp_max: number;
    }>;
  };
  current: { dt: number };
  getWeatherIcon: (iconCode: string) => React.ReactNode;
}

const ForecastTab = ({ weatherData, current, getWeatherIcon }: ForecastTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span>Previsão para os Próximos 7 Dias</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Planeje sua pescaria com antecedência - condições detalhadas para toda a semana
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {weatherData.daily.map((day: { dt: number; weather_icon: string; weather_description: string; pop: number; wind_speed: number; temp_min: number; temp_max: number }, index: number) => {
            const dayDate = new Date(day.dt * 1000);
            const currentDataDateOnly = new Date(current.dt * 1000);
            currentDataDateOnly.setHours(0, 0, 0, 0);

            const dayDateOnly = new Date(dayDate);
            dayDateOnly.setHours(0, 0, 0, 0);

            const isToday = dayDateOnly.getTime() === currentDataDateOnly.getTime();
            const tomorrowDate = new Date(currentDataDateOnly.getTime() + 24 * 60 * 60 * 1000);
            const isTomorrow = dayDateOnly.getTime() === tomorrowDate.getTime();

            let dayLabel;
            if (isToday) {
              dayLabel = 'HOJE';
            } else if (isTomorrow) {
              dayLabel = 'AMANHÃ';
            } else {
              dayLabel = dayDate.toLocaleDateString('pt-BR', { weekday: 'long' }).toUpperCase();
            }

            const fullDate = dayDate.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });

            return (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg space-y-3 sm:space-y-0 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="text-center min-w-[100px]">
                    <div className={`text-sm font-bold ${isToday ? 'text-blue-600' : isTomorrow ? 'text-green-600' : 'text-gray-800'}`}>
                      {dayLabel}
                    </div>
                    <div className="text-xs text-gray-500">{fullDate}</div>
                  </div>
                  {getWeatherIcon(day.weather_icon)}
                  <div className="text-sm capitalize flex-1 sm:flex-none">{day.weather_description}</div>
                </div>
                <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6 text-sm w-full sm:w-auto">
                  <div className="text-center">
                    <div className="text-xs text-gray-600">Chuva</div>
                    <div className="font-medium">{day.pop}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600">Vento</div>
                    <div className="font-medium">{day.wind_speed} km/h</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600">Min/Max</div>
                    <div className="font-bold text-blue-600">{day.temp_min}°/{day.temp_max}°</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600">Pesca</div>
                    <Badge className={`text-xs ${day.temp_min >= 18 && day.temp_max <= 30 && day.wind_speed <= 15 && day.pop <= 30
                        ? 'bg-green-500'
                        : day.wind_speed <= 20 && day.pop <= 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      } text-white`}>
                      {day.temp_min >= 18 && day.temp_max <= 30 && day.wind_speed <= 15 && day.pop <= 30
                        ? 'Ótima'
                        : day.wind_speed <= 20 && day.pop <= 50
                          ? 'Boa'
                          : 'Regular'}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastTab;
