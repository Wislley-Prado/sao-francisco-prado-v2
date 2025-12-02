import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Wifi, Car, Waves, Utensils, Star, Eye } from 'lucide-react';

interface Ranch {
  id: string | number;
  name: string;
  slug?: string;
  description: string;
  location: string;
  capacity: number;
  price: number;
  rating: number;
  images: string[];
  amenities: string[];
  available: boolean;
  features: {
    bedrooms: number;
    bathrooms: number;
    area: string;
  };
}

interface RanchCardProps {
  ranch: Ranch;
}

const RanchCard = ({ ranch }: RanchCardProps) => {
  const amenityIcons: { [key: string]: React.ReactNode } = {
    'Wi-Fi': <Wifi className="h-4 w-4" />,
    'Estacionamento': <Car className="h-4 w-4" />,
    'Piscina': <Waves className="h-4 w-4" />,
    'Churrasqueira': <Utensils className="h-4 w-4" />,
    'Deck de Pesca': <Waves className="h-4 w-4" />,
    'Ar Condicionado': <Wifi className="h-4 w-4" />,
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative">
          {ranch.images && ranch.images.length > 0 ? (
            <img 
              src={ranch.images[0]} 
              alt={ranch.name}
              className="h-48 w-full object-cover transition-transform duration-500 hover:scale-110"
            />
          ) : (
            <div className="h-48 bg-river-gradient" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          <div className="absolute top-4 right-4">
            {ranch.available ? (
              <Badge className="bg-secondary text-secondary-foreground font-semibold">Disponível</Badge>
            ) : (
              <Badge className="bg-destructive text-destructive-foreground">Ocupado</Badge>
            )}
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center space-x-1 mb-2">
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span className="text-sm font-medium drop-shadow-md">{ranch.rating}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-foreground mb-2">{ranch.name}</h3>
          <div className="flex items-center text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1 text-primary" />
            <span className="text-sm">{ranch.location}</span>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2">{ranch.description}</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="font-semibold text-foreground">{ranch.features.bedrooms}</div>
            <div className="text-xs text-muted-foreground">Quartos</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">{ranch.features.bathrooms}</div>
            <div className="text-xs text-muted-foreground">Banheiros</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">{ranch.features.area}</div>
            <div className="text-xs text-muted-foreground">Área</div>
          </div>
        </div>

        {/* Capacity and Amenities */}
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <Users className="h-4 w-4 mr-2 text-secondary" />
            <span className="text-sm text-muted-foreground">Até {ranch.capacity} pessoas</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {ranch.amenities.slice(0, 4).map((amenity, index) => (
              <div key={index} className="flex items-center bg-primary/10 px-2 py-1 rounded-md text-xs text-primary font-medium">
                {amenityIcons[amenity] || <Wifi className="h-3 w-3 mr-1" />}
                <span className="ml-1">{amenity}</span>
              </div>
            ))}
            {ranch.amenities.length > 4 && (
              <span className="text-xs text-muted-foreground">+{ranch.amenities.length - 4} mais</span>
            )}
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-primary">R$ {ranch.price.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">por dia</div>
            </div>
          </div>
          {ranch.slug && (
            <Link to={`/rancho/${ranch.slug}`} className="w-full">
              <Button 
                variant="water"
                className="w-full"
                disabled={!ranch.available}
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalhes
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RanchCard;
