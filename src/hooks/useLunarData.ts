
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
    'first quarter': 'Quarto Crescente',
    'waxing gibbous': 'Crescente Gibosa',
    'full moon': 'Cheia',
    'waning gibbous': 'Minguante Gibosa',
    'last quarter': 'Quarto Minguante',
    'waning crescent': 'Minguante Crescente'
  };
  
  return phaseMap[phaseName.toLowerCase()] || phaseName;
};

// Constantes do ciclo lunar
const LUNAR_CYCLE = 29.530588853;
const REFERENCE_NEW_MOON = new Date('2026-01-29T12:36:00Z').getTime();

// Dias desde Lua Nova para cada fase
const PHASE_OFFSETS = {
  'Quarto Crescente': 7.38,
  'Cheia': 14.77,
  'Quarto Minguante': 22.14,
  'Nova': LUNAR_CYCLE,
};

const FISHING_QUALITIES: { [key: string]: string } = {
  'Nova': 'Excelente',
  'Crescente': 'Boa',
  'Quarto Crescente': 'Boa',
  'Crescente Gibosa': 'Regular',
  'Cheia': 'Fraca',
  'Minguante Gibosa': 'Regular',
  'Quarto Minguante': 'Boa',
  'Minguante': 'Boa',
  'Minguante Crescente': 'Excelente'
};

const PHASE_COLORS: { [key: string]: string } = {
  'Nova': 'bg-green-600',
  'Crescente': 'bg-blue-500',
  'Quarto Crescente': 'bg-blue-500',
  'Crescente Gibosa': 'bg-yellow-500',
  'Cheia': 'bg-orange-500',
  'Minguante Gibosa': 'bg-yellow-600',
  'Quarto Minguante': 'bg-blue-600',
  'Minguante': 'bg-blue-600',
  'Minguante Crescente': 'bg-green-600'
};

// Calcula idade da lua em dias
const calculateMoonAge = (): number => {
  const now = Date.now();
  const daysSinceRef = (now - REFERENCE_NEW_MOON) / (24 * 60 * 60 * 1000);
  const age = daysSinceRef % LUNAR_CYCLE;
  return age < 0 ? age + LUNAR_CYCLE : age;
};

// Determina fase a partir da idade
const getPhaseFromAge = (ageInDays: number): string => {
  if (ageInDays < 1.85) return 'Nova';
  if (ageInDays < 7.38) return 'Crescente';
  if (ageInDays < 9.22) return 'Quarto Crescente';
  if (ageInDays < 14.77) return 'Crescente Gibosa';
  if (ageInDays < 16.61) return 'Cheia';
  if (ageInDays < 22.14) return 'Minguante Gibosa';
  if (ageInDays < 23.98) return 'Quarto Minguante';
  if (ageInDays < 27.68) return 'Minguante Crescente';
  return 'Nova';
};

