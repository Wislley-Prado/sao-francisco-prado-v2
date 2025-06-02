
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import RanchosSection from "@/components/RanchosSection";
import PackagesSection from "@/components/PackagesSection";
import BlogSection from "@/components/BlogSection";
import LiveStreamSection from "@/components/LiveStreamSection";
import WeatherDashboard from "@/components/WeatherDashboard";
import DamInfo from "@/components/DamInfo";
import LunarCalendar from "@/components/LunarCalendar";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <RanchosSection />
      <PackagesSection />
      <LiveStreamSection />
      <WeatherDashboard />
      <DamInfo />
      <LunarCalendar />
      <BlogSection />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
