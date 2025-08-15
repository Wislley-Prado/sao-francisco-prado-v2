
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, Fish, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [cacheKey, setCacheKey] = useState(() => Date.now());
  
  // Force update every 30 seconds to ensure fresh content
  useEffect(() => {
    const interval = setInterval(() => {
      setCacheKey(Date.now());
      console.log('🏠 HeroSection: Auto-atualizando cacheKey para quebrar cache');
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Generate unique URL for YouTube embed
  const generateHeroStreamURL = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `https://www.youtube.com/embed/iGQdBZEuPAs?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&showinfo=0&loop=1&playlist=iGQdBZEuPAs&t=${cacheKey}&nocache=${random}&v=${timestamp}`;
  };

  console.log('🏠 HeroSection: Renderizando com cacheKey:', cacheKey);
  console.log('🏠 HeroSection: URL do embed:', generateHeroStreamURL());

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          key={`hero-${cacheKey}-${Date.now()}`}
          className="absolute inset-0 w-full h-full object-cover scale-110"
          src={generateHeroStreamURL()}
          title="Rio São Francisco - Vista Panorâmica"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            pointerEvents: 'none',
            filter: 'brightness(0.7)'
          }}
          onLoad={() => {
            console.log('🏠 HeroSection: YouTube background carregado com ID iGQdBZEuPAs, cacheKey:', cacheKey);
          }}
          onError={() => {
            console.error('❌ HeroSection: Erro ao carregar background do YouTube');
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
            <Fish className="h-10 w-10 text-sandy-beige" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Prado<span className="text-sandy-beige">Aqui</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Sua aventura de pesca no <span className="text-sandy-beige font-semibold">Rio São Francisco</span> começa aqui
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link to="/live">
            <Button size="lg" className="bg-rio-blue hover:bg-rio-blue/90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl transition-all duration-300 hover:scale-105">
              <PlayCircle className="mr-2 h-6 w-6" />
              Assistir ao Vivo
            </Button>
          </Link>
          <Link to="/pacotes">
            <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-rio-blue px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm bg-white/10 transition-all duration-300 hover:scale-105">
              Ver Pacotes
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Users className="h-8 w-8 text-sandy-beige mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">500+</div>
            <div className="text-white/80">Pescadores Satisfeitos</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Fish className="h-8 w-8 text-sandy-beige mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">1000+</div>
            <div className="text-white/80">Peixes Capturados</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Star className="h-8 w-8 text-sandy-beige mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">4.9</div>
            <div className="text-white/80">Avaliação Média</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
