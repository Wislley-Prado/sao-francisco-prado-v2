import { Star, TrendingUp, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useParallax } from '@/hooks/useParallax';

interface PackageHeroProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  rating?: number;
  reviewsCount?: number;
  badge?: 'popular' | 'destaque' | 'exclusivo';
  tier: 'vip' | 'luxo' | 'diamante';
  onCtaClick: () => void;
}

const tierGradients = {
  vip: 'from-[hsl(var(--tier-vip))] via-[hsl(var(--tier-vip))]/95 to-[hsl(var(--tier-vip))]/90',
  luxo: 'from-[hsl(var(--tier-luxo))] via-[hsl(var(--tier-luxo))]/95 to-[hsl(var(--tier-luxo))]/90',
  diamante: 'from-[hsl(var(--tier-diamante))] via-[hsl(var(--tier-diamante))]/95 to-[hsl(var(--tier-diamante))]/90',
};

const tierAccents = {
  vip: 'bg-[hsl(var(--tier-vip-light))]/20 text-white border-white/30 backdrop-blur-md',
  luxo: 'bg-[hsl(var(--tier-luxo-light))]/20 text-white border-white/30 backdrop-blur-md',
  diamante: 'bg-[hsl(var(--tier-diamante-light))]/20 text-white border-white/30 backdrop-blur-md',
};

const badgeLabels = {
  popular: 'Mais Popular',
  destaque: 'Em Destaque',
  exclusivo: 'Exclusivo',
};

export const PackageHero = ({
  title,
  subtitle,
  imageUrl,
  rating = 4.9,
  reviewsCount = 127,
  badge,
  tier,
  onCtaClick,
}: PackageHeroProps) => {
  const parallaxOffset = useParallax({ speed: 0.5 });

  return (
    <div className="relative h-[65vh] md:h-[70vh] overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-110 transition-transform duration-100"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          transform: `translateY(${parallaxOffset}px)`
        }}
      >
        {/* Gradient Overlay - Dual Layer for Depth */}
        <div className="absolute inset-0 bg-black/40" />
        <div className={`absolute inset-0 bg-gradient-to-br ${tierGradients[tier]} opacity-80`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative h-full container max-w-7xl mx-auto px-4 flex flex-col justify-center">
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          {badge && (
            <Badge className={`mb-6 text-sm px-4 py-2 ${tierAccents[tier]}`}>
              <Sparkles className="w-4 h-4 mr-2" />
              {badgeLabels[badge]}
            </Badge>
          )}
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            {title}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl leading-relaxed">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-5 py-3 rounded-full border border-white/20">
              <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
              <span className="text-white font-bold text-lg">{rating}</span>
              <span className="text-white/90 text-base">({reviewsCount} avaliações)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              onClick={onCtaClick}
              className="bg-white text-gray-900 hover:bg-white/95 font-bold text-lg px-8 py-6 rounded-xl transition-all hover:scale-105"
            >
              Reservar Agora
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={onCtaClick}
              className="bg-white/15 backdrop-blur-md text-white border-2 border-white/40 hover:bg-white/25 font-semibold text-lg px-8 py-6 rounded-xl transition-all hover:scale-105"
            >
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
