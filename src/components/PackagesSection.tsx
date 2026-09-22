import React, { useState, useEffect } from 'react';
import PackageCard from './PackageCard';
import PackageFeatures from './PackageFeatures';
import { usePacotes } from '@/hooks/useOptimizedData';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from './ui/skeleton';

const PackagesSection = () => {
  const { data: pacotesData, isLoading } = usePacotes(true);
  const [heroImage, setHeroImage] = useState('');

  // Fetch packages hero image from site mappings (reserva_button_text index 0)
  const { data: heroData } = useQuery({
    queryKey: ['packages-hero'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings_public')
        .select('reserva_button_text')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .single();
      
      if (error) return null;
      if (data?.reserva_button_text) {
        const url = data.reserva_button_text.split('|')[0];
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

  // Transform data to expected format
  const packages = React.useMemo(() => {
    if (!pacotesData) return [];
    return pacotesData.map((pacote, index) => {
      const mainImage = pacote.imagens.find(img => img.principal) || pacote.imagens[0];
      return {
        id: index + 1,
        slug: pacote.slug || '',
        title: pacote.nome,
        description: pacote.descricao || '',
        price: `R$ ${pacote.preco.toFixed(2)}`,
        duration: pacote.duracao,
        people: `${pacote.pessoas} pessoas`,
        rating: pacote.rating,
        features: pacote.inclusos || [],
        image: mainImage?.url || '',
        popular: pacote.popular
      };
    });
  }, [pacotesData]);

  if (!isLoading && packages.length === 0) {
    return null;
  }

  return (
    <section id="pacotes" className="bg-sand-beige pb-20">
      {/* Header / Hero Banner com a Imagem de Destaque dos Pacotes */}
      <div 
        className="relative bg-cover bg-center py-24 mb-16 text-white"
        style={heroImage ? { backgroundImage: `url('${heroImage}')` } : {}}
      >
        {heroImage ? (
          <>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-sand-beige via-sand-beige/20 to-transparent bottom-[-1px]"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"></div>
        )}
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center drop-shadow-lg">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Pacotes de Pesca
          </h2>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            Escolha o pacote perfeito para sua experiência no Rio São Francisco. 
            Todos incluem equipamentos de qualidade e guias especializados.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Packages Grid */}
        <div className={packages.length === 1 ? "flex justify-center mb-12" : "grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"}>
          {isLoading ? (
            <>
              <Skeleton className="h-[500px] w-full" />
              <Skeleton className="h-[500px] w-full" />
              <Skeleton className="h-[500px] w-full" />
            </>
          ) : packages.length > 0 ? (
            packages.map((pkg) => (
              <div key={pkg.id} className={packages.length === 1 ? "w-full max-w-md" : ""}>
                <PackageCard pkg={pkg} />
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">Nenhum pacote disponível no momento.</p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <PackageFeatures />
      </div>
    </section>
  );
};

export default PackagesSection;
