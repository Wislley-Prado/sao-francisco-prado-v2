
import React, { useState, useMemo } from 'react';
import RanchCard from './RanchCard';
import RanchFilters from './RanchFilters';
import { MapPin, Star } from 'lucide-react';

interface Ranch {
  id: number;
  name: string;
  description: string;
  location: string;
  capacity: number;
  price: number;
  rating: number;
  images: string[];
  amenities: string[];
  available: boolean;
  features: {
    bedrooms: number;
    bathrooms: number;
    area: string;
  };
}

interface FilterState {
  capacity: number;
  minPrice: number;
  maxPrice: number;
  amenities: string[];
  location: string;
  available: boolean;
}

const RanchosSection = () => {
  const [filters, setFilters] = useState<FilterState>({
    capacity: 1,
    minPrice: 0,
    maxPrice: 9999,
    amenities: [],
    location: '',
    available: false,
  });

  const ranchos: Ranch[] = [
    {
      id: 1,
      name: "Rancho Vista Rio",
      description: "Rancho familiar com vista privilegiada do Rio São Francisco, ideal para famílias que buscam tranquilidade.",
      location: "Margem Norte",
      capacity: 8,
      price: 450,
      rating: 4.8,
      images: ["/api/placeholder/400/250"],
      amenities: ["Wi-Fi", "Piscina", "Churrasqueira", "Deck de Pesca", "Estacionamento"],
      available: true,
      features: {
        bedrooms: 3,
        bathrooms: 2,
        area: "150m²"
      }
    },
    {
      id: 2,
      name: "Rancho Pescador Premium",
      description: "Rancho de luxo com equipamentos profissionais de pesca e todas as comodidades modernas.",
      location: "Ilha Particular",
      capacity: 12,
      price: 850,
      rating: 4.9,
      images: ["/api/placeholder/400/250"],
      amenities: ["Wi-Fi", "Ar Condicionado", "Piscina", "Churrasqueira", "Deck de Pesca", "Cozinha Completa", "TV a Cabo"],
      available: true,
      features: {
        bedrooms: 4,
        bathrooms: 3,
        area: "220m²"
      }
    },
    {
      id: 3,
      name: "Rancho Família Ribeirinha",
      description: "Ambiente acolhedor e rústico, perfeito para grupos que querem uma experiência autêntica.",
      location: "Beira Rio",
      capacity: 6,
      price: 320,
      rating: 4.6,
      images: ["/api/placeholder/400/250"],
      amenities: ["Churrasqueira", "Deck de Pesca", "Estacionamento", "Cozinha Completa"],
      available: false,
      features: {
        bedrooms: 2,
        bathrooms: 1,
        area: "120m²"
      }
    },
    {
      id: 4,
      name: "Rancho Sunset Lodge",
      description: "Vista espetacular do pôr do sol, com deck amplo e estrutura completa para pescarias.",
      location: "Margem Sul",
      capacity: 10,
      price: 680,
      rating: 4.7,
      images: ["/api/placeholder/400/250"],
      amenities: ["Wi-Fi", "Piscina", "Churrasqueira", "Deck de Pesca", "Ar Condicionado", "Estacionamento"],
      available: true,
      features: {
        bedrooms: 3,
        bathrooms: 2,
        area: "180m²"
      }
    },
    {
      id: 5,
      name: "Rancho Águas Claras",
      description: "Localizado em área preservada com águas cristalinas, ideal para pesca esportiva.",
      location: "Margem Norte",
      capacity: 4,
      price: 380,
      rating: 4.5,
      images: ["/api/placeholder/400/250"],
      amenities: ["Deck de Pesca", "Churrasqueira", "Estacionamento"],
      available: true,
      features: {
        bedrooms: 2,
        bathrooms: 1,
        area: "100m²"
      }
    },
    {
      id: 6,
      name: "Rancho Família Grande",
      description: "Espaçoso rancho para grandes grupos, com área de lazer completa e múltiplos quartos.",
      location: "Margem Sul",
      capacity: 16,
      price: 1200,
      rating: 4.8,
      images: ["/api/placeholder/400/250"],
      amenities: ["Wi-Fi", "Piscina", "Churrasqueira", "Deck de Pesca", "Ar Condicionado", "Cozinha Completa", "TV a Cabo", "Estacionamento"],
      available: true,
      features: {
        bedrooms: 5,
        bathrooms: 4,
        area: "300m²"
      }
    }
  ];

  const filteredRanchos = useMemo(() => {
    return ranchos.filter(rancho => {
      // Capacity filter
      if (rancho.capacity < filters.capacity) return false;
      
      // Price filter
      if (rancho.price < filters.minPrice || rancho.price > filters.maxPrice) return false;
      
      // Location filter
      if (filters.location && rancho.location !== filters.location) return false;
      
      // Availability filter
      if (filters.available && !rancho.available) return false;
      
      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          rancho.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }
      
      return true;
    });
  }, [filters]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      capacity: 1,
      minPrice: 0,
      maxPrice: 9999,
      amenities: [],
      location: '',
      available: false,
    });
  };

  return (
    <section id="ranchos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ranchos para Aluguel
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Escolha o rancho perfeito para sua estadia no Rio São Francisco. 
            Todos com localização privilegiada e estrutura completa para pescarias.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <RanchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              resultsCount={filteredRanchos.length}
            />
          </div>

          {/* Ranchos Grid */}
          <div className="lg:col-span-3">
            {filteredRanchos.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredRanchos.map((rancho) => (
                  <RanchCard key={rancho.id} ranch={rancho} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhum rancho encontrado
                </h3>
                <p className="text-gray-500 mb-6">
                  Tente ajustar os filtros para encontrar mais opções.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="text-rio-blue hover:text-blue-600 font-medium"
                >
                  Limpar todos os filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-lg">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-rio-blue mb-2">{ranchos.length}</div>
              <div className="text-gray-600">Ranchos Disponíveis</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-water-green mb-2">4.7</div>
              <div className="text-gray-600 flex items-center justify-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                Avaliação Média
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sunset-orange mb-2">98%</div>
              <div className="text-gray-600">Taxa de Satisfação</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RanchosSection;
