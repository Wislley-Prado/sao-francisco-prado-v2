
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wind, Droplets, Gauge, Eye } from 'lucide-react';

interface WeatherMetricsProps {
  current: any;
}

const WeatherMetrics = ({ current }: WeatherMetricsProps) => {
  return (
    <div className="lg:col-span-2 grid grid-cols-2 gap-3 sm:gap-4">
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Wind className="h-4 w-4 text-blue-500" />
            <span className="text-xs sm:text-sm font-medium">Vento</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold">{current.wind_speed} km/h</div>
          <div className="text-xs text-gray-600">{current.wind_direction}°</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-xs sm:text-sm font-medium">Umidade</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold">{current.humidity}%</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Gauge className="h-4 w-4 text-blue-500" />
            <span className="text-xs sm:text-sm font-medium">Pressão</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold">{current.pressure}</div>
          <div className="text-xs text-gray-600">hPa</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="h-4 w-4 text-blue-500" />
            <span className="text-xs sm:text-sm font-medium">Visibilidade</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold">{current.visibility}</div>
          <div className="text-xs text-gray-600">km</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherMetrics;
