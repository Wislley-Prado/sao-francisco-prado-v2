
import React, { useState, useMemo, useEffect } from 'react';
import RanchCard from './RanchCard';
import RanchFilters from './RanchFilters';
import { MapPin, Star, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Ranch {
  id: string | number;
  name: string;
  slug?: string;
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

  const [ranchos, setRanchos] = useState<Ranch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanchos = async () => {
      try {
        setLoading(true);
        
        // Buscar ranchos disponíveis
        const { data: ranchosData, error: ranchosError } = await supabase
          .from('ranchos')
          .select('*')
          .eq('disponivel', true)
          .order('destaque', { ascending: false })
          .order('created_at', { ascending: false });

        if (ranchosError) throw ranchosError;

        // Buscar imagens para cada rancho
        const ranchosWithImages = await Promise.all(
          (ranchosData || []).map(async (rancho) => {
            const { data: imagesData } = await supabase
              .from('rancho_imagens')
              .select('url, alt_text, principal, ordem')
              .eq('rancho_id', rancho.id)
              .order('ordem', { ascending: true });

            // Ordenar imagens para que a principal venha primeiro
            const sortedImages = (imagesData || []).sort((a, b) => {
              if (a.principal && !b.principal) return -1;
              if (!a.principal && b.principal) return 1;
              return (a.ordem ?? 0) - (b.ordem ?? 0);
            });

            return {
              id: rancho.id,
              name: rancho.nome,
              slug: rancho.slug,
              description: rancho.descricao || '',
              location: rancho.localizacao,
              capacity: rancho.capacidade,
              price: Number(rancho.preco),
              rating: Number(rancho.rating),
              images: sortedImages.map(img => img.url),
              amenities: rancho.comodidades || [],
              available: rancho.disponivel,
              features: {
                bedrooms: rancho.quartos,
                bathrooms: rancho.banheiros,
                area: rancho.area ? `${rancho.area}m²` : '0m²'
              }
            };
          })
        );

        setRanchos(ranchosWithImages);
      } catch (error) {
        console.error('Erro ao buscar ranchos:', error);
        toast.error('Erro ao carregar ranchos');
      } finally {
        setLoading(false);
      }
    };

    fetchRanchos();
  }, []);

  const filteredRanchos = useMemo(() => {
    return ranchos.filter(rancho => {
      // Capacity filter
      if (rancho.capacity < filters.capacity) return false;
      
      // Price filter
      if (rancho.price < filters.minPrice || rancho.price > filters.maxPrice) return false;
      
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
  }, [filters, ranchos]);

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
