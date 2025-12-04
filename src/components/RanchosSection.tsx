
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import RanchCard from './RanchCard';
import { MapPin, Star, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  destaque?: boolean;
  totalAvaliacoes?: number;
  hasVideo?: boolean;
}

const RanchosSection = () => {
  // Query otimizada: busca ranchos, imagens e contagem de avaliações em uma única chamada
  const { data: ranchos = [], isLoading } = useQuery({
    queryKey: ['ranchos-disponiveis'],
    queryFn: async () => {
      // Query única com joins
      const { data: ranchosData, error } = await supabase
        .from('ranchos')
        .select(`
          *,
          rancho_imagens (url, alt_text, principal, ordem),
          avaliacoes (id)
        `)
        .eq('disponivel', true)
        .order('destaque', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transformar dados
      return (ranchosData || []).map((rancho) => {
        // Ordenar imagens: principal primeiro, depois por ordem
        const sortedImages = (rancho.rancho_imagens || [])
          .sort((a: any, b: any) => {
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
          images: sortedImages.map((img: any) => img.url),
          amenities: rancho.comodidades || [],
          available: rancho.disponivel,
          features: {
            bedrooms: rancho.quartos,
            bathrooms: rancho.banheiros,
            area: rancho.area ? `${rancho.area}m²` : '0m²'
          },
          destaque: rancho.destaque,
          totalAvaliacoes: rancho.avaliacoes?.length || 0,
          hasVideo: !!rancho.video_youtube
        } as Ranch;
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
  });

  // Memoizar cálculo da média
  const avgRating = useMemo(() => {
    if (ranchos.length === 0) return '0.0';
    return (ranchos.reduce((sum, r) => sum + r.rating, 0) / ranchos.length).toFixed(1);
  }, [ranchos]);

  if (isLoading) {
    return (
      <section id="ranchos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-rio-blue" />
            <span className="ml-2 text-gray-600">Carregando ranchos...</span>
          </div>
        </div>
      </section>
    );
  }

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
        {ranchos.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ranchos.map((rancho) => (
              <RanchCard key={rancho.id} ranch={rancho} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum rancho disponível no momento
            </h3>
            <p className="text-gray-500">
              Volte em breve para conferir novas opções.
            </p>
          </div>
        )}

        {/* Stats Section */}
        {ranchos.length > 0 && (
          <div className="mt-16 bg-white rounded-xl p-8 shadow-lg">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-rio-blue mb-2">{ranchos.length}</div>
                <div className="text-gray-600">Ranchos Disponíveis</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-water-green mb-2">{avgRating}</div>
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
        )}
      </div>
    </section>
  );
};

export default RanchosSection;
