export const getVisibilityText = (visibilityKm: number): string => {
  if (visibilityKm >= 10) return 'Excelente';
  if (visibilityKm >= 5) return 'Boa';
  if (visibilityKm >= 2) return 'Regular';
  return 'Ruim';
};

export const getVisibilityColor = (visibilityKm: number): string => {
  if (visibilityKm >= 10) return 'bg-green-100 text-green-800';
  if (visibilityKm >= 5) return 'bg-blue-100 text-blue-800';
  if (visibilityKm >= 2) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};