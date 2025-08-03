
import { useQuery } from '@tanstack/react-query';

export interface LunarPhase {
  phase: string;
  date: string;
  timestamp: number;
  illumination: number;
  fishing: string;
  color: string;
}

export interface LunarData {
  currentPhase: {
    phase: string;
    illumination: number;
    age: number;
    distance: number;
  };
  phases: LunarPhase[];
  bestFishingTimes: {
    time: string;
    activity: string;
    quality: 'excellent' | 'good' | 'fair';
  }[];
}

// Interface para a API FarmSense
interface FarmSenseResponse {
  moon: {
    phase_name: string;
    illumination: number;
    age: number;
    distance: number;
    angular_diameter: number;
    sun_distance: number;
    next_new_moon: string;
    next_full_moon: string;
    next_first_quarter: string;
    next_last_quarter: string;
  };
}

// Função para normalizar nomes de fases da API para português
const normalizePhase = (phaseName: string): string => {
  const phaseMap: { [key: string]: string } = {
    'new moon': 'Nova',
    'waxing crescent': 'Crescente',
    'first quarter': 'Crescente',
    'waxing gibbous': 'Crescente Gibosa',
    'full moon': 'Cheia',
    'waning gibbous': 'Minguante Gibosa',
    'last quarter': 'Minguante',
    'waning crescent': 'Minguante Crescente'
  };
  
  return phaseMap[phaseName.toLowerCase()] || phaseName;
};

// Função para buscar dados da API FarmSense
const fetchLunarDataFromAPI = async (): Promise<LunarData> => {
  console.log('🌙 [LUNAR API] Buscando dados reais da FarmSense...');
  
  try {
    const response = await fetch('https://api.farmsense.net/v1/moonphases/?d=1');
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data: FarmSenseResponse[] = await response.json();
    const moonData = data[0]?.moon;
    
    if (!moonData) {
      throw new Error('Invalid API response');
    }
    
    console.log('🌙 [LUNAR API] Dados recebidos:', moonData);
    
    // Normalizar dados da API
    const currentPhase = normalizePhase(moonData.phase_name);
    const illumination = Math.round(moonData.illumination * 100);
    const age = Math.round(moonData.age);
    const distance = Math.round(moonData.distance);
    
    console.log(`🌙 [LUNAR API] Fase: ${currentPhase}, Iluminação: ${illumination}%, Idade: ${age} dias`);
    
    // Mapear cores e qualidades de pesca
    const phaseColors: { [key: string]: string } = {
      'Nova': 'bg-gray-800',
      'Crescente': 'bg-yellow-400',
      'Crescente Gibosa': 'bg-yellow-500',
      'Cheia': 'bg-orange-400',
      'Minguante Gibosa': 'bg-orange-500',
      'Minguante': 'bg-yellow-400',
      'Minguante Crescente': 'bg-gray-600'
    };
    
    const fishingQualities: { [key: string]: string } = {
      'Nova': 'Excelente',
      'Crescente': 'Bom',
      'Crescente Gibosa': 'Regular',
      'Cheia': 'Excelente',
      'Minguante Gibosa': 'Bom',
      'Minguante': 'Regular',
      'Minguante Crescente': 'Bom'
    };
    
    // Criar próximas fases usando dados da API
    const phases: LunarPhase[] = [
      {
        phase: 'Crescente',
        date: new Date(moonData.next_first_quarter).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        timestamp: new Date(moonData.next_first_quarter).getTime(),
        illumination: 50,
        fishing: fishingQualities['Crescente'],
        color: phaseColors['Crescente']
      },
      {
        phase: 'Cheia',
        date: new Date(moonData.next_full_moon).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        timestamp: new Date(moonData.next_full_moon).getTime(),
        illumination: 100,
        fishing: fishingQualities['Cheia'],
        color: phaseColors['Cheia']
      },
      {
        phase: 'Minguante',
        date: new Date(moonData.next_last_quarter).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        timestamp: new Date(moonData.next_last_quarter).getTime(),
        illumination: 50,
        fishing: fishingQualities['Minguante'],
        color: phaseColors['Minguante']
      },
      {
        phase: 'Nova',
        date: new Date(moonData.next_new_moon).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        timestamp: new Date(moonData.next_new_moon).getTime(),
        illumination: 0,
        fishing: fishingQualities['Nova'],
        color: phaseColors['Nova']
      }
    ].sort((a, b) => a.timestamp - b.timestamp);
    
    // Melhores horários para pesca baseados na fase atual
    const bestFishingTimes = [
      {
        time: "05:30 - 07:00",
        activity: "Nascente do Sol",
        quality: 'excellent' as 'excellent' | 'good' | 'fair'
      },
      {
        time: "17:30 - 19:00", 
        activity: "Pôr do Sol",
        quality: 'excellent' as 'excellent' | 'good' | 'fair'
      },
      {
        time: "22:00 - 00:30",
        activity: "Lua Alta",
        quality: (currentPhase === 'Cheia' ? 'excellent' : currentPhase === 'Nova' ? 'good' : 'fair') as 'excellent' | 'good' | 'fair'
      },
      {
        time: "03:00 - 05:00",
        activity: "Madrugada",
        quality: (currentPhase === 'Nova' || currentPhase === 'Minguante' ? 'good' : 'fair') as 'excellent' | 'good' | 'fair'
      }
    ];
    
    return {
      currentPhase: {
        phase: currentPhase,
        illumination,
        age,
        distance
      },
      phases,
      bestFishingTimes
    };
    
  } catch (error) {
    console.error('🌙 [LUNAR API] Erro ao buscar dados:', error);
    console.log('🌙 [LUNAR API] Usando fallback para cálculo local...');
    
    // Fallback: usar cálculo local simplificado
    return calculateLunarPhasesLocal();
  }
};

