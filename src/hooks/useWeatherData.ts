import { useQuery } from '@tanstack/react-query';

// Coordenadas de Três Marias, MG
const TRES_MARIAS_LAT = -18.2028;
const TRES_MARIAS_LON = -45.2447;

// Chave da API integrada
const API_KEY = '6459a62448b61386ccc581f2cc307a2c';

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

// Função para buscar dados meteorológicos
const fetchWeatherData = async (): Promise<WeatherData> => {
  console.log('🌤️ [WEATHER] Buscando dados meteorológicos...');
  
  try {
    // Buscar dados atuais e previsão em uma chamada (One Call API)
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${TRES_MARIAS_LAT}&lon=${TRES_MARIAS_LON}&appid=${API_KEY}&units=metric&lang=pt_br&exclude=minutely,alerts`
    );

    if (!response.ok) {
      // Fallback para API gratuita se One Call falhar
      console.log('🔄 [WEATHER] One Call API falhou, usando APIs separadas...');
      return await fetchWeatherDataFallback();
    }

    const data = await response.json();
    console.log('✅ [WEATHER] Dados One Call recebidos:', data);

    // Mapear dados para nosso formato
    const weatherData: WeatherData = {
      current: {
        temperature: Math.round(data.current.temp),
        feels_like: Math.round(data.current.feels_like),
        humidity: data.current.humidity,
        pressure: data.current.pressure,
        wind_speed: Math.round(data.current.wind_speed * 3.6), // m/s para km/h
        wind_direction: data.current.wind_deg || 0,
        visibility: data.current.visibility ? Math.round(data.current.visibility / 1000) : 10,
        uv_index: data.current.uvi || 0,
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
        timezone: data.timezone || 'America/Sao_Paulo'
      }
    };

    return weatherData;
    
  } catch (error) {
    console.error('❌ [WEATHER] Erro ao buscar dados meteorológicos:', error);
    return await fetchWeatherDataFallback();
  }
};

// Função fallback usando APIs gratuitas separadas
const fetchWeatherDataFallback = async (): Promise<WeatherData> => {
  try {
    // Dados atuais
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${TRES_MARIAS_LAT}&lon=${TRES_MARIAS_LON}&appid=${API_KEY}&units=metric&lang=pt_br`
    );
    
    // Previsão de 5 dias
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${TRES_MARIAS_LAT}&lon=${TRES_MARIAS_LON}&appid=${API_KEY}&units=metric&lang=pt_br`
    );

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error('Falha ao buscar dados meteorológicos');
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    console.log('✅ [WEATHER] Dados fallback recebidos');

    // Mapear dados atuais
    const current: CurrentWeather = {
      temperature: Math.round(currentData.main.temp),
      feels_like: Math.round(currentData.main.feels_like),
      humidity: currentData.main.humidity,
      pressure: currentData.main.pressure,
      wind_speed: Math.round(currentData.wind.speed * 3.6),
      wind_direction: currentData.wind.deg || 0,
      visibility: currentData.visibility ? Math.round(currentData.visibility / 1000) : 10,
      uv_index: 0, // Não disponível na API gratuita
      clouds: currentData.clouds.all,
      weather_main: currentData.weather[0].main,
      weather_description: currentData.weather[0].description,
      weather_icon: currentData.weather[0].icon,
      sunrise: currentData.sys.sunrise,
      sunset: currentData.sys.sunset,
      dt: currentData.dt
    };

    // Mapear previsão horária (próximas 24h)
    const hourly: HourlyForecast[] = forecastData.list.slice(0, 8).map((item: any) => ({
      dt: item.dt,
      temperature: Math.round(item.main.temp),
      feels_like: Math.round(item.main.feels_like),
      humidity: item.main.humidity,
      wind_speed: Math.round(item.wind.speed * 3.6),
      wind_direction: item.wind.deg || 0,
      weather_main: item.weather[0].main,
      weather_description: item.weather[0].description,
      weather_icon: item.weather[0].icon,
      pop: Math.round((item.pop || 0) * 100),
      clouds: item.clouds.all
    }));

    // Mapear previsão diária (agrupar por dia)
    const dailyMap = new Map();
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          dt: item.dt,
          temps: [item.main.temp],
          humidity: item.main.humidity,
          wind_speed: item.wind.speed * 3.6,
          weather_main: item.weather[0].main,
          weather_description: item.weather[0].description,
          weather_icon: item.weather[0].icon,
          pop: (item.pop || 0) * 100,
          sunrise: current.sunrise,
          sunset: current.sunset
        });
      } else {
        dailyMap.get(date).temps.push(item.main.temp);
      }
    });

    const daily: DailyForecast[] = Array.from(dailyMap.values()).slice(0, 5).map((day: any) => ({
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

    return {
      current,
      hourly,
      daily,
      location: {
        name: currentData.name,
        country: currentData.sys.country,
        timezone: 'America/Sao_Paulo'
      }
    };

  } catch (error) {
    console.error('❌ [WEATHER] Erro no fallback:', error);
    throw error;
  }
};

export const useWeatherData = () => {
  return useQuery({
    queryKey: ['weather', 'tres-marias'],
    queryFn: fetchWeatherData,
    refetchInterval: 10 * 60 * 1000, // Atualizar a cada 10 minutos
    staleTime: 5 * 60 * 1000, // Dados ficam fresh por 5 minutos
    retry: 2,
    retryDelay: 3000,
  });
};
