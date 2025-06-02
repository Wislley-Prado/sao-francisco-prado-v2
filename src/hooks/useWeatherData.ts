
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

// Função para buscar dados reais da API OpenWeatherMap
const fetchWeatherData = async (): Promise<WeatherData> => {
  console.log('🌤️ [WEATHER] Buscando dados reais da API OpenWeatherMap...');
  
  // Coordenadas de Três Marias/MG
  const lat = -18.2028;
  const lon = -45.2394;
  const apiKey = 'SUA_API_KEY_AQUI'; // Você precisa colocar sua chave da API aqui
  
  try {
    // Uma única chamada para o One Call API 3.0 que traz tudo
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`
    );
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ [WEATHER] Dados da API recebidos com sucesso');
    
    return {
      current: {
        temperature: Math.round(data.current.temp),
        feels_like: Math.round(data.current.feels_like),
        humidity: data.current.humidity,
        pressure: data.current.pressure,
        wind_speed: Math.round(data.current.wind_speed * 3.6), // m/s para km/h
        wind_direction: data.current.wind_deg || 0,
        visibility: Math.round((data.current.visibility || 10000) / 1000), // metros para km
        uv_index: Math.round(data.current.uvi || 0),
        clouds: data.current.clouds,
        weather_main: data.current.weather[0].main,
        weather_description: data.current.weather[0].description,
        weather_icon: data.current.weather[0].icon,
        sunrise: data.current.sunrise,
        sunset: data.current.sunset,
        dt: data.current.dt
      },
      hourly: data.hourly.slice(0, 24).map((hour: any) => ({
        dt: hour.dt,
        temperature: Math.round(hour.temp),
        feels_like: Math.round(hour.feels_like),
        humidity: hour.humidity,
        wind_speed: Math.round(hour.wind_speed * 3.6),
        wind_direction: hour.wind_deg || 0,
        weather_main: hour.weather[0].main,
        weather_description: hour.weather[0].description,
        weather_icon: hour.weather[0].icon,
        pop: Math.round(hour.pop * 100),
        clouds: hour.clouds
      })),
      daily: data.daily.slice(0, 7).map((day: any) => ({
        dt: day.dt,
        temp_min: Math.round(day.temp.min),
        temp_max: Math.round(day.temp.max),
        humidity: day.humidity,
        wind_speed: Math.round(day.wind_speed * 3.6),
        weather_main: day.weather[0].main,
        weather_description: day.weather[0].description,
        weather_icon: day.weather[0].icon,
        pop: Math.round(day.pop * 100),
        sunrise: day.sunrise,
        sunset: day.sunset
      })),
      location: {
        name: 'Três Marias',
        country: 'BR',
        timezone: data.timezone
      }
    };
  } catch (error) {
    console.error('❌ [WEATHER] Erro ao buscar dados da API:', error);
    
    // Fallback para dados simulados se a API falhar
    console.log('🔄 [WEATHER] Usando dados simulados como fallback...');
    return generateFallbackData();
  }
};

// Função de fallback com dados simulados
const generateFallbackData = (): WeatherData => {
  const now = new Date();
  const currentTimestamp = Math.floor(now.getTime() / 1000);
  
  const baseTemp = 25 + Math.sin(now.getHours() / 24 * Math.PI * 2) * 8;
  const temperature = Math.round(baseTemp + (Math.random() - 0.5) * 4);
  
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
    humidity: 60 + Math.round(Math.random() * 30),
    pressure: 1010 + Math.round(Math.random() * 20),
    wind_speed: Math.round(Math.random() * 20),
    wind_direction: Math.round(Math.random() * 360),
    visibility: 8 + Math.round(Math.random() * 7),
    uv_index: Math.max(0, Math.round(Math.random() * 12)),
    clouds: Math.round(Math.random() * 100),
    weather_main: currentWeather.main,
    weather_description: currentWeather.description,
    weather_icon: currentWeather.icon,
    sunrise: Math.floor(now.setHours(6, 0, 0, 0) / 1000),
    sunset: Math.floor(now.setHours(18, 30, 0, 0) / 1000),
    dt: currentTimestamp
  };

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
    queryKey: ['weather', 'tres-marias'],
    queryFn: fetchWeatherData,
    refetchInterval: 30 * 60 * 1000, // Atualizar apenas a cada 30 minutos (48 chamadas/dia)
    staleTime: 25 * 60 * 1000, // Dados ficam fresh por 25 minutos
    retry: 1, // Apenas 1 tentativa para não desperdiçar chamadas
    retryDelay: 30000, // 30 segundos entre tentativas
    refetchOnWindowFocus: false, // Não atualizar quando a janela ganha foco
    refetchOnMount: false, // Não atualizar sempre que o componente monta (use cache)
  });
};
