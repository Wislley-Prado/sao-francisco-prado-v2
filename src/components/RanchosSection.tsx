
import React, { useState, useEffect } from 'react';
import RanchCard from './RanchCard';
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

const RanchosSection = () => {
  const [ranchos, setRanchos] = useState<Ranch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanchos = async () => {
      try {
        setLoading(true);
        
        const { data: ranchosData, error: ranchosError } = await supabase
          .from('ranchos')
          .select('*')
          .eq('disponivel', true)
          .order('destaque', { ascending: false })
          .order('created_at', { ascending: false });

        if (ranchosError) throw ranchosError;

        const ranchosWithImages = await Promise.all(
          (ranchosData || []).map(async (rancho) => {
            const { data: imagesData } = await supabase
              .from('rancho_imagens')
              .select('url, alt_text, principal, ordem')
              .eq('rancho_id', rancho.id)
              .order('ordem', { ascending: true });

            return {
              id: rancho.id,
              name: rancho.nome,
              slug: rancho.slug,
              description: rancho.descricao || '',
              location: rancho.localizacao,
              capacity: rancho.capacidade,
              price: Number(rancho.preco),
              rating: Number(rancho.rating),
              images: (imagesData || []).map(img => img.url),
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

        {/* Ranchos Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-rio-blue" />
          </div>
        ) : ranchos.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ranchos.map((rancho) => (
              <RanchCard key={rancho.id} ranch={rancho} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum rancho disponível
            </h3>
            <p className="text-gray-500">
              Em breve teremos novas opções para você.
            </p>
          </div>
        )}

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
