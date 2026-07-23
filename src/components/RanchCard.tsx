
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Wifi, Car, Waves, Utensils, Star, Eye } from 'lucide-react';
import { getOptimizedUrl, getOriginalUrl } from '@/lib/imageUtils';
import { useTranslation } from 'react-i18next';

interface Ranch {
  id: string | number;
  name: string;
  name_en?: string | null;
  slug?: string;
  description: string;
  description_en?: string | null;
  location: string;
  location_en?: string | null;
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
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const name = (isEn && ranch?.name_en) ? ranch.name_en : ranch?.name || 'Rancho';
  const location = (isEn && ranch?.location_en) ? ranch.location_en : ranch?.location || '';
  const description = (isEn && ranch?.description_en) ? ranch.description_en : ranch?.description || '';

  const images = Array.isArray(ranch?.images) ? ranch.images : [];
  const amenities = Array.isArray(ranch?.amenities) ? ranch.amenities : [];
  const price = typeof ranch?.price === 'number' && !isNaN(ranch.price) ? ranch.price : Number(ranch?.price || 0);
  const rating = ranch?.rating ?? 5;
  const bedrooms = ranch?.features?.bedrooms ?? 0;
  const bathrooms = ranch?.features?.bathrooms ?? 0;
  const area = ranch?.features?.area ?? '0m²';

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
          {images.length > 0 ? (
            <img 
              src={getOptimizedUrl(images[0], 500, 70)} 
              alt={name}
              loading="lazy"
              decoding="async"
              width={400}
              height={192}
              className="h-48 w-full object-cover"
              onError={(e) => {
                const original = getOriginalUrl(images[0]);
                if (e.currentTarget.src !== original) {
                  e.currentTarget.src = original;
                }
              }}
            />
          ) : (
            <div className="h-48 bg-gradient-to-br from-rio-blue to-water-green" />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
            {ranch?.available ? (
              <Badge className="bg-green-500 hover:bg-green-600 text-white shadow-md">{t('labels.available')}</Badge>
            ) : (
              <Badge className="bg-red-500 hover:bg-red-600 text-white shadow-md">{t('labels.occupied')}</Badge>
            )}
            
            {/* Etiquetas de Localização Aquática */}
            {location.toLowerCase().includes('represa') && (
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">{t('labels.represa')}</Badge>
            )}
            {location.toLowerCase().includes('rio') && (
              <Badge className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-md">{t('labels.rio')}</Badge>
            )}
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center space-x-1 mb-2">
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{location}</span>
          </div>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="font-semibold text-gray-900">{bedrooms}</div>
            <div className="text-xs text-gray-600">{t('labels.bedrooms')}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">{bathrooms}</div>
            <div className="text-xs text-gray-600">{t('labels.bathrooms')}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">{area}</div>
            <div className="text-xs text-gray-600">{t('labels.area')}</div>
          </div>
        </div>

        {/* Capacity and Amenities */}
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <Users className="h-4 w-4 mr-2 text-water-green" />
            <span className="text-sm text-gray-600">{t('labels.capacity', { count: ranch?.capacity || 0 })}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {amenities.slice(0, 4).map((amenity, index) => (
              <div key={index} className="flex items-center bg-blue-50 px-2 py-1 rounded text-xs text-rio-blue">
                {amenityIcons[amenity] || <Wifi className="h-3 w-3 mr-1" />}
                <span className="ml-1">{t(`amenities.${amenity}`, amenity)}</span>
              </div>
            ))}
            {amenities.length > 4 && (
              <span className="text-xs text-gray-500">{t('labels.more', { count: amenities.length - 4 })}</span>
            )}
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-rio-blue">R$ {price.toFixed(2)}</div>
              <div className="text-xs text-gray-500">{t('labels.pricePerPerson')}</div>
            </div>
          </div>
          {ranch?.slug && (
            <Link to={`/rancho/${ranch.slug}`} className="w-full">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white"
                disabled={!ranch?.available}
              >
                <Eye className="mr-2 h-4 w-4" />
                {t('buttons.seeDetails')}
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RanchCard;
