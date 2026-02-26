import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  time: string;
  nivel: number;
  afluencia: number;
  defluencia: number;
  dataCompleta: string;
}

interface DamLevelChartProps {
  trendData: ChartDataPoint[];
  dataUpdatedAt: number;
  renderCount: number;
}

const DamLevelChart: React.FC<DamLevelChartProps> = ({ trendData, dataUpdatedAt, renderCount }) => {
  const chartKey = `chart-${dataUpdatedAt}-${trendData.length}-${renderCount}`;

  return (
    <div className="mt-6">
      <h5 className="text-sm font-medium text-gray-700 mb-3">
        Tendência Últimos 7 Dias
      </h5>
      <div className="h-24 sm:h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} key={chartKey}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" fontSize={10} stroke="#6b7280" />
            <YAxis fontSize={10} stroke="#6b7280" domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: 'white' }}
              formatter={(value, name) => [
                `${value}${name === 'nivel' ? '%' : ' m³/s'}`,
                name === 'nivel' ? 'Nível' : name === 'afluencia' ? 'Afluência' : 'Defluência'
              ]}
            />
            <Line type="monotone" dataKey="nivel" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DamLevelChart;
