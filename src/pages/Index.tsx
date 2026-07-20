import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import WhatsAppButton from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import LazySection from '@/components/LazySection';

import { lazyWithRetry } from '@/utils/lazyWithRetry';

class SectionErrorBoundary extends React.Component<{ children: React.ReactNode; fallback?: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error('SectionErrorBoundary caught an isolated error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

// Lazy load all below-the-fold sections with auto-retry
const AnunciosSection = lazyWithRetry(() => import('@/components/AnunciosSection').then(m => ({ default: m.AnunciosSection })));
const DamInfo = lazyWithRetry(() => import('@/components/DamInfo'));
const LunarCalendar = lazyWithRetry(() => import('@/components/LunarCalendar'));
const WeatherDashboard = lazyWithRetry(() => import('@/components/WeatherDashboard'));
const RanchosSection = lazyWithRetry(() => import('@/components/RanchosSection'));
const PropriedadesVendaSection = lazyWithRetry(() => import('@/components/PropriedadesVendaSection'));
const PackagesSection = lazyWithRetry(() => import('@/components/PackagesSection'));
const BlogSection = lazyWithRetry(() => import('@/components/BlogSection'));
const TestimonialsSection = lazyWithRetry(() => import('@/components/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
const FAQSection = lazyWithRetry(() => import('@/components/FAQSection').then(m => ({ default: m.FAQSection })));

const SectionSkeleton = () => (
  <div className="py-16 container mx-auto px-4">
    <Skeleton className="h-64 w-full rounded-xl" />
  </div>
);

const Index = () => {
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
    staleTime: 0,
  });

  const ogImage = (settings as { og_image_url?: string })?.og_image_url || '/og-image.png';

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>PradoAqui | Rio São Francisco ao Vivo - Pesca em Três Marias/MG</title>
        <meta name="description" content="Sua experiência de pesca no Rio São Francisco começa aqui! Ranchos exclusivos, pacotes personalizados e estrutura completa em Três Marias/MG." />
        <meta property="og:title" content="PradoAqui | Rio São Francisco ao Vivo" />
        <meta property="og:description" content="Sua experiência de pesca no Rio São Francisco começa aqui! Ranchos exclusivos e pacotes personalizados em Três Marias/MG." />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content="https://pradoaqui.com" />
        <meta name="twitter:title" content="PradoAqui | Rio São Francisco ao Vivo" />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <Header />
      <HeroSection />

      {/* Anúncios topo */}
      <LazySection fallback={null} rootMargin="100px">
        <SectionErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <AnunciosSection posicao="topo" />
          </Suspense>
        </SectionErrorBoundary>
      </LazySection>

      {/* Dados em tempo real */}
      <LazySection fallback={<SectionSkeleton />} rootMargin="300px" id="represa">
        <SectionErrorBoundary fallback={null}>
          <Suspense fallback={<SectionSkeleton />}>
            <DamInfo />
          </Suspense>
        </SectionErrorBoundary>
      </LazySection>

      <LazySection fallback={<SectionSkeleton />} rootMargin="200px" id="calendario-lunar">
        <SectionErrorBoundary fallback={null}>
          <Suspense fallback={<SectionSkeleton />}>
            <LunarCalendar />
          </Suspense>
        </SectionErrorBoundary>
      </LazySection>

      <LazySection fallback={<SectionSkeleton />} rootMargin="200px">
        <SectionErrorBoundary fallback={null}>
          <Suspense fallback={<SectionSkeleton />}>
            <WeatherDashboard />
          </Suspense>
        </SectionErrorBoundary>
      </LazySection>

      <LazySection fallback={null} rootMargin="200px">
        <SectionErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <AnunciosSection posicao="meio" />
          </Suspense>
        </SectionErrorBoundary>
      </LazySection>

      {/* Conteúdo principal */}
      <LazySection fallback={<SectionSkeleton />} rootMargin="300px" id="ranchos">
        <SectionErrorBoundary fallback={null}>
          <Suspense fallback={<SectionSkeleton />}>
            <RanchosSection />
          </Suspense>
        </SectionErrorBoundary>
      </LazySection>

      <LazySection fallback={<SectionSkeleton />} rootMargin="300px" id="venda">
        <SectionErrorBoundary fallback={null}>
          <Suspense fallback={<SectionSkeleton />}>
            <PropriedadesVendaSection />
          </Suspense>
        </SectionErrorBoundary>
      </LazySection>

      <LazySection fallback={<SectionSkeleton />} rootMargin="200px">
        <SectionErrorBoundary fallback={null}>
          <Suspense fallback={<SectionSkeleton />}>
            <PackagesSection />
          </Suspense>
        </SectionErrorBoundary>
      </LazySection>

      <LazySection fallback={<SectionSkeleton />} rootMargin="200px">
        <SectionErrorBoundary fallback={null}>
          <Suspense fallback={<SectionSkeleton />}>
            <BlogSection />
          </Suspense>
        </SectionErrorBoundary>
      </LazySection>

      {/* Seções de suporte */}
      <LazySection fallback={null} rootMargin="200px">
        <SectionErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <TestimonialsSection />
          </Suspense>
        </SectionErrorBoundary>
      </LazySection>

      <LazySection fallback={null} rootMargin="200px">
        <SectionErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <FAQSection />
          </Suspense>
        </SectionErrorBoundary>
      </LazySection>

      <LazySection fallback={null} rootMargin="200px">
        <SectionErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <AnunciosSection posicao="rodape" />
          </Suspense>
        </SectionErrorBoundary>
      </LazySection>

      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Index;
