
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Waves } from 'lucide-react';
import { Condition } from '@/types/damData';
import { getStatusColor, getStatusText } from '@/utils/damStatus';
import { analyzeSpillwayStatus } from '@/utils/spillwayUtils';

interface ConditionsGridProps {
  conditions: Condition[];
  defluencia?: string;
}

const ConditionsGrid: React.FC<ConditionsGridProps> = ({ conditions, defluencia }) => {
  const spillwayStatus = defluencia ? analyzeSpillwayStatus(defluencia) : null;

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {conditions.map((condition, index) => (
        <div key={index} className="bg-sand-beige rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-gray-700">
              {condition.icon}
              <span className="font-medium">{condition.label}</span>
              {/* Adicionar indicador especial para defluência */}
              {condition.label === "Defluência" && spillwayStatus?.isActive && (
                <Waves className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <div className="flex items-center space-x-2">
              {condition.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
              {condition.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
              {condition.trend === 'stable' && <div className="w-4 h-4"></div>}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              {condition.value}
            </span>
            <div className="flex flex-col items-end space-y-1">
              <Badge className={`${getStatusColor(condition.status)} text-white`}>
                {getStatusText(condition.status)}
              </Badge>
              {/* Mostrar status do vertedouro para defluência */}
              {condition.label === "Defluência" && spillwayStatus && (
                <Badge 
                  variant="outline" 
                  className={`${spillwayStatus.color} text-white text-xs`}
                >
                  {spillwayStatus.description}
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConditionsGrid;
