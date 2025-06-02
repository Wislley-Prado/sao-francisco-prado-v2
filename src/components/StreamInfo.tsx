
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Wind, Eye, Droplets, Clock, TrendingUp } from 'lucide-react';
import { useWeatherData } from '@/hooks/useWeatherData';

const StreamInfo = () => {
  const apiKey = localStorage.getItem('openweather_api_key');
  const { data: weatherData } = useWeatherData(apiKey);
  
  const currentTime = new Date().toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Usar dados reais se disponíveis, senão usar dados padrão
  const temperature = weatherData?.current.temperature || 23;
  const windSpeed = weatherData?.current.wind_speed || 5;
  const humidity = weatherData?.current.humidity || 78;
  const visibility = weatherData?.current.visibility || 10;

  // Determinar visibilidade em texto
  const getVisibilityText = (visibility: number) => {
    if (visibility >= 10) return 'Excelente';
    if (visibility >= 5) return 'Boa';
    if (visibility >= 2) return 'Regular';
    return 'Ruim';
  };

  const getVisibilityColor = (visibility: number) => {
    if (visibility >= 10) return 'bg-green-100 text-green-800';
    if (visibility >= 5) return 'bg-blue-100 text-blue-800';
    if (visibility >= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-4">
      {/* Weather Conditions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Thermometer className="h-5 w-5 text-rio-blue mr-2" />
            Condições Meteorológicas
            {weatherData && (
              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">REAL</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Temperatura</span>
            <span className="font-medium">{temperature}°C</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center">
              <Wind className="h-4 w-4 mr-1" />
              Vento
            </span>
            <span className="font-medium">{windSpeed} km/h {weatherData?.current.wind_direction ? `${Math.round(weatherData.current.wind_direction)}°` : 'NE'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center">
              <Droplets className="h-4 w-4 mr-1" />
              Umidade
            </span>
            <span className="font-medium">{humidity}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              Visibilidade
            </span>
            <Badge className={getVisibilityColor(visibility)}>
              {getVisibilityText(visibility)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Fishing Conditions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-5 w-5 text-water-green mr-2" />
            Condições de Pesca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Atividade dos Peixes</span>
            <Badge className={
              temperature >= 22 && temperature <= 26 ? "bg-green-100 text-green-800" :
              temperature >= 18 && temperature <= 30 ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            }>
              {temperature >= 22 && temperature <= 26 ? 'Alta' :
               temperature >= 18 && temperature <= 30 ? 'Moderada' : 'Baixa'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Nível da Água</span>
            <span className="font-medium">85% Normal</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Corrente</span>
            <span className="font-medium">
              {windSpeed <= 10 ? 'Fraca' : windSpeed <= 20 ? 'Moderada' : 'Forte'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Melhor Horário</span>
            <span className="font-medium text-sunset-orange">
              {weatherData ? 
                `${new Date(weatherData.current.sunrise * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}-${new Date(weatherData.current.sunrise * 1000 + 2 * 3600000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` :
                '05:00-07:00'
              }
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Live Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-5 w-5 text-sunset-orange mr-2" />
            Estatísticas Ao Vivo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Última Atualização</span>
            <span className="font-medium">{currentTime}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Espectadores</span>
            <span className="font-medium text-rio-blue">127 online</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Qualidade do Stream</span>
            <Badge className="bg-blue-100 text-blue-800">HD 720p</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Status da Conexão</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-green-600">Estável</span>
            </div>
          </div>
          {weatherData && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Dados Meteorológicos</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-600">Conectado</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StreamInfo;
