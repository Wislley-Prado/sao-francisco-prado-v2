import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  Eye, 
  Gauge,
  Sunrise,
  Sunset,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import { useWeatherData } from '@/hooks/useWeatherData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  const getFishingCondition = (weather: any) => {
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
            <CardContent className="text-center py-12">
              <p className="text-red-600 mb-4 text-sm sm:text-base">Erro ao carregar dados meteorológicos</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const current = weatherData.current;
  const fishingCondition = getFishingCondition(weatherData);

  // Usar a data atual do sistema para sincronizar
  const now = new Date();
  const currentDate = now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const hourlyChartData = weatherData.hourly.map((hour, index) => {
    const hourDate = new Date(now.getTime() + (index * 3600000));
    return {
      time: hourDate.toLocaleTimeString('pt-BR', { hour: '2-digit' }),
      fullTime: hourDate.toLocaleString('pt-BR', { 
        weekday: 'short', 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      temperatura: hour.temperature,
      vento: hour.wind_speed,
      chuva: hour.pop
    };
  });

  return (
    <section className="py-8 sm:py-16 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header com Data Atual */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-md mb-4">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-800 capitalize">{currentDate}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Condições Meteorológicas
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Dados em tempo real para Três Marias/MG. 
            Planeje sua pescaria com informações precisas e atualizadas.
          </p>
        </div>

        {/* Condições Atuais */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Temperatura Principal */}
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

          {/* Métricas Rápidas */}
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

          {/* Previsão 7 dias */}
          <TabsContent value="forecast">
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
                  {weatherData.daily.map((day, index) => {
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
                            <Badge className={`text-xs ${
                              day.temp_min >= 18 && day.temp_max <= 30 && day.wind_speed <= 15 && day.pop <= 30
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
          </TabsContent>

          {/* Timeline */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Previsão Horária - Próximas 24h</CardTitle>
                <p className="text-sm text-gray-600">
                  Horários detalhados com data e hora para planejamento preciso
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-64 sm:h-80 mb-4 sm:mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hourlyChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis yAxisId="temp" orientation="left" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="wind" orientation="right" tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value, name) => [
                          `${value}${name === 'temperatura' ? '°C' : name === 'vento' ? ' km/h' : '%'}`,
                          name === 'temperatura' ? 'Temperatura' : name === 'vento' ? 'Vento' : 'Chuva'
                        ]}
                        labelFormatter={(label, payload) => {
                          const data = payload?.[0]?.payload;
                          return data?.fullTime || label;
                        }}
                      />
                      <Line yAxisId="temp" type="monotone" dataKey="temperatura" stroke="#3b82f6" strokeWidth={3} />
                      <Line yAxisId="wind" type="monotone" dataKey="vento" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Cards horários com data/hora baseados na API */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-4">
                  {weatherData.hourly.slice(0, 8).map((hour, index) => {
                    const hourDate = new Date(hour.dt * 1000);
                    const currentDataDateOnly = new Date(current.dt * 1000);
                    currentDataDateOnly.setHours(0, 0, 0, 0);
                    
                    const hourDateOnly = new Date(hourDate);
                    hourDateOnly.setHours(0, 0, 0, 0);
                    
                    const isToday = hourDateOnly.getTime() === currentDataDateOnly.getTime();
                    const dayLabel = isToday ? 'Hoje' : hourDate.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' });
                    
                    return (
                      <Card key={index} className="text-center">
                        <CardContent className="p-2 sm:p-3">
                          <div className="text-xs text-blue-600 font-medium mb-1">
                            {dayLabel}
                          </div>
                          <div className="text-xs text-gray-600 mb-2">
                            {hourDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex justify-center mb-2">
                            {getWeatherIcon(hour.weather_icon)}
                          </div>
                          <div className="font-bold text-sm sm:text-base">{hour.temperature}°</div>
                          <div className="text-xs text-gray-600">{hour.pop}% 💧</div>
                          <div className="text-xs text-gray-600">{hour.wind_speed} km/h</div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Condições para pesca */}
          <TabsContent value="fishing">
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
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default WeatherDashboard;
