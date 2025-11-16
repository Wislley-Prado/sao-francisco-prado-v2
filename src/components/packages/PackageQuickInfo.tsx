import { Clock, Users, MapPin, CreditCard } from 'lucide-react';

interface PackageQuickInfoProps {
  duration: string;
  people: number;
  location: string;
  price: string;
  className?: string;
}

export const PackageQuickInfo = ({ duration, people, location, price, className = '' }: PackageQuickInfoProps) => {
  return (
    <div className={`bg-card border-y border-border py-4 ${className}`}>
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>{duration}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>{people} pessoas</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{location}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <span>{price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
