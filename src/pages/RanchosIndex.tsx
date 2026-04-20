import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RanchosSection from '@/components/RanchosSection';

const RanchosIndex = () => {
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
        <title>Ranchos para Aluguel | PradoAqui - Rio São Francisco</title>
        <meta name="description" content="Escolha o rancho perfeito para sua estadia no Rio São Francisco. Todos com localização privilegiada e estrutura completa para pescarias e turismo." />
        <meta property="og:title" content="Ranchos para Aluguel | PradoAqui" />
        <meta property="og:description" content="Localização privilegiada e estrutura completa para pescarias em Três Marias/MG." />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content="https://pradoaqui.com/ranchos" />
        <meta name="twitter:title" content="Ranchos para Aluguel | PradoAqui" />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <Header />
      
      <main className="flex-1">
        <RanchosSection />
      </main>

      <Footer />
    </div>
  );
};

export default RanchosIndex;
