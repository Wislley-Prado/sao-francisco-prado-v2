
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

// Função para calcular as fases lunares
const calculateLunarPhases = (): LunarData => {
  console.log('🌙 [LUNAR] Calculando dados lunares...');
  
  const now = new Date();
  const currentTimestamp = now.getTime();
  
  // Ciclo lunar é de aproximadamente 29.53 dias
  const lunarCycle = 29.53 * 24 * 60 * 60 * 1000; // em millisegundos
  
  // Data de referência de lua nova conhecida (1 de janeiro de 2000)
  const referenceNewMoon = new Date('2000-01-06T18:14:00Z').getTime();
  
  // Calcular quantos ciclos lunares se passaram desde a referência
  const daysSinceReference = (currentTimestamp - referenceNewMoon) / (24 * 60 * 60 * 1000);
  const cyclesSinceReference = daysSinceReference / 29.53;
  const currentCycleProgress = (cyclesSinceReference - Math.floor(cyclesSinceReference)) * 29.53;
  
  // Determinar fase atual
  let currentPhase: string;
  let illumination: number;
  
  if (currentCycleProgress < 1) {
    currentPhase = 'Nova';
    illumination = 0;
  } else if (currentCycleProgress < 7.4) {
    currentPhase = 'Crescente';
    illumination = Math.round((currentCycleProgress / 7.4) * 50);
  } else if (currentCycleProgress < 14.8) {
    currentPhase = 'Cheia';
    illumination = Math.round(50 + ((currentCycleProgress - 7.4) / 7.4) * 50);
  } else if (currentCycleProgress < 22.1) {
    currentPhase = 'Minguante';
    illumination = Math.round(100 - ((currentCycleProgress - 14.8) / 7.3) * 50);
  } else {
    currentPhase = 'Nova';
    illumination = Math.round(50 - ((currentCycleProgress - 22.1) / 7.4) * 50);
  }
  
  // Calcular próximas fases
  const phases: LunarPhase[] = [];
  const phaseTypes = ['Nova', 'Crescente', 'Cheia', 'Minguante'];
  const phaseColors = ['bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-yellow-500'];
  const fishingQualities = ['Excelente', 'Bom', 'Regular', 'Bom'];
  
  for (let i = 0; i < 4; i++) {
    const phaseProgress = (i * 7.4) - currentCycleProgress;
    let daysUntilPhase = phaseProgress;
    
    if (daysUntilPhase <= 0) {
      daysUntilPhase += 29.53;
    }
    
    const phaseDate = new Date(currentTimestamp + (daysUntilPhase * 24 * 60 * 60 * 1000));
    
    phases.push({
      phase: phaseTypes[i],
      date: phaseDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      timestamp: phaseDate.getTime(),
      illumination: i === 0 ? 0 : i === 1 ? 25 : i === 2 ? 100 : 75,
      fishing: fishingQualities[i],
      color: phaseColors[i]
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
      age: Math.round(currentCycleProgress),
      distance: Math.round(384400 + Math.sin(currentCycleProgress * 0.2) * 20000) // km
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
