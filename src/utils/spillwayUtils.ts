
export interface SpillwayStatus {
  isActive: boolean;
  level: 'closed' | 'normal' | 'moderate' | 'high' | 'critical';
  description: string;
  color: string;
  message: string;
}

export const analyzeSpillwayStatus = (defluencia: string): SpillwayStatus => {
  const flow = parseFloat(defluencia) || 0;
  
  if (flow === 0) {
    return {
      isActive: false,
      level: 'closed',
      description: 'Vertedouro Fechado',
      color: 'bg-gray-500',
      message: 'Não há liberação de água pelo vertedouro.'
    };
  }
  
  if (flow > 0 && flow <= 50) {
    return {
      isActive: false,
      level: 'normal',
      description: 'Liberação Normal',
      color: 'bg-green-500',
      message: 'Liberação controlada de água, vertedouro não está ativo.'
    };
  }
  
  if (flow > 50 && flow <= 150) {
    return {
      isActive: true,
      level: 'moderate',
      description: 'Vertedouro Moderado',
      color: 'bg-yellow-500',
      message: 'Vertedouro ativo com liberação moderada de água.'
    };
  }
  
  if (flow > 150 && flow <= 300) {
    return {
      isActive: true,
      level: 'high',
      description: 'Vertedouro Ativo',
      color: 'bg-orange-500',
      message: 'Vertedouro liberando grande volume de água.'
    };
  }
  
  return {
    isActive: true,
    level: 'critical',
    description: 'Vertedouro Intenso',
    color: 'bg-red-500',
    message: 'Liberação intensa de água pelo vertedouro. Atenção redobrada!'
  };
};

export const getSpillwayRecommendation = (spillwayStatus: SpillwayStatus): string => {
  switch (spillwayStatus.level) {
    case 'closed':
      return 'Condições ideais para pesca. Água mais calma e clara.';
    case 'normal':
      return 'Boas condições para pesca. Liberação controlada não afeta significativamente.';
    case 'moderate':
      return 'Pesca ainda possível, mas com cuidado. Corrente mais forte nas proximidades.';
    case 'high':
      return 'Pesca dificultada. Evitar áreas próximas ao vertedouro.';
    case 'critical':
      return 'Não recomendado pescar próximo ao vertedouro. Correntes muito fortes e perigosas.';
    default:
      return '';
  }
};
