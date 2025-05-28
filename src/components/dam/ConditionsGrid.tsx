
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Condition } from '@/types/damData';
import { getStatusColor, getStatusText } from '@/utils/damStatus';

interface ConditionsGridProps {
  conditions: Condition[];
}

const ConditionsGrid: React.FC<ConditionsGridProps> = ({ conditions }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {conditions.map((condition, index) => (
        <div key={index} className="bg-sand-beige rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-gray-700">
              {condition.icon}
              <span className="font-medium">{condition.label}</span>
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
            <Badge className={`${getStatusColor(condition.status)} text-white`}>
              {getStatusText(condition.status)}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConditionsGrid;
