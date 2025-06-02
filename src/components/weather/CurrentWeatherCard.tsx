
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sunrise, Sunset } from 'lucide-react';

interface CurrentWeatherCardProps {
  current: any;
  getWeatherIcon: (iconCode: string) => React.ReactNode;
  fishingCondition: { text: string; color: string };
  now: Date;
}

const CurrentWeatherCard = ({ current, getWeatherIcon, fishingCondition, now }: CurrentWeatherCardProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-start sm:items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          {getWeatherIcon(current.weather_icon)}
          <div className="min-w-0">
            <CardTitle className="text-lg sm:text-xl truncate">Três Marias, MG</CardTitle>
            <p className="text-xs sm:text-sm text-gray-600 capitalize truncate">{current.weather_description}</p>
            <p className="text-xs text-blue-600 font-medium">
              HOJE - {now.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <div className="text-4xl sm:text-5xl font-bold text-gray-900">{current.temperature}°C</div>
            <div className="text-sm text-gray-600">Sensação: {current.feels_like}°C</div>
            <div className="text-xs text-gray-500 mt-2">
              Atualizado: {now.toLocaleTimeString('pt-BR')}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <Badge className={`${fishingCondition.color} text-white mb-2 text-xs sm:text-sm`}>
              Pesca: {fishingCondition.text}
            </Badge>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center">
                <Sunrise className="h-4 w-4 mr-1 text-amber-500" />
                <span className="text-xs sm:text-sm">
                  {new Date(current.sunrise * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center">
                <Sunset className="h-4 w-4 mr-1 text-orange-500" />
                <span className="text-xs sm:text-sm">
                  {new Date(current.sunset * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeatherCard;
