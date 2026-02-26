import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import { AnunciosSection } from '@/components/AnunciosSection';
import RanchosSection from '@/components/RanchosSection';
import PackagesSection from '@/components/PackagesSection';
import WhatsAppButton from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import LazyRender from '@/components/LazyRender';

// Lazy load below-the-fold sections
const DamInfo = React.lazy(() => import('@/components/DamInfo'));
const LunarCalendar = React.lazy(() => import('@/components/LunarCalendar'));
const WeatherDashboard = React.lazy(() => import('@/components/WeatherDashboard'));
const BlogSection = React.lazy(() => import('@/components/BlogSection'));
const TestimonialsSection = React.lazy(() => import('@/components/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
const FAQSection = React.lazy(() => import('@/components/FAQSection').then(m => ({ default: m.FAQSection })));

const SectionSkeleton = () => (
  <div className="py-16 container mx-auto px-4">
    <Skeleton className="h-64 w-full rounded-xl" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>PradoAqui | Rio São Francisco ao Vivo - Pesca em Três Marias/MG</title>
        <meta name="description" content="Sua experiência de pesca no Rio São Francisco começa aqui! Ranchos exclusivos, pacotes personalizados e estrutura completa em Três Marias/MG." />
        <meta property="og:title" content="PradoAqui | Rio São Francisco ao Vivo" />
        <meta property="og:description" content="Sua experiência de pesca no Rio São Francisco começa aqui! Ranchos exclusivos e pacotes personalizados em Três Marias/MG." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://pradoaqui.com" />
        <meta name="twitter:title" content="PradoAqui | Rio São Francisco ao Vivo" />
        <meta name="twitter:image" content="/og-image.png" />
      </Helmet>
      <Header />
      <HeroSection />
      <AnunciosSection posicao="topo" />
      
      {/* Dados em tempo real - lazy render when near viewport */}
      <LazyRender fallback={<SectionSkeleton />}>
        <Suspense fallback={<SectionSkeleton />}>
          <DamInfo />
        </Suspense>
      </LazyRender>
      <LazyRender fallback={<SectionSkeleton />}>
        <Suspense fallback={<SectionSkeleton />}>
          <LunarCalendar />
        </Suspense>
      </LazyRender>
      <LazyRender fallback={<SectionSkeleton />}>
        <Suspense fallback={<SectionSkeleton />}>
          <WeatherDashboard />
        </Suspense>
      </LazyRender>
      
      <AnunciosSection posicao="meio" />
      
      {/* Conteúdo principal */}
      <LazyRender>
        <RanchosSection />
      </LazyRender>
      <LazyRender>
        <PackagesSection />
      </LazyRender>
      <LazyRender fallback={<SectionSkeleton />}>
        <Suspense fallback={<SectionSkeleton />}>
          <BlogSection />
        </Suspense>
      </LazyRender>
      
      {/* Seções de suporte */}
      <LazyRender>
        <Suspense fallback={null}>
          <TestimonialsSection />
        </Suspense>
      </LazyRender>
      <LazyRender>
        <Suspense fallback={null}>
          <FAQSection />
        </Suspense>
      </LazyRender>
      
      <AnunciosSection posicao="rodape" />
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Index;
