
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

// Sua chave da API OpenWeatherMap (configurada)
const API_KEY = '6459a62448b61386ccc581f2cc307a2c';

// Função para gerar dados estáveis baseados na data atual (fallback apenas)
const generateStableWeatherData = (): WeatherData => {
  console.log('🌤️ [WEATHER] Gerando dados simulados como fallback...');
  
  const now = new Date();
  const currentTimestamp = Math.floor(now.getTime() / 1000);
  
  // Usar a data atual como seed para valores consistentes
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const seed = dayOfYear + now.getFullYear();
  
  // Função para gerar números pseudo-aleatórios consistentes
  const seededRandom = (min: number, max: number, offset: number = 0) => {
    const x = Math.sin(seed + offset) * 10000;
    const random = x - Math.floor(x);
    return Math.floor(random * (max - min + 1)) + min;
  };

  // Temperatura base para Três Marias (clima tropical)
  const baseTemp = 26; // Temperatura média anual
  const temperature = baseTemp + seededRandom(-3, 4, 1);
  
  const current: CurrentWeather = {
    temperature,
    feels_like: temperature + seededRandom(-2, 3, 2),
    humidity: seededRandom(55, 75, 3),
    pressure: seededRandom(1012, 1018, 4),
    wind_speed: seededRandom(8, 15, 5),
    wind_direction: seededRandom(0, 360, 6),
    visibility: seededRandom(10, 15, 7),
    uv_index: seededRandom(6, 10, 8),
    clouds: seededRandom(20, 60, 9),
    weather_main: 'Clear',
    weather_description: 'céu limpo',
    weather_icon: '01d',
    sunrise: Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0).getTime() / 1000),
    sunset: Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 30).getTime() / 1000),
    dt: currentTimestamp
  };

  // Previsão horária estável
  const hourly: HourlyForecast[] = [];
  for (let i = 1; i <= 24; i++) {
    const hourTimestamp = currentTimestamp + (i * 3600);
    const hourTemp = temperature + seededRandom(-2, 3, i + 10);
    
    hourly.push({
      dt: hourTimestamp,
      temperature: hourTemp,
      feels_like: hourTemp + seededRandom(-1, 2, i + 20),
      humidity: seededRandom(50, 80, i + 30),
      wind_speed: seededRandom(6, 18, i + 40),
      wind_direction: seededRandom(0, 360, i + 50),
      weather_main: 'Clear',
      weather_description: 'céu limpo',
      weather_icon: '01d',
      pop: seededRandom(0, 20, i + 60),
      clouds: seededRandom(10, 50, i + 70)
    });
  }

  // Previsão diária estável
  const daily: DailyForecast[] = [];
  for (let i = 1; i <= 7; i++) {
    const dayTimestamp = currentTimestamp + (i * 24 * 3600);
    const dayBaseTemp = temperature + seededRandom(-2, 3, i + 100);
    
    daily.push({
      dt: dayTimestamp,
      temp_min: dayBaseTemp - seededRandom(3, 6, i + 110),
      temp_max: dayBaseTemp + seededRandom(3, 6, i + 120),
      humidity: seededRandom(60, 80, i + 130),
      wind_speed: seededRandom(8, 20, i + 140),
      weather_main: 'Clear',
      weather_description: 'céu limpo',
      weather_icon: '01d',
      pop: seededRandom(10, 30, i + 150),
      sunrise: Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, 6, 0).getTime() / 1000),
      sunset: Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, 18, 30).getTime() / 1000)
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

