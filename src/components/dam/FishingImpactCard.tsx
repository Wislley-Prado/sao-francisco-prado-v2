
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface FishingImpactCardProps {
  currentLevel: number;
}

const FishingImpactCard: React.FC<FishingImpactCardProps> = ({ currentLevel }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-water-green text-white">
        <CardTitle className="flex items-center">
          <CheckCircle className="mr-2 h-5 w-5" />
          Impacto na Pesca
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${currentLevel >= 60 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm text-gray-700">
              {currentLevel >= 60 ? 'Acesso total aos pontos de pesca' : 'Acesso limitado a alguns pontos'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${currentLevel >= 70 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm text-gray-700">
              {currentLevel >= 70 ? 'Navegação sem restrições' : 'Navegação com cuidado'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${currentLevel >= 50 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
            <span className="text-sm text-gray-700">
              {currentLevel >= 50 ? 'Peixes ativos em várias profundidades' : 'Peixes concentrados em áreas mais profundas'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Sempre observe as condições locais</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FishingImpactCard;
