import React, { useState, useEffect } from 'react';
import PropriedadeCard from './PropriedadeCard';
import { MapPin, Loader2, Sparkles, Handshake, Landmark } from 'lucide-react';
import { usePropriedadesVenda } from '@/hooks/useOptimizedData';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PropriedadesVendaSection = () => {
  const { data: propriedades, isLoading } = usePropriedadesVenda(true);
  const [heroImage, setHeroImage] = useState('');

  // Fetch sales hero image from site mappings
  const { data: heroData } = useQuery({
    queryKey: ['vendas-hero'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings_public')
        .select('reserva_button_text')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .single();
      
      if (error) return null;
      if (data?.reserva_button_text) {
        const url = data.reserva_button_text.split('|')[3];
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

  // Calculate stats
  const lowestPrice = React.useMemo(() => {
    if (!propriedades || propriedades.length === 0) return 0;
    return Math.min(...propriedades.map(p => p.preco));
  }, [propriedades]);

  const uniqueLocationsCount = React.useMemo(() => {
    if (!propriedades) return 0;
    const locations = propriedades.map(p => p.localizacao.toLowerCase());
    return new Set(locations).size;
  }, [propriedades]);

  return (
    <section id="venda" className="bg-gray-50 pb-20">
      {/* Header / Hero Section */}
      <div 
        className="relative bg-cover bg-center py-24 mb-16 text-white overflow-hidden"
        style={heroImage ? { backgroundImage: `url('${heroImage}')` } : {}}
      >
        {heroImage ? (
          <>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/20 to-transparent bottom-[-1px]"></div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent bottom-[-1px]"></div>
          </>
        )}
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center drop-shadow-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>Invista no seu Lazer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Oportunidades à Venda
          </h2>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            Adquira o seu próprio lote, terreno ou rancho pronto na região do Rio São Francisco e Represa de Três Marias. 
            Excelente potencial de valorização e contato direto para negociação.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-rio-blue" />
          </div>
        ) : propriedades && propriedades.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {propriedades.map((propriedade) => (
              <PropriedadeCard key={propriedade.id} propriedade={propriedade} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhuma oportunidade à venda cadastrada no momento
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Em breve teremos novas opções de lotes, terrenos e ranchos para você. Entre em contato conosco para encomendar seu imóvel.
            </p>
          </div>
        )}

        {/* Stats Section */}
        {propriedades && propriedades.length > 0 && (
          <div className="mt-16 bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-150">
              <div className="pt-4 md:pt-0">
                <div className="text-3xl font-bold text-rio-blue mb-2">
                  {propriedades.length}
                </div>
                <div className="text-gray-600 flex items-center justify-center gap-1.5">
                  <Landmark className="h-4 w-4 text-rio-blue" />
                  Imóveis Disponíveis
                </div>
              </div>
              
              <div className="pt-6 md:pt-0">
                <div className="text-3xl font-bold text-water-green mb-2">
                  A partir de R$ {lowestPrice.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-gray-600 flex items-center justify-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-water-green" />
                  Melhor Preço da Região
                </div>
              </div>
              
              <div className="pt-6 md:pt-0">
                <div className="text-3xl font-bold text-sunset-orange mb-2">
                  {uniqueLocationsCount} {uniqueLocationsCount === 1 ? 'Região' : 'Regiões'}
                </div>
                <div className="text-gray-600 flex items-center justify-center gap-1.5">
                  <Handshake className="h-4 w-4 text-sunset-orange" />
                  Negociação Facilitada
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropriedadesVendaSection;
