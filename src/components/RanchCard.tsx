
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Wifi, Car, Waves, Utensils, Star, Eye, Camera, Video, Award, Snowflake, Coffee, Anchor, Tv } from 'lucide-react';

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
  destaque?: boolean;
  totalAvaliacoes?: number;
  hasVideo?: boolean;
}

interface RanchCardProps {
  ranch: Ranch;
}

const RanchCard = ({ ranch }: RanchCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Detectar tipo de localização para exibir tag
  const getLocationType = (location: string) => {
    const loc = location.toLowerCase();
    if (loc.includes('represa') || loc.includes('três marias')) {
      return { label: 'Represa', className: 'bg-blue-500 text-white' };
    }
    if (loc.includes('rio') || loc.includes('são francisco')) {
      return { label: 'Rio', className: 'bg-emerald-500 text-white' };
    }
    return null;
  };

  const locationType = getLocationType(ranch.location);

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'Wi-Fi': <Wifi className="h-3.5 w-3.5" />,
    'WiFi': <Wifi className="h-3.5 w-3.5" />,
    'Internet': <Wifi className="h-3.5 w-3.5" />,
    'Estacionamento': <Car className="h-3.5 w-3.5" />,
    'Garagem': <Car className="h-3.5 w-3.5" />,
    'Piscina': <Waves className="h-3.5 w-3.5" />,
    'Churrasqueira': <Utensils className="h-3.5 w-3.5" />,
    'Churrasco': <Utensils className="h-3.5 w-3.5" />,
    'Deck de Pesca': <Anchor className="h-3.5 w-3.5" />,
    'Deck': <Anchor className="h-3.5 w-3.5" />,
    'Ar Condicionado': <Snowflake className="h-3.5 w-3.5" />,
    'Ar-condicionado': <Snowflake className="h-3.5 w-3.5" />,
    'Cozinha': <Coffee className="h-3.5 w-3.5" />,
    'Cozinha Completa': <Coffee className="h-3.5 w-3.5" />,
    'TV': <Tv className="h-3.5 w-3.5" />,
    'Smart TV': <Tv className="h-3.5 w-3.5" />,
  };

  const getAmenityIcon = (amenity: string) => {
    // Procurar correspondência parcial
    for (const [key, icon] of Object.entries(amenityIcons)) {
      if (amenity.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return <Wifi className="h-3.5 w-3.5" />;
  };

  const totalImages = ranch.images?.length || 0;
  const hasMultipleImages = totalImages > 1;

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          {/* Image with hover effect */}
          {ranch.images && ranch.images.length > 0 ? (
            <div className="relative h-52">
              <img 
                src={isHovered && hasMultipleImages ? ranch.images[1] : ranch.images[0]} 
                alt={ranch.name}
                className="h-full w-full object-cover transition-all duration-500"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          ) : (
            <div className="h-52 bg-gradient-to-br from-rio-blue to-water-green" />
          )}
          
          {/* Top Left Badges - Destaque + Localização */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {ranch.destaque && (
              <Badge className="bg-amber-500 text-white border-0 shadow-lg">
                <Award className="h-3 w-3 mr-1" />
                Destaque
              </Badge>
            )}
            {locationType && (
              <Badge className={`${locationType.className} border-0 shadow-md`}>
                {locationType.label}
              </Badge>
            )}
          </div>

          {/* Top Right Badges - Disponibilidade + Vídeo */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
            {ranch.available ? (
              <Badge className="bg-green-500 text-white border-0 shadow-md">Disponível</Badge>
            ) : (
              <Badge className="bg-red-500 text-white border-0 shadow-md">Ocupado</Badge>
            )}
            {ranch.hasVideo && (
              <Badge className="bg-red-600 text-white border-0 shadow-md">
                <Video className="h-3 w-3 mr-1" />
                Tour
              </Badge>
            )}
          </div>

          {/* Photo Counter */}
          {totalImages > 0 && (
            <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm">
              <Camera className="h-3.5 w-3.5" />
              <span>{totalImages} {totalImages === 1 ? 'foto' : 'fotos'}</span>
            </div>
          )}

          {/* Rating + Reviews */}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-current text-yellow-400" />
            <span>{ranch.rating.toFixed(1)}</span>
            {ranch.totalAvaliacoes !== undefined && ranch.totalAvaliacoes > 0 && (
              <span className="text-white/70">({ranch.totalAvaliacoes})</span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-foreground mb-1.5 line-clamp-1">{ranch.name}</h3>
          <div className="flex items-center text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{ranch.location}</span>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2">{ranch.description}</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="font-semibold text-foreground">{ranch.features.bedrooms}</div>
            <div className="text-xs text-muted-foreground">Quartos</div>
          </div>
          <div className="text-center border-x border-border">
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
            <Users className="h-4 w-4 mr-2 text-water-green" />
            <span className="text-sm text-muted-foreground">Até {ranch.capacity} pessoas</span>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {ranch.amenities.slice(0, 4).map((amenity, index) => (
              <div 
                key={index} 
                className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium"
              >
                {getAmenityIcon(amenity)}
                <span className="ml-1">{amenity}</span>
              </div>
            ))}
            {ranch.amenities.length > 4 && (
              <span className="text-xs text-muted-foreground self-center ml-1">
                +{ranch.amenities.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex flex-col gap-3 pt-3 border-t border-border">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs text-muted-foreground">A partir de</div>
              <div className="text-2xl font-bold text-primary">
                R$ {ranch.price.toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground">/dia</span>
              </div>
            </div>
          </div>
          {ranch.slug && (
            <Link to={`/rancho/${ranch.slug}`} className="w-full">
              <Button 
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
