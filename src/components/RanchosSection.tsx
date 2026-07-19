import React, { useState, useEffect } from 'react';
import RanchCard from './RanchCard';
import { MapPin, Star, Loader2 } from 'lucide-react';
import { useRanchos } from '@/hooks/useOptimizedData';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

const RanchosSection = () => {
  const { t } = useTranslation();
  const { data: ranchosData, isLoading } = useRanchos(true);
  const [heroImage, setHeroImage] = useState('');

  // Fetch ranchos hero image from site mappings
  const { data: heroData } = useQuery({
    queryKey: ['ranchos-hero'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings_public')
        .select('reserva_button_text')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .single();
      
      if (error) return null;
      if (data?.reserva_button_text) {
        const url = data.reserva_button_text.split('|')[2];
        if (url) return url;
      }
      return null;
    }
  });

  useEffect(() => {
    if (heroData) {
      setHeroImage(heroData);
    }
  }, [heroData]);

  // Transform data to expected format com validação defensiva total
  const ranchos = React.useMemo(() => {
    if (!ranchosData || !Array.isArray(ranchosData)) return [];
    return ranchosData.map(rancho => {
      const rawImagens = Array.isArray(rancho?.imagens) ? rancho.imagens : [];
      const images = [...rawImagens]
        .sort((a, b) => {
          if (a?.principal && !b?.principal) return -1;
          if (!a?.principal && b?.principal) return 1;
          return (a?.ordem || 0) - (b?.ordem || 0);
        })
        .map(img => (typeof img === 'string' ? img : img?.url || ''))
        .filter(Boolean);

      return {
        id: rancho?.id || String(Math.random()),
        name: rancho?.nome || 'Rancho',
        name_en: rancho?.nome_en || null,
        slug: rancho?.slug || '',
        description: rancho?.descricao || '',
        description_en: rancho?.descricao_en || null,
        location: rancho?.localizacao || '',
        location_en: rancho?.localizacao_en || null,
        capacity: Number(rancho?.capacidade || 0),
        price: Number(rancho?.preco || 0),
        rating: Number(rancho?.rating || 5),
        images,
        amenities: Array.isArray(rancho?.comodidades) ? rancho.comodidades : [],
        available: Boolean(rancho?.disponivel),
        features: {
          bedrooms: Number(rancho?.quartos || 0),
          bathrooms: Number(rancho?.banheiros || 0),
          area: rancho?.area ? `${rancho.area}m²` : '0m²'
        }
      };
    });
  }, [ranchosData]);

  return (
    <section id="ranchos" className="bg-gray-50 pb-20">
      {/* Header / Hero Section */}
      <div 
        className="relative bg-cover bg-center py-24 mb-16 text-white"
        style={heroImage ? { backgroundImage: `url('${heroImage}')` } : {}}
      >
        {heroImage ? (
          <>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/20 to-transparent bottom-[-1px]"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"></div>
        )}
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center drop-shadow-lg">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('ranchos.title')}
          </h2>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            {t('ranchos.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Ranchos Grid */}
        {isLoading ? (
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
