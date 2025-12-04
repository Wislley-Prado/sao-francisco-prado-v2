
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, Filter, X } from 'lucide-react';

interface FilterState {
  capacity: number;
  minPrice: number;
  maxPrice: number;
  amenities: string[];
  location: string;
  available: boolean;
}

interface RanchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  resultsCount: number;
}

const RanchFilters = ({ filters, onFiltersChange, onClearFilters, resultsCount }: RanchFiltersProps) => {
  const amenitiesList = [
    'Wi-Fi',
    'Estacionamento',
    'Piscina',
    'Churrasqueira',
    'Deck de Pesca',
    'Ar Condicionado',
    'Cozinha Completa',
    'TV a Cabo'
  ];

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    updateFilter('amenities', newAmenities);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-lg">
            <Filter className="h-5 w-5 mr-2 text-rio-blue" />
            Filtros
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        </div>
        <p className="text-sm text-gray-600">{resultsCount} ranchos encontrados</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Capacity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="h-4 w-4 inline mr-1" />
            Capacidade (pessoas)
          </label>
          <Input
            type="number"
            min="1"
            max="20"
            value={filters.capacity}
            onChange={(e) => updateFilter('capacity', parseInt(e.target.value) || 1)}
            className="w-full"
          />
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="h-4 w-4 inline mr-1" />
            Faixa de Preço (R$/noite)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Mín"
              value={filters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', parseInt(e.target.value) || 0)}
            />
            <Input
              type="number"
              placeholder="Máx"
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', parseInt(e.target.value) || 9999)}
            />
          </div>
        </div>

        {/* Amenities Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Comodidades
          </label>
          <div className="space-y-2">
            {amenitiesList.map((amenity) => (
              <label key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="h-4 w-4 text-rio-blue focus:ring-rio-blue border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.available}
              onChange={(e) => updateFilter('available', e.target.checked)}
              className="h-4 w-4 text-rio-blue focus:ring-rio-blue border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Apenas disponíveis</span>
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default RanchFilters;
