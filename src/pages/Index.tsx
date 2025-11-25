
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import { AnunciosSection } from '@/components/AnunciosSection';
import RanchosSection from '@/components/RanchosSection';
import PackagesSection from '@/components/PackagesSection';
import { PropriedadesVendaSection } from '@/components/PropriedadesVendaSection';
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
      <Header />
      <HeroSection />
      <AnunciosSection posicao="topo" />
      <RanchosSection />
      <PackagesSection />
      <AnunciosSection posicao="meio" />
      <PropriedadesVendaSection />
      <BlogSection />
      <TestimonialsSection />
      <FAQSection />
      <LunarCalendar />
      <WeatherDashboard />
      <DamInfo />
      <AnunciosSection posicao="rodape" />
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Index;
