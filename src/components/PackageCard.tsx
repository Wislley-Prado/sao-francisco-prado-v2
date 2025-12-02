import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Fish, Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Package {
  id: number;
  title: string;
  description: string;
  price: string;
  duration: string;
  people: string;
  rating: number;
  features: string[];
  image: string;
  popular: boolean;
  slug?: string;
}

interface PackageCardProps {
  pkg: Package;
}

const PackageCard = ({ pkg }: PackageCardProps) => {
  const packageRoute = pkg.slug ? `/pacote/${pkg.slug}` : '/pacotes';

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
        pkg.popular 
          ? 'ring-2 ring-accent shadow-xl scale-105' 
          : 'hover:shadow-lg'
      }`}
    >
      {pkg.popular && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-accent text-accent-foreground font-semibold">
            Mais Popular
          </Badge>
        </div>
      )}

      <CardHeader className="p-0">
        <div className="h-48 relative overflow-hidden">
          <img 
            src={pkg.image} 
            alt={pkg.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
            onError={(e) => {
              console.log('Erro ao carregar imagem:', pkg.image);
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.classList.add('bg-river-gradient');
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center space-x-1 mb-2">
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span className="text-sm font-medium">{pkg.rating}</span>
            </div>
            <CardTitle className="text-2xl font-bold drop-shadow-lg">{pkg.title}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <p className="text-muted-foreground mb-4">{pkg.description}</p>

        {/* Package Info */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-3xl font-bold text-primary">{pkg.price}</div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {pkg.duration}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {pkg.people}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-6">
          {pkg.features.map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-muted-foreground">
              <Fish className="h-4 w-4 mr-2 text-secondary" />
              {feature}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button 
          variant={pkg.popular ? 'sunset' : 'water'}
          className="w-full"
          asChild
        >
          <Link to={packageRoute}>
            <Calendar className="mr-2 h-4 w-4" />
            Ver Detalhes
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PackageCard;
