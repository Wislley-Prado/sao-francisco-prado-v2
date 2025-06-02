
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  RefreshCw,
  Settings,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import { useWeatherData } from '@/hooks/useWeatherData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const WeatherDashboard = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('openweather_api_key') || '');
  const [showSettings, setShowSettings] = useState(!apiKey);
  
  const { data: weatherData, isLoading, error, refetch } = useWeatherData(apiKey);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openweather_api_key', apiKey.trim());
      setShowSettings(false);
      refetch();
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      '01d': <Sun className="h-6 w-6 text-yellow-500" />,
      '01n': <Sun className="h-6 w-6 text-gray-400" />,
      '02d': <Cloud className="h-6 w-6 text-gray-500" />,
      '02n': <Cloud className="h-6 w-6 text-gray-600" />,
      '03d': <Cloud className="h-6 w-6 text-gray-500" />,
      '03n': <Cloud className="h-6 w-6 text-gray-600" />,
      '04d': <Cloud className="h-6 w-6 text-gray-600" />,
      '04n': <Cloud className="h-6 w-6 text-gray-700" />,
      '09d': <CloudRain className="h-6 w-6 text-blue-500" />,
      '09n': <CloudRain className="h-6 w-6 text-blue-600" />,
      '10d': <CloudRain className="h-6 w-6 text-blue-500" />,
      '10n': <CloudRain className="h-6 w-6 text-blue-600" />,
      '11d': <CloudRain className="h-6 w-6 text-purple-500" />,
      '11n': <CloudRain className="h-6 w-6 text-purple-600" />,
    };
    return iconMap[iconCode] || <Sun className="h-6 w-6 text-yellow-500" />;
  };

  const getFishingCondition = (weather: any) => {
    if (!weather) return { status: 'unknown', text: 'Dados indisponíveis', color: 'bg-gray-500' };
    
    const temp = weather.current.temperature;
    const wind = weather.current.wind_speed;
    const clouds = weather.current.clouds;
    const pressure = weather.current.pressure;
    
    // Lógica para condições de pesca
    let score = 0;
    
    // Temperatura ideal: 20-28°C
    if (temp >= 20 && temp <= 28) score += 3;
    else if (temp >= 18 && temp <= 30) score += 2;
    else score += 1;
    
    // Vento: até 15km/h é bom
    if (wind <= 10) score += 3;
    else if (wind <= 15) score += 2;
    else if (wind <= 25) score += 1;
    
    // Nebulosidade: 20-60% é ideal
    if (clouds >= 20 && clouds <= 60) score += 2;
    else if (clouds <= 80) score += 1;
    
    // Pressão: estável é melhor
    if (pressure >= 1013 && pressure <= 1020) score += 2;
    else if (pressure >= 1008 && pressure <= 1025) score += 1;
    
    if (score >= 8) return { status: 'excellent', text: 'Excelente', color: 'bg-green-500' };
    if (score >= 6) return { status: 'good', text: 'Boa', color: 'bg-blue-500' };
    if (score >= 4) return { status: 'fair', text: 'Regular', color: 'bg-yellow-500' };
    return { status: 'poor', text: 'Ruim', color: 'bg-red-500' };
  };

  if (showSettings || !apiKey) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Configurar API OpenWeatherMap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">API Key</label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Sua chave da API OpenWeatherMap"
            />
          </div>
          <Button onClick={handleSaveApiKey} className="w-full">
            Salvar e Carregar Dados
          </Button>
          <p className="text-xs text-gray-600">
            Seus dados meteorológicos serão atualizados automaticamente a cada 10 minutos.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2">Carregando dados meteorológicos...</span>
        </CardContent>
      </Card>
    );
  }

  if (error || !weatherData) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-red-600 mb-4">Erro ao carregar dados meteorológicos</p>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => refetch()}>
              Tentar Novamente
            </Button>
            <Button variant="outline" onClick={() => setShowSettings(true)}>
              Configurar API
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const current = weatherData.current;
  const fishingCondition = getFishingCondition(weatherData);

  // Preparar dados para gráficos
  const hourlyChartData = weatherData.hourly.map(hour => ({
    time: new Date(hour.dt * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit' }),
    temperatura: hour.temperature,
    vento: hour.wind_speed,
    chuva: hour.pop
  }));

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Condições Meteorológicas
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dados em tempo real para Três Marias/MG. 
            Planeje sua pescaria com informações precisas e atualizadas.
          </p>
        </div>

        {/* Condições Atuais */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Temperatura Principal */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                {getWeatherIcon(current.weather_icon)}
                <div>
                  <CardTitle className="text-xl">Três Marias, MG</CardTitle>
                  <p className="text-sm text-gray-600 capitalize">{current.weather_description}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl font-bold text-gray-900">{current.temperature}°C</div>
                  <div className="text-sm text-gray-600">Sensação: {current.feels_like}°C</div>
                  <div className="text-xs text-gray-500 mt-2">
                    Atualizado: {new Date(current.dt * 1000).toLocaleTimeString('pt-BR')}
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${fishingCondition.color} text-white mb-2`}>
                    Pesca: {fishingCondition.text}
                  </Badge>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center">
                      <Sunrise className="h-4 w-4 mr-1" />
                      {new Date(current.sunrise * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center">
                      <Sunset className="h-4 w-4 mr-1" />
                      {new Date(current.sunset * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métricas Rápidas */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Wind className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Vento</span>
                </div>
                <div className="text-2xl font-bold">{current.wind_speed} km/h</div>
                <div className="text-xs text-gray-600">{current.wind_direction}°</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Umidade</span>
                </div>
                <div className="text-2xl font-bold">{current.humidity}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Gauge className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Pressão</span>
                </div>
                <div className="text-2xl font-bold">{current.pressure}</div>
                <div className="text-xs text-gray-600">hPa</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Visibilidade</span>
                </div>
                <div className="text-2xl font-bold">{current.visibility}</div>
                <div className="text-xs text-gray-600">km</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs para diferentes visualizações */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timeline" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Linha do Tempo
            </TabsTrigger>
            <TabsTrigger value="forecast" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Previsão 7 Dias
            </TabsTrigger>
            <TabsTrigger value="fishing" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Para Pesca
            </TabsTrigger>
          </TabsList>

          {/* Timeline - Próximas 24 horas */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Previsão Horária - Próximas 24h</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hourlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="temp" orientation="left" />
                      <YAxis yAxisId="wind" orientation="right" />
                      <Tooltip 
                        formatter={(value, name) => [
                          `${value}${name === 'temperatura' ? '°C' : name === 'vento' ? ' km/h' : '%'}`,
                          name === 'temperatura' ? 'Temperatura' : name === 'vento' ? 'Vento' : 'Chuva'
                        ]}
                      />
                      <Line yAxisId="temp" type="monotone" dataKey="temperatura" stroke="#3b82f6" strokeWidth={3} />
                      <Line yAxisId="wind" type="monotone" dataKey="vento" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Cards horários */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                  {weatherData.hourly.slice(0, 8).map((hour, index) => (
                    <Card key={index} className="text-center">
                      <CardContent className="p-3">
                        <div className="text-xs text-gray-600 mb-1">
                          {new Date(hour.dt * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex justify-center mb-2">
                          {getWeatherIcon(hour.weather_icon)}
                        </div>
                        <div className="font-bold">{hour.temperature}°</div>
                        <div className="text-xs text-gray-600">{hour.pop}% 💧</div>
                        <div className="text-xs text-gray-600">{hour.wind_speed} km/h</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Previsão 7 dias */}
          <TabsContent value="forecast">
            <Card>
              <CardHeader>
                <CardTitle>Previsão para os Próximos Dias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weatherData.daily.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium w-20">
                          {index === 0 ? 'Hoje' : new Date(day.dt * 1000).toLocaleDateString('pt-BR', { weekday: 'short' })}
                        </div>
                        {getWeatherIcon(day.weather_icon)}
                        <div className="text-sm capitalize">{day.weather_description}</div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="text-xs text-gray-600">Chuva</div>
                          <div>{day.pop}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-600">Vento</div>
                          <div>{day.wind_speed} km/h</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-600">Min/Max</div>
                          <div className="font-bold">{day.temp_min}°/{day.temp_max}°</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Condições para pesca */}
          <TabsContent value="fishing">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Condições Atuais para Pesca</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span>Condição Geral</span>
                    <Badge className={`${fishingCondition.color} text-white`}>
                      {fishingCondition.text}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Temperatura da Água (est.)</span>
                      <span className="font-medium">{Math.max(current.temperature - 3, 18)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Atividade dos Peixes</span>
                      <span className="font-medium">
                        {current.temperature >= 22 && current.temperature <= 26 ? 'Alta' : 
                         current.temperature >= 18 && current.temperature <= 30 ? 'Moderada' : 'Baixa'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Melhor Período</span>
                      <span className="font-medium">
                        {new Date(current.sunrise * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(current.sunrise * 1000 + 2 * 3600000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Condições do Vento</span>
                      <span className="font-medium">
                        {current.wind_speed <= 10 ? 'Excelente' : 
                         current.wind_speed <= 20 ? 'Boa' : 'Desafiadora'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dicas para Hoje</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
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

        {/* Configurações */}
        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => setShowSettings(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configurar API
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WeatherDashboard;
