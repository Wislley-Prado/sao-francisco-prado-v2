import React from 'react';
import { 
  Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, ComposedChart
} from 'recharts';

interface ChartDataPoint {
  data: string;
  dataCompleta: string;
  nivel: number;
  cota: number;
  afluencia: number;
  defluencia: number;
}

interface DamHistoryChartsProps {
  chartData: ChartDataPoint[];
}

const DamHistoryCharts: React.FC<DamHistoryChartsProps> = ({ chartData }) => {
  return (
    <>
      {/* Gráfico de Nível (Volume Útil) */}
      <div>
        <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500"></div>
          Volume Útil (%)
        </h4>
        <div className="h-44 sm:h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="nivelGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="data" fontSize={10} stroke="#6b7280" tickMargin={6} />
              <YAxis fontSize={10} stroke="#6b7280" domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                formatter={(value: any) => [
                  `${typeof value === 'number' && !isNaN(value) ? value.toFixed(1) : (parseFloat(value) || 0).toFixed(1)}%`, 
                  'Volume Útil'
                ]}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Area type="monotone" dataKey="nivel" stroke="#3b82f6" fill="url(#nivelGradient)" strokeWidth={2} />
              <Line type="monotone" dataKey="nivel" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }} activeDot={{ r: 5, fill: '#2563eb' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumo estatístico simples de nível */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-4 border-t max-w-md mx-auto">
        <div className="text-center p-3 rounded-xl bg-blue-50/50 border border-blue-100">
          <p className="text-xs text-muted-foreground font-medium">Nível Mínimo no Período</p>
          <p className="text-base sm:text-xl font-bold text-blue-600">
            {(() => {
              const valid = chartData.map(d => d.nivel).filter(v => typeof v === 'number' && !isNaN(v));
              return valid.length > 0 ? Math.min(...valid).toFixed(1) : '0.0';
            })()}%
          </p>
        </div>
        <div className="text-center p-3 rounded-xl bg-blue-50/50 border border-blue-100">
          <p className="text-xs text-muted-foreground font-medium">Nível Máximo no Período</p>
          <p className="text-base sm:text-xl font-bold text-blue-600">
            {(() => {
              const valid = chartData.map(d => d.nivel).filter(v => typeof v === 'number' && !isNaN(v));
              return valid.length > 0 ? Math.max(...valid).toFixed(1) : '0.0';
            })()}%
          </p>
        </div>
      </div>
    </>
  );
};

export default DamHistoryCharts;
