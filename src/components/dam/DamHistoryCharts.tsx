import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, Area, ComposedChart, Bar
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
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          Volume Útil (%)
        </h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="nivelGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="data" fontSize={11} stroke="#6b7280" tickMargin={8} />
              <YAxis fontSize={11} stroke="#6b7280" domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Volume Útil']}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Area type="monotone" dataKey="nivel" stroke="#3b82f6" fill="url(#nivelGradient)" strokeWidth={2} />
              <Line type="monotone" dataKey="nivel" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#2563eb' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Afluência e Defluência */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-4">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            Afluência
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            Defluência
          </span>
          <span className="text-xs text-muted-foreground">(m³/s)</span>
        </h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="data" fontSize={11} stroke="#6b7280" tickMargin={8} />
              <YAxis fontSize={11} stroke="#6b7280" tickFormatter={(value) => `${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number, name: string) => [`${value} m³/s`, name === 'afluencia' ? 'Afluência' : 'Defluência']}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Legend formatter={(value) => value === 'afluencia' ? 'Afluência' : 'Defluência'} />
              <Bar dataKey="afluencia" fill="#22c55e" radius={[4, 4, 0, 0]} opacity={0.8} />
              <Line type="monotone" dataKey="defluencia" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumo estatístico */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Nível Mín</p>
          <p className="text-lg font-semibold text-blue-600">{Math.min(...chartData.map(d => d.nivel)).toFixed(1)}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Nível Máx</p>
          <p className="text-lg font-semibold text-blue-600">{Math.max(...chartData.map(d => d.nivel)).toFixed(1)}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Média Afluência</p>
          <p className="text-lg font-semibold text-green-600">{(chartData.reduce((acc, d) => acc + d.afluencia, 0) / chartData.length).toFixed(0)} m³/s</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Média Defluência</p>
          <p className="text-lg font-semibold text-orange-600">{(chartData.reduce((acc, d) => acc + d.defluencia, 0) / chartData.length).toFixed(0)} m³/s</p>
        </div>
      </div>
    </>
  );
};

export default DamHistoryCharts;
