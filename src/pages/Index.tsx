import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import { AnunciosSection } from '@/components/AnunciosSection';
import RanchosSection from '@/components/RanchosSection';
import PackagesSection from '@/components/PackagesSection';
import BlogSection from '@/components/BlogSection';
import LunarCalendar from '@/components/LunarCalendar';
import DamInfo from '@/components/DamInfo';
import WeatherDashboard from '@/components/WeatherDashboard';
import WhatsAppButton from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';
import { FAQSection } from '@/components/FAQSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';

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
      
      {/* Dados em tempo real */}
      <DamInfo />
      <LunarCalendar />
      <WeatherDashboard />
      
      <AnunciosSection posicao="meio" />
      
      {/* Conteúdo principal */}
      <RanchosSection />
      <PackagesSection />
      <BlogSection />
      
      {/* Seções de suporte */}
      <TestimonialsSection />
      <FAQSection />
      
      <AnunciosSection posicao="rodape" />
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Index;
