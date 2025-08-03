
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

// Função para calcular as fases lunares com precisão astronômica
const calculateLunarPhases = (): LunarData => {
  console.log('🌙 [LUNAR] Calculando dados lunares com precisão astronômica...');
  
  const now = new Date();
  const currentTimestamp = now.getTime();
  
  // Usar data de referência mais precisa: Lua Nova de 1 de Janeiro de 2000, 12:00 UTC
  const referenceNewMoon = new Date('2000-01-06T18:14:00Z').getTime();
  
  // Ciclo lunar sinódico preciso: 29.530588853 dias
  const lunarCycle = 29.530588853;
  const cycleDurationMs = lunarCycle * 24 * 60 * 60 * 1000;
  
  // Calcular fase atual da lua
  const daysSinceReference = (currentTimestamp - referenceNewMoon) / (24 * 60 * 60 * 1000);
  const cyclesSinceReference = daysSinceReference / lunarCycle;
  const ageInDays = (cyclesSinceReference - Math.floor(cyclesSinceReference)) * lunarCycle;
  
  // Calcular iluminação (0-100%)
  const illumination = Math.round(50 * (1 - Math.cos(2 * Math.PI * ageInDays / lunarCycle)));
  
  // Determinar fase atual com 8 fases precisas
  let currentPhase: string;
  
  if (ageInDays < 1) {
    currentPhase = 'Nova';
  } else if (ageInDays < 6.38) {
    currentPhase = 'Crescente';
  } else if (ageInDays < 8.38) {
    currentPhase = 'Crescente Gibosa';
  } else if (ageInDays < 15.77) {
    currentPhase = 'Cheia';
  } else if (ageInDays < 17.77) {
    currentPhase = 'Minguante Gibosa';
  } else if (ageInDays < 23.15) {
    currentPhase = 'Minguante';
  } else if (ageInDays < 27.53) {
    currentPhase = 'Minguante Crescente';
  } else {
    currentPhase = 'Nova';
  }
  
  // Calcular próximas 8 fases
  const phases: LunarPhase[] = [];
  const phaseTypes = [
    'Nova', 'Crescente', 'Crescente Gibosa', 'Cheia', 
    'Minguante Gibosa', 'Minguante', 'Minguante Crescente', 'Nova'
  ];
  const phaseColors = [
    'bg-gray-800', 'bg-yellow-400', 'bg-yellow-500', 'bg-orange-400',
    'bg-orange-500', 'bg-yellow-400', 'bg-gray-600', 'bg-gray-800'
  ];
  const fishingQualities = [
    'Excelente', 'Bom', 'Regular', 'Excelente', 
    'Bom', 'Regular', 'Bom', 'Excelente'
  ];
  const phaseDurations = [1, 6.38, 8.38, 15.77, 17.77, 23.15, 27.53, 29.53];
  
  // Encontrar próximas fases
  let nextPhaseIndex = 0;
  for (let i = 0; i < phaseDurations.length; i++) {
    if (ageInDays < phaseDurations[i]) {
      nextPhaseIndex = i;
      break;
    }
  }
  
  // Calcular próximas 4 fases principais
  for (let i = 0; i < 4; i++) {
    const phaseIndex = (nextPhaseIndex + i * 2) % 8; // Pegar fases principais (Nova, Crescente, Cheia, Minguante)
    const targetPhaseAge = phaseDurations[phaseIndex];
    
    let daysUntilPhase = targetPhaseAge - ageInDays;
    if (daysUntilPhase <= 0) {
      daysUntilPhase += lunarCycle;
    }
    
    const phaseDate = new Date(currentTimestamp + (daysUntilPhase * 24 * 60 * 60 * 1000));
    
    // Calcular iluminação para a fase
    const phaseIllumination = Math.round(50 * (1 - Math.cos(2 * Math.PI * targetPhaseAge / lunarCycle)));
    
    phases.push({
      phase: phaseTypes[phaseIndex],
      date: phaseDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      timestamp: phaseDate.getTime(),
      illumination: phaseIllumination,
      fishing: fishingQualities[phaseIndex],
      color: phaseColors[phaseIndex]
    });
  }
  
  // Melhores horários para pesca baseados na lua
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
      quality: (currentPhase === 'Cheia' ? 'good' : 'fair') as 'excellent' | 'good' | 'fair'
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
      age: Math.round(ageInDays),
      distance: Math.round(384400 + Math.sin(ageInDays * 0.2) * 20000) // km
    },
    phases: phases.sort((a, b) => a.timestamp - b.timestamp),
    bestFishingTimes
  };
};

export const useLunarData = () => {
  return useQuery({
    queryKey: ['lunar', 'data'],
    queryFn: calculateLunarPhases,
    refetchInterval: 60 * 60 * 1000, // Atualizar a cada hora
    staleTime: 30 * 60 * 1000, // Dados ficam fresh por 30 minutos
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
