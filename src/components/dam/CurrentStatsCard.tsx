
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { DamData } from '@/types/damData';

interface CurrentStatsCardProps {
  damData: DamData | undefined;
  currentLevel: number;
  volumePercentual: number;
  afluencia: string;
  defluencia: string;
}

const CurrentStatsCard: React.FC<CurrentStatsCardProps> = ({ 
  damData, 
  currentLevel, 
  volumePercentual, 
  afluencia, 
  defluencia 
}) => {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-sunset-orange text-white">
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Dados Atuais
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-900">Nível Atual</p>
              <p className="text-sm text-gray-600">{currentLevel.toFixed(1)}%</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Volume Útil</p>
              <p className="text-sm text-gray-600">{volumePercentual.toFixed(1)}%</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Afluência</p>
              <p className="text-sm text-gray-600">{afluencia} m³/s</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Defluência</p>
              <p className="text-sm text-gray-600">{defluencia} m³/s</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Dados Técnicos</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Área do espelho:</span>
              <span className="font-medium">1.092 km²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Volume máximo:</span>
              <span className="font-medium">22,5 bi m³</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Profundidade máx:</span>
              <span className="font-medium">65m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status da conexão:</span>
              <span className={`font-medium ${damData ? 'text-green-600' : 'text-orange-600'}`}>
                {damData ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrentStatsCard;
