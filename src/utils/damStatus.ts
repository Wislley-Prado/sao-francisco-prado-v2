
import { StatusInfo } from '@/types/damData';

export const getStatusFromLevel = (level: number): StatusInfo => {
  if (level >= 80) return { status: 'excellent', text: 'Excelente', color: 'bg-green-500' };
  if (level >= 60) return { status: 'good', text: 'Bom', color: 'bg-yellow-500' };
  if (level >= 40) return { status: 'warning', text: 'Atenção', color: 'bg-orange-500' };
  return { status: 'critical', text: 'Crítico', color: 'bg-red-500' };
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'excellent': return 'bg-green-500';
    case 'good': return 'bg-yellow-500';
    case 'warning': return 'bg-orange-500';
    case 'critical': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'excellent': return 'Excelente';
    case 'good': return 'Bom';
    case 'warning': return 'Atenção';
    case 'critical': return 'Crítico';
    default: return 'Indefinido';
  }
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '--';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch {
    return dateString;
  }
};