// Fallback: cálculo local simplificado
const calculateLunarPhasesLocal = (): LunarData => {
  console.log('🌙 [LUNAR LOCAL] Usando cálculo astronômico local...');
  
  const now = new Date();
  const currentTimestamp = now.getTime();
  
  // Data de referência mais recente: Lua Nova de 1 de Janeiro de 2025
  const referenceNewMoon = new Date('2025-01-01T00:00:00Z').getTime();
  
  // Ciclo lunar sinódico preciso
  const lunarCycle = 29.530588853;
  
  // Calcular idade da lua
  const daysSinceReference = (currentTimestamp - referenceNewMoon) / (24 * 60 * 60 * 1000);
  const cyclesSinceReference = daysSinceReference / lunarCycle;
  const ageInDays = (cyclesSinceReference - Math.floor(cyclesSinceReference)) * lunarCycle;
  
  // Calcular iluminação correta (0-100%)
  const illumination = Math.round(50 * (1 - Math.cos(2 * Math.PI * ageInDays / lunarCycle)));
  
  // Determinar fase atual com intervalos corretos
  let currentPhase: string;
  
  if (ageInDays < 1.85) {
    currentPhase = 'Nova';
  } else if (ageInDays < 5.53) {
    currentPhase = 'Crescente';
  } else if (ageInDays < 9.22) {
    currentPhase = 'Crescente Gibosa';
  } else if (ageInDays < 12.91) {
    currentPhase = 'Cheia';
  } else if (ageInDays < 16.59) {
    currentPhase = 'Minguante Gibosa';
  } else if (ageInDays < 20.28) {
    currentPhase = 'Minguante';
  } else if (ageInDays < 23.97) {
    currentPhase = 'Minguante Crescente';
  } else {
    currentPhase = 'Nova';
  }
  
  console.log(`🌙 [LUNAR LOCAL] Idade: ${ageInDays.toFixed(1)} dias, Fase: ${currentPhase}, Iluminação: ${illumination}%`);
  
  // Criar próximas fases
  const phases: LunarPhase[] = [];
  const phaseTypes = ['Nova', 'Crescente', 'Cheia', 'Minguante'];
  const phaseColors = ['bg-gray-800', 'bg-yellow-400', 'bg-orange-400', 'bg-yellow-400'];
  const fishingQualities = ['Excelente', 'Bom', 'Excelente', 'Regular'];
  const phaseDurations = [0, 7.38, 14.77, 22.15];
  
  for (let i = 0; i < 4; i++) {
    const targetAge = phaseDurations[i];
    let daysUntilPhase = targetAge - ageInDays;
    
    if (daysUntilPhase <= 0) {
      daysUntilPhase += lunarCycle;
    }
    
    const phaseDate = new Date(currentTimestamp + (daysUntilPhase * 24 * 60 * 60 * 1000));
    const phaseIllumination = i === 0 ? 0 : i === 2 ? 100 : 50;
    
    phases.push({
      phase: phaseTypes[i],
      date: phaseDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      timestamp: phaseDate.getTime(),
      illumination: phaseIllumination,
      fishing: fishingQualities[i],
      color: phaseColors[i]
    });
  }
  
  const bestFishingTimes = [
    {
      time: "05:30 - 07:00",
      activity: "Nascente do Sol",
      quality: 'excellent' as 'excellent' | 'good' | 'fair'
    },
    {
      time: "17:30 - 19:00", 
      activity: "Pôr do Sol",
      quality: 'excellent' as 'excellent' | 'good' | 'fair'
    },
    {
      time: "22:00 - 00:30",
      activity: "Lua Alta",
      quality: (currentPhase === 'Cheia' ? 'excellent' : 'good') as 'excellent' | 'good' | 'fair'
    },
    {
      time: "03:00 - 05:00",
      activity: "Madrugada",
      quality: (currentPhase === 'Nova' ? 'good' : 'fair') as 'excellent' | 'good' | 'fair'
    }
  ];
  
  return {
    currentPhase: {
      phase: currentPhase,
      illumination,
      age: Math.round(ageInDays),
      distance: Math.round(384400 + Math.sin(ageInDays * 0.2) * 20000)
    },
    phases: phases.sort((a, b) => a.timestamp - b.timestamp),
    bestFishingTimes
  };
};

export const useLunarData = () => {
  return useQuery<LunarData>({
    queryKey: ['lunar', 'data', 'v2'], // Força invalidação do cache
    queryFn: fetchLunarDataFromAPI,
    refetchInterval: 60 * 60 * 1000, // Atualizar a cada hora
    staleTime: 30 * 60 * 1000, // Dados ficam fresh por 30 minutos
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
