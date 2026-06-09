import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Maximize, MessageSquare, Waves, Zap, Droplets, Compass } from 'lucide-react';
import { getOptimizedUrl, getOriginalUrl } from '@/lib/imageUtils';
import { useSiteSettings, PropriedadeVenda } from '@/hooks/useOptimizedData';

interface PropriedadeCardProps {
  propriedade: PropriedadeVenda;
}

const PropriedadeCard = ({ propriedade }: PropriedadeCardProps) => {
  const { data: siteSettings } = useSiteSettings();

  const defaultNumber = siteSettings?.whatsapp_numero || "5538988320108";
  const rawPhone = propriedade.whatsapp_contato || propriedade.telefone_contato || defaultNumber;
  // Clean phone number to contain only digits
  const phone = rawPhone.replace(/\D/g, '');

  const message = `Olá! Vi o anúncio da propriedade "${propriedade.titulo}" em "${propriedade.localizacao}" no site PradoAqui e gostaria de saber mais informações.`;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  // Mapping common characteristics to icons
  const charIcons: { [key: string]: React.ReactNode } = {
    'água': <Droplets className="h-4 w-4" />,
    'agua': <Droplets className="h-4 w-4" />,
    'luz': <Zap className="h-4 w-4" />,
    'energia': <Zap className="h-4 w-4" />,
    'rio': <Waves className="h-4 w-4" />,
    'represa': <Waves className="h-4 w-4" />,
    'acesso': <Compass className="h-4 w-4" />,
  };

  const getCharIcon = (char: string) => {
    const lower = char.toLowerCase();
    for (const key in charIcons) {
      if (lower.includes(key)) {
        return charIcons[key];
      }
    }
    return <Compass className="h-4 w-4" />;
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative">
          {propriedade.imagens && propriedade.imagens.length > 0 ? (
            <img 
              src={getOptimizedUrl(propriedade.imagens[0], 800)} 
              alt={propriedade.titulo}
              loading="lazy"
              decoding="async"
              width={400}
              height={192}
              className="h-48 w-full object-cover"
              onError={(e) => {
                const original = getOriginalUrl(propriedade.imagens[0]);
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
            <Badge className="bg-sunset-orange hover:bg-sunset-orange/95 text-white shadow-md uppercase text-xs font-semibold">
              {propriedade.tipo || 'Oportunidade'}
            </Badge>
            
            {/* Localização Badge */}
            {propriedade.localizacao?.toLowerCase().includes('represa') && (
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">Represa</Badge>
            )}
            {propriedade.localizacao?.toLowerCase().includes('rio') && (
              <Badge className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-md">Rio</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 flex flex-col h-[280px] justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{propriedade.titulo}</h3>
          
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1 shrink-0" />
            <span className="text-sm line-clamp-1">{propriedade.localizacao}</span>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {propriedade.descricao || 'Excelente oportunidade para investimento ou lazer na região do Rio São Francisco.'}
          </p>
        </div>

        <div>
          {/* Area and physical properties */}
          {propriedade.area && (
            <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
              <Maximize className="h-4 w-4 mr-2 text-water-green" />
              <span className="text-sm font-semibold text-gray-700">
                Área Total: {propriedade.area} {propriedade.unidade_area || 'hectares'}
              </span>
            </div>
          )}

          {/* Characteristics/Amenities tags */}
          {propriedade.caracteristicas && propriedade.caracteristicas.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {propriedade.caracteristicas.slice(0, 3).map((char, index) => (
                <div key={index} className="flex items-center bg-blue-50 px-2 py-1 rounded text-xs text-rio-blue">
                  {getCharIcon(char)}
                  <span className="ml-1">{char}</span>
                </div>
              ))}
              {propriedade.caracteristicas.length > 3 && (
                <span className="text-xs text-gray-500">+{propriedade.caracteristicas.length - 3} mais</span>
              )}
            </div>
          )}

          {/* Price and Action */}
          <div className="flex justify-between items-center gap-4 pt-2 border-t border-gray-100">
            <div>
              <div className="text-xs text-gray-500">Valor de Venda</div>
              <div className="text-xl font-bold text-rio-blue whitespace-nowrap">
                R$ {propriedade.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-grow">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <MessageSquare className="mr-2 h-4 w-4" />
                Saber Mais
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropriedadeCard;
