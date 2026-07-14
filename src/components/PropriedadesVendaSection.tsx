import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropriedadeCard from './PropriedadeCard';
import { MapPin, Loader2, Sparkles, Handshake, Landmark, ArrowRight, Building2 } from 'lucide-react';
import { usePropriedadesVenda } from '@/hooks/useOptimizedData';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const MAX_HOME_ITEMS = 6;

const PropriedadesVendaSection = () => {
  const { t } = useTranslation();
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

  // Limit to MAX_HOME_ITEMS when on home page
  const displayedPropriedades = React.useMemo(() => {
    if (!propriedades) return [];
    return propriedades.slice(0, MAX_HOME_ITEMS);
  }, [propriedades]);

  const hasMore = (propriedades?.length ?? 0) > MAX_HOME_ITEMS;

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
            <span>{t('labels.investLeisure')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('labels.salesTitle')}
          </h2>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            {t('labels.salesSub')}
          </p>
          <div className="mt-8">
            <Link to="/vendas">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-emerald-900/30 transition-all hover:scale-105"
              >
                <Building2 className="h-5 w-5 mr-2" />
                {t('labels.viewAllOpportunities')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-rio-blue" />
          </div>
        ) : displayedPropriedades.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPropriedades.map((propriedade) => (
                <PropriedadeCard key={propriedade.id} propriedade={propriedade} />
              ))}
            </div>

            {/* "Ver mais" button */}
            {hasMore && (
              <div className="mt-10 text-center">
                <Link to="/vendas">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-rio-blue text-rio-blue hover:bg-rio-blue hover:text-white font-semibold px-8 py-3 rounded-xl transition-all hover:scale-105"
                  >
                    {t('labels.viewAllCountOpportunities', { count: propriedades?.length })}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {t('labels.noSales')}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {t('labels.noSalesSub')}
            </p>
            <Link to="/vendas">
              <Button variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                {t('labels.viewOpportunitiesPage')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
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
                  {t('labels.availableProperties')}
                </div>
              </div>
              
              <div className="pt-6 md:pt-0">
                <div className="text-3xl font-bold text-water-green mb-2">
                  {t('labels.fromPrice')} R$ {lowestPrice.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-gray-600 flex items-center justify-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-water-green" />
                  {t('labels.bestPriceRegion')}
                </div>
              </div>
              
              <div className="pt-6 md:pt-0">
                <div className="text-3xl font-bold text-sunset-orange mb-2">
                  {t('labels.regionsCount', { count: uniqueLocationsCount })}
                </div>
                <div className="text-gray-600 flex items-center justify-center gap-1.5">
                  <Handshake className="h-4 w-4 text-sunset-orange" />
                  {t('labels.facilitatedNegotiation')}
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
