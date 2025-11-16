import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
  vip: 'text-blue-500',
  luxo: 'text-emerald-500',
  diamante: 'text-amber-500',
};

const tierBgColors = {
  vip: 'bg-blue-500/10',
  luxo: 'bg-emerald-500/10',
  diamante: 'bg-amber-500/10',
};

export const PackageFeatures = ({ features, tier }: PackageFeaturesProps) => {
  // Limitar a 8 features principais
  const mainFeatures = features.slice(0, 8);

  return (
    <section className="py-12">
      <div className="container max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          O que está incluído
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainFeatures.map((feature, index) => (
            <Card key={index} className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center space-y-3">
                <div className={`mx-auto w-12 h-12 rounded-full ${tierBgColors[tier]} flex items-center justify-center`}>
                  <feature.icon className={`w-6 h-6 ${tierIconColors[tier]}`} />
                </div>
                <h3 className="font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
