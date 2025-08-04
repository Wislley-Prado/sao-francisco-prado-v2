
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StreamPlayer from '@/components/StreamPlayer';
import StreamInfo from '@/components/StreamInfo';
import StreamControls from '@/components/StreamControls';
import { ArrowLeft, Radio, Waves, Info, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWeatherData } from '@/hooks/useWeatherData';
import { useDamData } from '@/hooks/useDamData';
import { getVisibilityText } from '@/utils/weatherUtils';

const LiveStream = () => {
  const { data: weatherData, isLoading: weatherLoading } = useWeatherData();
  const { data: damData, isLoading: damLoading } = useDamData();

  const currentTemp = weatherData?.current?.temperature ? Math.round(weatherData.current.temperature) : '--';
  const currentWind = weatherData?.current?.wind_speed ? Math.round(weatherData.current.wind_speed) : '--';
  const currentVisibility = weatherData?.current?.visibility ? getVisibilityText(weatherData.current.visibility) : '--';
  const damLevel = damData?.volume_util_percentual ? parseFloat(damData.volume_util_percentual).toFixed(0) : '--';

  return (
    <div className="min-h-screen bg-gradient-to-br from-rio-blue/5 to-water-green/5">
      {/* Header Compacto */}
      <div className="bg-rio-blue text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Radio className="h-6 w-6 animate-pulse" />
              <Badge className="bg-red-500 text-white animate-pulse">AO VIVO</Badge>
            </div>
          </div>
          <h1 className="text-lg md:text-xl font-bold">Rio São Francisco - Transmissão</h1>
        </div>
      </div>

      {/* Primeira Dobra - Player Principal */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Video Player - Destaque Principal */}
        <div className="mb-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Player ocupa toda a área disponível */}
              <div className="aspect-video">
                <StreamPlayer />
              </div>
              {/* Controles integrados */}
              <div className="p-4">
                <StreamControls />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Layout Mobile - Tabs para Informações */}
        <div className="lg:hidden">
          <Tabs defaultValue="conditions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="conditions" className="flex items-center">
                <Waves className="h-4 w-4 mr-1" />
                Condições
              </TabsTrigger>
              <TabsTrigger value="info" className="flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center">
                <Settings className="h-4 w-4 mr-1" />
                Estatísticas
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="conditions" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Condições Atuais do Rio</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-rio-blue">{currentTemp}°C</div>
                      <div className="text-sm text-gray-600">Temperatura</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-water-green">{currentVisibility}</div>
                      <div className="text-sm text-gray-600">Visibilidade</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-xl font-bold text-sunset-orange">{currentWind} km/h</div>
                      <div className="text-sm text-gray-600">Vento</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-rio-blue">{damLevel}%</div>
                      <div className="text-sm text-gray-600">Nível da Represa</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="info" className="mt-4">
              <StreamInfo />
            </TabsContent>
            
            <TabsContent value="stats" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Estatísticas da Transmissão</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Espectadores Online</span>
                      <span className="font-medium text-rio-blue">127</span>
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
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tempo Online</span>
                      <span className="font-medium">2h 34min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Layout Desktop - Lado a Lado */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-1">
            <StreamInfo />
          </div>
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Waves className="h-5 w-5 text-rio-blue mr-2" />
                  Condições Atuais do Rio
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-rio-blue">{currentTemp}°C</div>
                    <div className="text-sm text-gray-600">Temperatura</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-water-green">{currentVisibility}</div>
                    <div className="text-sm text-gray-600">Visibilidade</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-sunset-orange">{currentWind} km/h</div>
                    <div className="text-sm text-gray-600">Vento</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-rio-blue">{damLevel}%</div>
                    <div className="text-sm text-gray-600">Nível da Represa</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
