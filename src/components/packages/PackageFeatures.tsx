import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface PackageFeaturesProps {
  features: Feature[];
  tier: 'vip' | 'luxo' | 'diamante';
}

const tierIconColors = {
  vip: 'text-[hsl(var(--tier-vip))]',
  luxo: 'text-[hsl(var(--tier-luxo))]',
  diamante: 'text-[hsl(var(--tier-diamante))]',
};

const tierBgColors = {
  vip: 'bg-[hsl(var(--tier-vip))]/10',
  luxo: 'bg-[hsl(var(--tier-luxo))]/10',
  diamante: 'bg-[hsl(var(--tier-diamante))]/10',
};

const FeatureCard = ({ feature, tier, index }: { feature: Feature; tier: 'vip' | 'luxo' | 'diamante'; index: number }) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card className="border-border hover:border-primary/50 transition-all hover:shadow-xl h-full">
        <CardContent className="p-6 text-center space-y-3">
          <div className={`mx-auto w-14 h-14 rounded-full ${tierBgColors[tier]} flex items-center justify-center transition-transform hover:scale-110`}>
            <feature.icon className={`w-7 h-7 ${tierIconColors[tier]}`} />
          </div>
          <h3 className="font-bold text-foreground">
            {feature.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export const PackageFeatures = ({ features, tier }: PackageFeaturesProps) => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal({ threshold: 0.5 });
  const mainFeatures = features.slice(0, 8);

  return (
    <section className="py-16 bg-muted/20">
      <div className="container max-w-7xl mx-auto px-4">
        <div
          ref={titleRef}
          className={`text-center mb-12 transition-all duration-700 ${
            titleVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            O que está incluído
          </h2>
          <p className="text-muted-foreground text-lg">
            Tudo que você precisa para uma experiência completa
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              tier={tier}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
