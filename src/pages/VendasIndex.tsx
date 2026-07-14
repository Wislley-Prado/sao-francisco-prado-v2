import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropriedadesVendaSection from '@/components/PropriedadesVendaSection';
import { useTranslation } from 'react-i18next';

const VendasIndex = () => {
  const { t } = useTranslation();
  const { data: settings } = useQuery({
    queryKey: ['site-settings-og'],
    queryFn: async () => {
      const { data } = await supabase
        .from('site_settings_public')
        .select('og_image_url')
        .limit(1)
        .single();
      return data;
    },
    staleTime: 30 * 60 * 1000,
  });

  const ogImage = (settings as { og_image_url?: string })?.og_image_url || '/og-image.png';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>{t('labels.vendasTitle', 'Imóveis, Lotes e Ranchos à Venda')} | PradoAqui</title>
        <meta name="description" content={t('labels.vendasDesc', 'Encontre oportunidades exclusivas de lotes, terrenos e ranchos à venda na região do Rio São Francisco e Represa de Três Marias/MG.')} />
        <meta property="og:title" content={t('labels.vendasOgTitle', 'Oportunidades de Compra | PradoAqui')} />
        <meta property="og:description" content={t('labels.vendasOgDesc', 'Invista no seu lazer: lotes, terrenos e ranchos à venda com localização privilegiada no Rio São Francisco.')} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content="https://pradoaqui.com/vendas" />
        <meta name="twitter:title" content={`${t('labels.vendasTitle', 'Imóveis, Lotes e Ranchos à Venda')} | PradoAqui`} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <Header />
      
      <main className="flex-1">
        <PropriedadesVendaSection />
      </main>

      <Footer />
    </div>
  );
};

export default VendasIndex;
