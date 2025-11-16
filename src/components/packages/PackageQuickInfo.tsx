import { Clock, Users, MapPin, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PackageQuickInfoProps {
  duration: string;
  people: number;
  location: string;
  price: string;
  className?: string;
}

export const PackageQuickInfo = ({ duration, people, location, price, className = '' }: PackageQuickInfoProps) => {
  return (
    <div className={`-mt-12 relative z-10 ${className}`}>
      <div className="container max-w-6xl mx-auto px-4">
        <Card className="bg-card/95 backdrop-blur-lg border border-border shadow-2xl">
          <div className="flex flex-wrap items-center justify-around gap-6 p-6">
            <div className="flex flex-col items-center gap-2 min-w-[120px]">
              <Clock className="w-6 h-6 text-primary" />
              <span className="text-sm text-muted-foreground">Duração</span>
              <span className="font-semibold text-foreground">{duration}</span>
            </div>
            
            <div className="hidden sm:block w-px h-12 bg-border" />
            
            <div className="flex flex-col items-center gap-2 min-w-[120px]">
              <Users className="w-6 h-6 text-primary" />
              <span className="text-sm text-muted-foreground">Pessoas</span>
              <span className="font-semibold text-foreground">{people} pessoas</span>
            </div>
            
            <div className="hidden sm:block w-px h-12 bg-border" />
            
            <div className="flex flex-col items-center gap-2 min-w-[120px]">
              <MapPin className="w-6 h-6 text-primary" />
              <span className="text-sm text-muted-foreground">Localização</span>
              <span className="font-semibold text-foreground">{location}</span>
            </div>
            
            <div className="hidden sm:block w-px h-12 bg-border" />
            
            <div className="flex flex-col items-center gap-2 min-w-[120px]">
              <CreditCard className="w-6 h-6 text-primary" />
              <span className="text-sm text-muted-foreground">A partir de</span>
              <span className="font-bold text-lg text-primary">{price}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
