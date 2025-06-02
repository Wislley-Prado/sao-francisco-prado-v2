
import { useQuery } from '@tanstack/react-query';

// Interface para dados meteorológicos atuais
export interface CurrentWeather {
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  visibility: number;
  uv_index: number;
  clouds: number;
  weather_main: string;
  weather_description: string;
  weather_icon: string;
  sunrise: number;
  sunset: number;
  dt: number;
}

// Interface para previsão horária
export interface HourlyForecast {
  dt: number;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  weather_main: string;
  weather_description: string;
  weather_icon: string;
  pop: number; // probability of precipitation
  clouds: number;
}

// Interface para previsão diária
export interface DailyForecast {
  dt: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind_speed: number;
  weather_main: string;
  weather_description: string;
  weather_icon: string;
  pop: number;
  sunrise: number;
  sunset: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  location: {
    name: string;
    country: string;
    timezone: string;
  };
}

// Função para gerar dados simulados realistas
const generateMockWeatherData = (): WeatherData => {
  console.log('🌤️ [WEATHER] Gerando dados simulados para Três Marias/MG...');
  
  const now = new Date();
  const currentTimestamp = Math.floor(now.getTime() / 1000);
  
  // Temperatura base realista para Três Marias/MG
  const baseTemp = 25 + Math.sin(now.getHours() / 24 * Math.PI * 2) * 8; // Varia entre 17-33°C
  const temperature = Math.round(baseTemp + (Math.random() - 0.5) * 4);
  
  // Condições climáticas típicas da região
  const weatherConditions = [
    { main: 'Clear', description: 'céu limpo', icon: '01d' },
    { main: 'Clouds', description: 'parcialmente nublado', icon: '02d' },
    { main: 'Clouds', description: 'nublado', icon: '03d' },
    { main: 'Rain', description: 'chuva leve', icon: '10d' }
  ];
  const currentWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
  
  const current: CurrentWeather = {
    temperature,
    feels_like: temperature + Math.round((Math.random() - 0.5) * 4),
    humidity: 60 + Math.round(Math.random() * 30), // 60-90%
    pressure: 1010 + Math.round(Math.random() * 20), // 1010-1030 hPa
    wind_speed: Math.round(Math.random() * 20), // 0-20 km/h
    wind_direction: Math.round(Math.random() * 360),
    visibility: 8 + Math.round(Math.random() * 7), // 8-15 km
    uv_index: Math.max(0, Math.round(Math.random() * 12)),
    clouds: Math.round(Math.random() * 100),
    weather_main: currentWeather.main,
    weather_description: currentWeather.description,
    weather_icon: currentWeather.icon,
    sunrise: Math.floor(now.setHours(6, 0, 0, 0) / 1000),
    sunset: Math.floor(now.setHours(18, 30, 0, 0) / 1000),
    dt: currentTimestamp
  };

  // Gerar previsão horária (próximas 24h)
  const hourly: HourlyForecast[] = [];
  for (let i = 1; i <= 24; i++) {
    const hourTimestamp = currentTimestamp + (i * 3600);
    const hourTemp = Math.round(baseTemp + Math.sin((now.getHours() + i) / 24 * Math.PI * 2) * 6 + (Math.random() - 0.5) * 3);
    const hourWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    hourly.push({
      dt: hourTimestamp,
      temperature: hourTemp,
      feels_like: hourTemp + Math.round((Math.random() - 0.5) * 3),
      humidity: 55 + Math.round(Math.random() * 35),
      wind_speed: Math.round(Math.random() * 18),
      wind_direction: Math.round(Math.random() * 360),
      weather_main: hourWeather.main,
      weather_description: hourWeather.description,
      weather_icon: hourWeather.icon,
      pop: Math.round(Math.random() * 100),
      clouds: Math.round(Math.random() * 100)
    });
  }

  // Gerar previsão diária (próximos 7 dias)
  const daily: DailyForecast[] = [];
  for (let i = 1; i <= 7; i++) {
    const dayTimestamp = currentTimestamp + (i * 24 * 3600);
    const dayBaseTemp = 25 + (Math.random() - 0.5) * 10;
    const dayWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    daily.push({
      dt: dayTimestamp,
      temp_min: Math.round(dayBaseTemp - 5 - Math.random() * 3),
      temp_max: Math.round(dayBaseTemp + 5 + Math.random() * 3),
      humidity: 60 + Math.round(Math.random() * 30),
      wind_speed: Math.round(Math.random() * 25),
      weather_main: dayWeather.main,
      weather_description: dayWeather.description,
      weather_icon: dayWeather.icon,
      pop: Math.round(Math.random() * 100),
      sunrise: Math.floor(new Date(dayTimestamp * 1000).setHours(6, 0, 0, 0) / 1000),
      sunset: Math.floor(new Date(dayTimestamp * 1000).setHours(18, 30, 0, 0) / 1000)
    });
  }

  console.log('✅ [WEATHER] Dados simulados gerados com sucesso');

  return {
    current,
    hourly,
    daily,
    location: {
      name: 'Três Marias',
      country: 'BR',
      timezone: 'America/Sao_Paulo'
    }
  };
};

export const useWeatherData = () => {
  return useQuery({
    queryKey: ['weather', 'tres-marias-mock'],
    queryFn: generateMockWeatherData,
    refetchInterval: 5 * 60 * 1000, // Atualizar a cada 5 minutos para simular mudanças
    staleTime: 2 * 60 * 1000, // Dados ficam fresh por 2 minutos
    retry: 1,
  });
};
