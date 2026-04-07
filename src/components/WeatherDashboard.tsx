
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Cloud,
  CloudRain,
  Sun,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import { useWeatherData } from '@/hooks/useWeatherData';
import WeatherHeader from './weather/WeatherHeader';
import CurrentWeatherCard from './weather/CurrentWeatherCard';
import WeatherMetrics from './weather/WeatherMetrics';
import ForecastTab from './weather/ForecastTab';
import TimelineTab from './weather/TimelineTab';
import FishingTab from './weather/FishingTab';

const WeatherDashboard = () => {
  const { data: weatherData, isLoading, error } = useWeatherData();

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      '01d': <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />,
      '01n': <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />,
      '02d': <Cloud className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />,
      '02n': <Cloud className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />,
      '03d': <Cloud className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />,
      '03n': <Cloud className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />,
      '04d': <Cloud className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />,
      '04n': <Cloud className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />,
      '09d': <CloudRain className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />,
      '09n': <CloudRain className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />,
      '10d': <CloudRain className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />,
      '10n': <CloudRain className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />,
      '11d': <CloudRain className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />,
      '11n': <CloudRain className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />,
    };
    return iconMap[iconCode] || <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />;
  };

  const getFishingCondition = (weather: { current: { temperature: number; wind_speed: number; clouds: number; pressure: number } }) => {
    if (!weather) return { status: 'unknown', text: 'Dados indisponíveis', color: 'bg-gray-500' };

    const temp = weather.current.temperature;
    const wind = weather.current.wind_speed;
    const clouds = weather.current.clouds;
    const pressure = weather.current.pressure;

    let score = 0;

    if (temp >= 20 && temp <= 28) score += 3;
    else if (temp >= 18 && temp <= 30) score += 2;
    else score += 1;

    if (wind <= 10) score += 3;
    else if (wind <= 15) score += 2;
    else if (wind <= 25) score += 1;

    if (clouds >= 20 && clouds <= 60) score += 2;
    else if (clouds <= 80) score += 1;

    if (pressure >= 1013 && pressure <= 1020) score += 2;
    else if (pressure >= 1008 && pressure <= 1025) score += 1;

    if (score >= 8) return { status: 'excellent', text: 'Excelente', color: 'bg-green-500' };
    if (score >= 6) return { status: 'good', text: 'Boa', color: 'bg-blue-500' };
    if (score >= 4) return { status: 'fair', text: 'Regular', color: 'bg-yellow-500' };
    return { status: 'poor', text: 'Ruim', color: 'bg-red-500' };
  };

  if (isLoading) {
    return (
      <section className="py-8 sm:py-16 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Sun className="h-8 w-8 animate-spin text-yellow-500" />
              <span className="ml-2 text-sm sm:text-base">Carregando dados meteorológicos...</span>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (error || !weatherData) {
    return (
      <section className="py-8 sm:py-16 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4">
          <Card>
            <CardContent className="text-center py-12 space-y-4">
              <p className="text-red-600 mb-4 text-sm sm:text-base">
                Erro ao carregar dados meteorológicos
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const current = weatherData.current;
  const fishingCondition = getFishingCondition(weatherData);
  const now = new Date();
  const currentDate = now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="py-8 sm:py-16 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WeatherHeader currentDate={currentDate} />

        {/* Condições Atuais */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <CurrentWeatherCard
            current={current}
            getWeatherIcon={getWeatherIcon}
            fishingCondition={fishingCondition}
            now={now}
          />
          <WeatherMetrics current={current} />
        </div>

        {/* Tabs para diferentes visualizações */}
        <Tabs defaultValue="forecast" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="forecast" className="flex flex-col sm:flex-row items-center p-2 sm:p-3 text-xs sm:text-sm">
              <Calendar className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
              <span className="hidden sm:inline">Previsão 7 Dias</span>
              <span className="sm:hidden">7 Dias</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex flex-col sm:flex-row items-center p-2 sm:p-3 text-xs sm:text-sm">
              <Clock className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
              <span className="hidden sm:inline">Linha do Tempo</span>
              <span className="sm:hidden">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="fishing" className="flex flex-col sm:flex-row items-center p-2 sm:p-3 text-xs sm:text-sm">
              <TrendingUp className="h-4 w-4 mb-1 sm:mb-0 sm:mr-2" />
              <span className="hidden sm:inline">Para Pesca</span>
              <span className="sm:hidden">Pesca</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forecast">
            <ForecastTab
              weatherData={weatherData}
              current={current}
              getWeatherIcon={getWeatherIcon}
            />
          </TabsContent>

          <TabsContent value="timeline">
            <TimelineTab
              weatherData={weatherData}
              current={current}
              getWeatherIcon={getWeatherIcon}
              now={now}
            />
          </TabsContent>

          <TabsContent value="fishing">
            <FishingTab
              current={current}
              fishingCondition={fishingCondition}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default WeatherDashboard;
