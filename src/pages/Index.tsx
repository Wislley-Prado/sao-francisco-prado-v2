
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import RanchosSection from '@/components/RanchosSection';
import PackagesSection from '@/components/PackagesSection';
import BlogSection from '@/components/BlogSection';
import LunarCalendar from '@/components/LunarCalendar';
import DamInfo from '@/components/DamInfo';
import WhatsAppButton from '@/components/WhatsAppButton';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <RanchosSection />
      <PackagesSection />
      <BlogSection />
      <LunarCalendar />
      <DamInfo />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
