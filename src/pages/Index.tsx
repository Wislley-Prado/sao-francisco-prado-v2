
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import PackagesSection from '@/components/PackagesSection';
import LunarCalendar from '@/components/LunarCalendar';
import DamInfo from '@/components/DamInfo';
import WhatsAppButton from '@/components/WhatsAppButton';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <PackagesSection />
      <LunarCalendar />
      <DamInfo />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
