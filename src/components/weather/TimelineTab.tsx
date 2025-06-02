
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TimelineTabProps {
  weatherData: any;
  current: any;
  getWeatherIcon: (iconCode: string) => React.ReactNode;
  now: Date;
}

const TimelineTab = ({ weatherData, current, getWeatherIcon, now }: TimelineTabProps) => {
  const hourlyChartData = weatherData.hourly.map((hour: any, index: number) => {
    const hourDate = new Date(now.getTime() + (index * 3600000));
    return {
      time: hourDate.toLocaleTimeString('pt-BR', { hour: '2-digit' }),
      fullTime: hourDate.toLocaleString('pt-BR', { 
        weekday: 'short', 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      temperatura: hour.temperature,
      vento: hour.wind_speed,
      chuva: hour.pop
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Previsão Horária - Próximas 24h</CardTitle>
        <p className="text-sm text-gray-600">
          Horários detalhados com data e hora para planejamento preciso
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64 sm:h-80 mb-4 sm:mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis yAxisId="temp" orientation="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="wind" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}${name === 'temperatura' ? '°C' : name === 'vento' ? ' km/h' : '%'}`,
                  name === 'temperatura' ? 'Temperatura' : name === 'vento' ? 'Vento' : 'Chuva'
                ]}
                labelFormatter={(label, payload) => {
                  const data = payload?.[0]?.payload;
                  return data?.fullTime || label;
                }}
              />
              <Line yAxisId="temp" type="monotone" dataKey="temperatura" stroke="#3b82f6" strokeWidth={3} />
              <Line yAxisId="wind" type="monotone" dataKey="vento" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-4">
          {weatherData.hourly.slice(0, 8).map((hour: any, index: number) => {
            const hourDate = new Date(hour.dt * 1000);
            const currentDataDateOnly = new Date(current.dt * 1000);
            currentDataDateOnly.setHours(0, 0, 0, 0);
            
            const hourDateOnly = new Date(hourDate);
            hourDateOnly.setHours(0, 0, 0, 0);
            
            const isToday = hourDateOnly.getTime() === currentDataDateOnly.getTime();
            const dayLabel = isToday ? 'Hoje' : hourDate.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' });
            
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-2 sm:p-3">
                  <div className="text-xs text-blue-600 font-medium mb-1">
                    {dayLabel}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {hourDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(hour.weather_icon)}
                  </div>
                  <div className="font-bold text-sm sm:text-base">{hour.temperature}°</div>
                  <div className="text-xs text-gray-600">{hour.pop}% 💧</div>
                  <div className="text-xs text-gray-600">{hour.wind_speed} km/h</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineTab;
