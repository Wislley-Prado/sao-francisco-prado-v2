import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, Maximize, MessageSquare, Waves, Zap, 
  Droplets, Compass, Info, Play, Navigation, 
  ExternalLink, Copy, CheckCircle 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getOptimizedUrl, getOriginalUrl } from '@/lib/imageUtils';
import { useSiteSettings, PropriedadeVenda } from '@/hooks/useOptimizedData';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface PropriedadeCardProps {
  propriedade: PropriedadeVenda;
}

const PropriedadeCard = ({ propriedade }: PropriedadeCardProps) => {
  const { data: siteSettings } = useSiteSettings();

  const defaultNumber = siteSettings?.whatsapp_numero || "5538988320108";
  const rawPhone = propriedade.whatsapp_contato || propriedade.telefone_contato || defaultNumber;
  // Clean phone number to contain only digits
  const phone = rawPhone.replace(/\D/g, '');

  const message = React.useMemo(() => {
    if (propriedade.mensagem_whatsapp) {
      return propriedade.mensagem_whatsapp
        .replace(/{titulo}/g, propriedade.titulo)
        .replace(/{localizacao}/g, propriedade.localizacao);
    }
    return `Olá! Vi o anúncio da propriedade "${propriedade.titulo}" em "${propriedade.localizacao}" no site PradoAqui e gostaria de saber mais informações.`;
  }, [propriedade.mensagem_whatsapp, propriedade.titulo, propriedade.localizacao]);

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

  const galleryImages = React.useMemo(() => {
    if (!propriedade.imagens || propriedade.imagens.length === 0) return [];
    return propriedade.imagens.map((imgUrl, idx) => ({
      url: imgUrl,
      alt_text: `${propriedade.titulo} - Imagem ${idx + 1}`,
      principal: idx === 0
    }));
  }, [propriedade.imagens, propriedade.titulo]);

  const getYouTubeEmbedUrl = (url: string | null) => {
    if (!url) return null;
    const shortsMatch = url.match(/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }
    const videoMatch = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:[&?]|$)/);
    if (videoMatch) {
      return `https://www.youtube.com/embed/${videoMatch[1]}`;
    }
    return null;
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between h-full bg-white border border-gray-100">
      <CardHeader className="p-0">
        <div className="relative">
          <Link to={`/venda/${propriedade.slug}`} className="block overflow-hidden">
            {propriedade.imagens && propriedade.imagens.length > 0 ? (
              <img 
                src={getOptimizedUrl(propriedade.imagens[0], 800)} 
                alt={propriedade.titulo}
                loading="lazy"
                decoding="async"
                width={400}
                height={225}
                className="aspect-video w-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  const original = getOriginalUrl(propriedade.imagens[0]);
                  if (e.currentTarget.src !== original) {
                    e.currentTarget.src = original;
                  }
                }}
              />
            ) : (
              <div className="aspect-video bg-gradient-to-br from-rio-blue to-water-green" />
            )}
          </Link>
          <div className="absolute inset-0 bg-black bg-opacity-20 pointer-events-none"></div>
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

      <CardContent className="p-6 flex flex-col flex-grow justify-between">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 hover:text-rio-blue transition-colors">
            <Link to={`/venda/${propriedade.slug}`}>
              {propriedade.titulo}
            </Link>
          </h3>
          
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1 shrink-0 text-emerald-500" />
            <span className="text-sm line-clamp-1">{propriedade.localizacao}</span>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {propriedade.descricao || 'Excelente oportunidade para investimento ou lazer na região do Rio São Francisco.'}
          </p>
        </div>

        <div>
          {/* Area and physical properties */}
          {propriedade.area && (
            <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100/50">
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
                <div key={index} className="flex items-center bg-blue-50/60 px-2 py-1 rounded-md text-xs font-medium text-rio-blue border border-blue-100/30">
                  {getCharIcon(char)}
                  <span className="ml-1">{char}</span>
                </div>
              ))}
              {propriedade.caracteristicas.length > 3 && (
                <span className="text-xs text-gray-500 font-medium">+{propriedade.caracteristicas.length - 3} mais</span>
              )}
            </div>
          )}

          {/* Price and Action */}
          <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-500">Valor de Venda</div>
                <div className="text-xl font-bold text-rio-blue whitespace-nowrap">
                  R$ {propriedade.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <Badge variant="outline" className="border-rio-blue text-rio-blue text-xs font-semibold">
                À Venda
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-1.5 w-full">
              <Link to={`/venda/${propriedade.slug}`} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full border-rio-blue text-rio-blue hover:bg-blue-50/50 flex items-center justify-center gap-1 px-1 text-xs font-semibold transition-all h-full"
                  title="Ver Detalhes"
                >
                  <Info className="h-3.5 w-3.5" />
                  Detalhes
                </Button>
              </Link>
              <Button 
                variant="outline"
                onClick={() => {
                  const shareUrl = `${window.location.origin}/venda/${propriedade.slug}`;
                  navigator.clipboard.writeText(shareUrl);
                  toast.success('Link copiado!');
                }}
                className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1 px-1 text-xs font-semibold transition-all"
                title="Copiar Link de Compartilhamento"
              >
                <Copy className="h-3.5 w-3.5" />
                Copiar
              </Button>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-1 px-1 text-xs font-semibold transition-all shadow-sm">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {propriedade.texto_botao_whatsapp || 'WhatsApp'}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropriedadeCard;