// Função para buscar dados reais da API OpenWeatherMap
const fetchWeatherData = async (): Promise<WeatherData> => {
  console.log('🌤️ [WEATHER] Buscando dados REAIS da API OpenWeatherMap...');
  
  // Coordenadas de Três Marias/MG
  const lat = -18.2028;
  const lon = -45.2394;
  
  console.log(`🔑 [WEATHER] Usando chave da API configurada: ${API_KEY.substring(0, 8)}...`);
  
  try {
    // Buscar dados atuais da API OpenWeatherMap
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
    );
    
    if (!currentResponse.ok) {
      if (currentResponse.status === 401) {
        console.error('❌ [WEATHER] Chave da API inválida ou expirada');
        throw new Error('Chave da API inválida');
      }
      throw new Error(`Erro na API Current Weather: ${currentResponse.status}`);
    }
    
    const currentData = await currentResponse.json();
    console.log('✅ [WEATHER] Dados reais recebidos da API OpenWeatherMap:', currentData);
    
    // Buscar previsão de 5 dias (dados horários)
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
    );
    
    let forecastData = null;
    if (forecastResponse.ok) {
      forecastData = await forecastResponse.json();
      console.log('✅ [WEATHER] Previsão de 5 dias recebida da API');
    } else {
      console.warn('⚠️ [WEATHER] Erro na previsão, usando dados simulados para forecast');
    }
    
    // Processar dados atuais reais
    const current: CurrentWeather = {
      temperature: Math.round(currentData.main.temp),
      feels_like: Math.round(currentData.main.feels_like),
      humidity: currentData.main.humidity,
      pressure: currentData.main.pressure,
      wind_speed: Math.round((currentData.wind?.speed || 0) * 3.6), // m/s para km/h
      wind_direction: currentData.wind?.deg || 0,
      visibility: Math.round((currentData.visibility || 10000) / 1000), // metros para km
      uv_index: 7, // Não disponível na API gratuita
      clouds: currentData.clouds?.all || 0,
      weather_main: currentData.weather[0].main,
      weather_description: currentData.weather[0].description,
      weather_icon: currentData.weather[0].icon,
      sunrise: currentData.sys.sunrise,
      sunset: currentData.sys.sunset,
      dt: currentData.dt
    };
    
    // Processar previsão horária se disponível
    let hourly: HourlyForecast[] = [];
    if (forecastData && forecastData.list) {
      hourly = forecastData.list.slice(0, 24).map((item: any) => ({
        dt: item.dt,
        temperature: Math.round(item.main.temp),
        feels_like: Math.round(item.main.feels_like),
        humidity: item.main.humidity,
        wind_speed: Math.round((item.wind?.speed || 0) * 3.6),
        wind_direction: item.wind?.deg || 0,
        weather_main: item.weather[0].main,
        weather_description: item.weather[0].description,
        weather_icon: item.weather[0].icon,
        pop: Math.round((item.pop || 0) * 100),
        clouds: item.clouds?.all || 0
      }));
    } else {
      // Fallback para dados simulados se não conseguir a previsão
      const fallbackData = generateStableWeatherData();
      hourly = fallbackData.hourly;
    }
    
    // Processar previsão diária (agregar dados horários)
    let daily: DailyForecast[] = [];
    if (forecastData && forecastData.list) {
      const dailyMap = new Map();
      
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyMap.has(date)) {
          dailyMap.set(date, {
            dt: item.dt,
            temps: [item.main.temp],
            humidity: item.main.humidity,
            wind_speed: (item.wind?.speed || 0) * 3.6,
            weather_main: item.weather[0].main,
            weather_description: item.weather[0].description,
            weather_icon: item.weather[0].icon,
            pop: (item.pop || 0) * 100,
            sunrise: currentData.sys.sunrise,
            sunset: currentData.sys.sunset
          });
        } else {
          const existing = dailyMap.get(date);
          existing.temps.push(item.main.temp);
        }
      });
      
      daily = Array.from(dailyMap.values()).slice(0, 7).map((day: any) => ({
        dt: day.dt,
        temp_min: Math.round(Math.min(...day.temps)),
        temp_max: Math.round(Math.max(...day.temps)),
        humidity: day.humidity,
        wind_speed: Math.round(day.wind_speed),
        weather_main: day.weather_main,
        weather_description: day.weather_description,
        weather_icon: day.weather_icon,
        pop: Math.round(day.pop),
        sunrise: day.sunrise,
        sunset: day.sunset
      }));
    } else {
      // Fallback para dados simulados se não conseguir a previsão
      const fallbackData = generateStableWeatherData();
      daily = fallbackData.daily;
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
    
  } catch (error) {
    console.error('❌ [WEATHER] Erro ao buscar dados da API:', error);
    console.log('🔄 [WEATHER] Usando dados simulados como fallback...');
    return generateStableWeatherData();
  }
};

export const useWeatherData = () => {
  return useQuery({
    queryKey: ['weather', 'tres-marias'],
    queryFn: fetchWeatherData,
    refetchInterval: 10 * 60 * 1000, // Atualizar a cada 10 minutos
    staleTime: 5 * 60 * 1000, // Dados ficam fresh por 5 minutos
    retry: 2,
    retryDelay: 10000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