// Calcula próximas 4 fases dinamicamente
const calculateNextPhases = (ageInDays: number): LunarPhase[] => {
  const now = Date.now();
  const phases: LunarPhase[] = [];

  for (const [phase, offset] of Object.entries(PHASE_OFFSETS)) {
    const daysUntil = (offset - ageInDays + LUNAR_CYCLE) % LUNAR_CYCLE;
    const timestamp = now + daysUntil * 24 * 60 * 60 * 1000;
    const date = new Date(timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    
    phases.push({
      phase,
      date,
      timestamp,
      illumination: phase === 'Nova' ? 0 : phase === 'Cheia' ? 100 : 50,
      fishing: FISHING_QUALITIES[phase] || 'Regular',
      color: PHASE_COLORS[phase] || 'bg-gray-500',
    });
  }

  return phases.sort((a, b) => a.timestamp - b.timestamp);
};

// Gera melhores horários de pesca
const getBestFishingTimes = (currentPhase: string) => [
  { time: "05:30 - 07:00", activity: "Nascente do Sol", quality: 'excellent' as const },
  { time: "17:30 - 19:00", activity: "Pôr do Sol", quality: 'excellent' as const },
  { time: "22:00 - 00:30", activity: "Lua Alta", quality: (currentPhase === 'Cheia' ? 'excellent' : currentPhase === 'Nova' ? 'good' : 'fair') as 'excellent' | 'good' | 'fair' },
  { time: "03:00 - 05:00", activity: "Madrugada", quality: (currentPhase === 'Nova' || currentPhase === 'Quarto Minguante' ? 'good' : 'fair') as 'excellent' | 'good' | 'fair' },
];

// Função para buscar dados da API via Edge Function proxy
const fetchLunarDataFromAPI = async (): Promise<LunarData> => {
  console.log('🌙 [LUNAR API] Buscando dados via proxy...');
  
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const response = await fetch(`${supabaseUrl}/functions/v1/lunar-proxy`);
    
    if (!response.ok) throw new Error(`Proxy Error: ${response.status}`);
    
    const data: FarmSenseResponse[] = await response.json();
    const moonData = data[0]?.moon;
    if (!moonData) throw new Error('Invalid API response');
    
    console.log('🌙 [LUNAR API] Dados recebidos:', moonData);
    
    const currentPhase = normalizePhase(moonData.phase_name);
    const illumination = Math.round(moonData.illumination * 100);
    const age = Math.round(moonData.age);
    const distance = Math.round(moonData.distance);
    
    // Próximas fases usando dados da API
    const phases: LunarPhase[] = [
      { phase: 'Quarto Crescente', date: new Date(moonData.next_first_quarter).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }), timestamp: new Date(moonData.next_first_quarter).getTime(), illumination: 50, fishing: FISHING_QUALITIES['Quarto Crescente'], color: PHASE_COLORS['Quarto Crescente'] },
      { phase: 'Cheia', date: new Date(moonData.next_full_moon).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }), timestamp: new Date(moonData.next_full_moon).getTime(), illumination: 100, fishing: FISHING_QUALITIES['Cheia'], color: PHASE_COLORS['Cheia'] },
      { phase: 'Quarto Minguante', date: new Date(moonData.next_last_quarter).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }), timestamp: new Date(moonData.next_last_quarter).getTime(), illumination: 50, fishing: FISHING_QUALITIES['Quarto Minguante'], color: PHASE_COLORS['Quarto Minguante'] },
      { phase: 'Nova', date: new Date(moonData.next_new_moon).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }), timestamp: new Date(moonData.next_new_moon).getTime(), illumination: 0, fishing: FISHING_QUALITIES['Nova'], color: PHASE_COLORS['Nova'] },
    ].sort((a, b) => a.timestamp - b.timestamp);
    
    return {
      currentPhase: { phase: currentPhase, illumination, age, distance },
      phases,
      bestFishingTimes: getBestFishingTimes(currentPhase),
    };
    
  } catch (error) {
    console.error('🌙 [LUNAR API] Erro ao buscar dados:', error);
    console.log('🌙 [LUNAR API] Usando fallback para cálculo local...');
    return calculateLunarPhasesLocal();
  }
};

// Fallback: cálculo local dinâmico
const calculateLunarPhasesLocal = (): LunarData => {
  console.log('🌙 [LUNAR LOCAL] Usando cálculo astronômico local...');
  
  const ageInDays = calculateMoonAge();
  const currentPhase = getPhaseFromAge(ageInDays);
  const illumination = Math.round(50 * (1 - Math.cos(2 * Math.PI * ageInDays / LUNAR_CYCLE)));
  
  console.log(`🌙 [LUNAR LOCAL] Idade: ${ageInDays.toFixed(1)} dias, Fase: ${currentPhase}, Iluminação: ${illumination}%`);
  
  return {
    currentPhase: {
      phase: currentPhase,
      illumination,
      age: Math.round(ageInDays),
      distance: Math.round(384400 + Math.sin(2 * Math.PI * ageInDays / LUNAR_CYCLE) * 21000),
    },
    phases: calculateNextPhases(ageInDays),
    bestFishingTimes: getBestFishingTimes(currentPhase),
  };
};

export const useLunarData = () => {
  return useQuery<LunarData>({
    queryKey: ['lunar', 'data', 'v6'],
    queryFn: fetchLunarDataFromAPI,
    refetchInterval: 2 * 60 * 60 * 1000,
    staleTime: 60 * 60 * 1000,
    retry: 1,
    retryDelay: 100,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    networkMode: 'online',
  });
};
