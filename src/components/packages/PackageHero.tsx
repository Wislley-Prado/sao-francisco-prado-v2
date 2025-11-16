import { Star, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

const tierColors = {
  vip: 'from-blue-600/90 to-blue-800/90',
  luxo: 'from-emerald-600/90 to-emerald-800/90',
  diamante: 'from-amber-600/90 to-amber-800/90',
};

const tierBadgeColors = {
  vip: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
  luxo: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
  diamante: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
};

const badgeLabels = {
  popular: 'Mais Popular',
  destaque: 'Destaque',
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
  return (
    <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${tierColors[tier]}`} />
      </div>

      {/* Content */}
      <div className="relative h-full container max-w-7xl mx-auto px-4 flex flex-col justify-center">
        <div className="max-w-3xl">
          {badge && (
            <Badge className={`mb-4 ${tierBadgeColors[tier]}`}>
              <TrendingUp className="w-3 h-3 mr-1" />
              {badgeLabels[badge]}
            </Badge>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-semibold">{rating}</span>
              <span className="text-white/80 text-sm">({reviewsCount} avaliações)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button 
              size="lg" 
              onClick={onCtaClick}
              className="bg-white text-gray-900 hover:bg-white/90 font-semibold shadow-lg"
            >
              Reservar Agora
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={onCtaClick}
              className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
            >
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
