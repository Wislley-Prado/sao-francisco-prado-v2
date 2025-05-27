
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Wind, Eye, Droplets, Clock, TrendingUp } from 'lucide-react';

const StreamInfo = () => {
  const currentTime = new Date().toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="space-y-4">
      {/* Weather Conditions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Thermometer className="h-5 w-5 text-rio-blue mr-2" />
            Condições Meteorológicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Temperatura</span>
            <span className="font-medium">23°C</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center">
              <Wind className="h-4 w-4 mr-1" />
              Vento
            </span>
            <span className="font-medium">5 km/h NE</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center">
              <Droplets className="h-4 w-4 mr-1" />
              Umidade
            </span>
            <span className="font-medium">78%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              Visibilidade
            </span>
            <Badge className="bg-green-100 text-green-800">Boa</Badge>
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
            <Badge className="bg-green-100 text-green-800">Alta</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Nível da Água</span>
            <span className="font-medium">85% Normal</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Corrente</span>
            <span className="font-medium">Moderada</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Melhor Horário</span>
            <span className="font-medium text-sunset-orange">05:00-07:00</span>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default StreamInfo;
