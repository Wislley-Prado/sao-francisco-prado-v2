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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { ImageGallery } from '@/components/ImageGallery';
import { toast } from 'sonner';

interface PropriedadeCardProps {
  propriedade: PropriedadeVenda;
}

const PropriedadeCard = ({ propriedade }: PropriedadeCardProps) => {
  const { data: siteSettings } = useSiteSettings();
  const [modalOpen, setModalOpen] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const propParam = params.get('propriedade');
    if (propParam && propParam === propriedade.slug) {
      setModalOpen(true);
    }
  }, [propriedade.slug]);

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
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between h-full bg-white border border-gray-100">
        <CardHeader className="p-0">
          <div className="relative">
            {propriedade.imagens && propriedade.imagens.length > 0 ? (
              <img 
                src={getOptimizedUrl(propriedade.imagens[0], 800)} 
                alt={propriedade.titulo}
                loading="lazy"
                decoding="async"
                width={400}
                height={225}
                className="aspect-video w-full object-cover cursor-pointer"
                onClick={() => setModalOpen(true)}
                onError={(e) => {
                  const original = getOriginalUrl(propriedade.imagens[0]);
                  if (e.currentTarget.src !== original) {
                    e.currentTarget.src = original;
                  }
                }}
              />
            ) : (
              <div 
                className="aspect-video bg-gradient-to-br from-rio-blue to-water-green cursor-pointer" 
                onClick={() => setModalOpen(true)}
              />
            )}
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
            <h3 
              className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 cursor-pointer hover:text-rio-blue transition-colors"
              onClick={() => setModalOpen(true)}
            >
              {propriedade.titulo}
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
                <Button 
                  variant="outline" 
                  onClick={() => setModalOpen(true)}
                  className="w-full border-rio-blue text-rio-blue hover:bg-blue-50/50 flex items-center justify-center gap-1 px-1 text-xs font-semibold transition-all"
                  title="Ver Detalhes"
                >
                  <Info className="h-3.5 w-3.5" />
                  Detalhes
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/vendas?propriedade=${propriedade.slug}`;
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

      {/* Modal de Detalhes da Propriedade */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-0 shadow-2xl bg-white">
          <div className="flex flex-col">
            {/* Header decorativo com imagem de capa/título */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.08),transparent_50%)]"></div>
              <div className="relative flex justify-between items-start gap-4">
                <div>
                  <Badge className="bg-sunset-orange hover:bg-sunset-orange/95 text-white mb-2 uppercase text-xs font-semibold">
                    {propriedade.tipo || 'Oportunidade'}
                  </Badge>
                  <DialogTitle className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {propriedade.titulo}
                  </DialogTitle>
                  <div className="flex items-center text-gray-300 text-sm">
                    <MapPin className="h-4 w-4 mr-1 shrink-0 text-emerald-400" />
                    <span>{propriedade.localizacao}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-gray-400 font-medium">Valor de Venda</div>
                  <div className="text-2xl md:text-3xl font-extrabold text-emerald-400">
                    R$ {propriedade.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-8">
              {/* Galeria de Imagens */}
              {galleryImages.length > 0 ? (
                <div>
                  <ImageGallery images={galleryImages} title={propriedade.titulo} />
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                  Sem imagens cadastradas
                </div>
              )}

              {/* Grid Principal: Descrição e Características */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Coluna 1 e 2: Descrição e Informações Físicas */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2 flex items-center gap-2">
                      Descrição da Propriedade
                    </h4>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                      {propriedade.descricao || 'Excelente oportunidade para investimento ou lazer na região do Rio São Francisco.'}
                    </p>
                  </div>

                  {propriedade.area && (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                        <Maximize className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Área Total</div>
                        <div className="text-lg font-bold text-gray-800">
                          {propriedade.area} {propriedade.unidade_area || 'hectares'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Coluna 3: Características / Tags e Botão de Contato */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">
                      Características
                    </h4>
                    {propriedade.caracteristicas && propriedade.caracteristicas.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {propriedade.caracteristicas.map((char, index) => (
                          <div key={index} className="flex items-center gap-2 bg-blue-50/50 border border-blue-100/30 px-3 py-2.5 rounded-xl text-sm font-medium text-rio-blue">
                            <span className="text-rio-blue shrink-0">
                              {getCharIcon(char)}
                            </span>
                            <span className="capitalize">{char}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Nenhuma característica cadastrada.</p>
                    )}
                  </div>

                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 text-center space-y-4">
                    <div>
                      <h5 className="font-bold text-emerald-950 text-base">Gostou deste imóvel?</h5>
                      <p className="text-xs text-emerald-800 mt-1">Entre em contato agora mesmo para agendar uma visita ou negociar.</p>
                    </div>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/10 py-5 text-base font-semibold transition-all">
                        <MessageSquare className="mr-2 h-5 w-5 fill-white" />
                        {propriedade.texto_botao_whatsapp || 'Falar no WhatsApp'}
                      </Button>
                    </a>

                    <div className="border-t border-emerald-100 pt-4 mt-4 text-left">
                      <h6 className="text-xs font-bold text-emerald-900 mb-2 uppercase tracking-wider">Compartilhar anúncio:</h6>
                      <div className="flex gap-2">
                        <Input
                          readOnly
                          value={`${window.location.origin}/vendas?propriedade=${propriedade.slug}`}
                          className="bg-white/80 text-xs border-emerald-200 h-9"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-emerald-200 hover:bg-emerald-100/50 text-emerald-800 h-9 shrink-0"
                          onClick={() => {
                            const shareUrl = `${window.location.origin}/vendas?propriedade=${propriedade.slug}`;
                            navigator.clipboard.writeText(shareUrl);
                            toast.success('Link copiado!');
                          }}
                          title="Copiar Link"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Olha esse imóvel no PradoAqui: *${propriedade.titulo}* em ${propriedade.localizacao}. Veja os detalhes: ${window.location.origin}/vendas?propriedade=${propriedade.slug}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0"
                          title="Compartilhar no WhatsApp"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-200 hover:bg-green-100/50 text-green-800 h-9"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção de Vídeo e Localização no Mapa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-150">
                {/* Vídeo se disponível */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-md">
                      <Play className="h-5 w-5 text-white fill-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">Vídeo de Apresentação</h4>
                      <p className="text-xs text-gray-500">Conheça os detalhes do local</p>
                    </div>
                  </div>
                  
                  {propriedade.video_youtube && getYouTubeEmbedUrl(propriedade.video_youtube) ? (
                    <div className="w-full bg-black rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                      {(() => {
                        const isShorts = propriedade.video_youtube.includes('shorts');
                        const embedUrl = getYouTubeEmbedUrl(propriedade.video_youtube);
                        if (isShorts) {
                          return (
                            <div className="relative w-full max-w-[220px] mx-auto" style={{ paddingBottom: '177.78%' /* 9:16 vertical */ }}>
                              <iframe
                                src={embedUrl || ''}
                                className="absolute top-0 left-0 w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                title={`Vídeo ${propriedade.titulo}`}
                              />
                            </div>
                          );
                        } else {
                          return (
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 horizontal */ }}>
                              <iframe
                                src={embedUrl || ''}
                                className="absolute top-0 left-0 w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                title={`Vídeo ${propriedade.titulo}`}
                              />
                            </div>
                          );
                        }
                      })()}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-dashed border-gray-200 min-h-[200px]">
                      <Play className="h-10 w-10 text-gray-300 mb-3" />
                      <h5 className="font-semibold text-gray-600 mb-1">Vídeo Indisponível</h5>
                      <p className="text-xs text-gray-400 max-w-[240px]">Nenhum vídeo de tour ou Shorts foi cadastrado pelo administrador para este imóvel.</p>
                    </div>
                  )}
                </div>

                {/* Mapa se disponível */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 font-sans">Mapa de Localização</h4>
                        <p className="text-xs text-gray-500">Veja no Google Maps</p>
                      </div>
                      {propriedade.latitude && propriedade.longitude && (
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2.5 border-blue-200 text-blue-600 hover:bg-blue-50 text-xs"
                            onClick={() => {
                              const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${propriedade.latitude},${propriedade.longitude}`;
                              window.open(mapsUrl, '_blank');
                            }}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Rotas
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2.5 border-blue-200 text-blue-600 hover:bg-blue-50 text-xs"
                            onClick={() => {
                              navigator.clipboard.writeText(`${propriedade.latitude}, ${propriedade.longitude}`);
                              toast.success('Coordenadas copiadas!');
                            }}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copiar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {propriedade.latitude && propriedade.longitude ? (
                    <div className="relative w-full h-[250px] rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50">
                      <iframe
                        src={`https://www.google.com/maps?q=${propriedade.latitude},${propriedade.longitude}&hl=pt-BR&z=14&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Mapa - ${propriedade.titulo}`}
                        className="absolute inset-0"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-dashed border-gray-200 min-h-[200px]">
                      <MapPin className="h-10 w-10 text-gray-300 mb-3" />
                      <h5 className="font-semibold text-gray-600 mb-1">Mapa Indisponível</h5>
                      <p className="text-xs text-gray-400 max-w-[240px]">As coordenadas geográficas exatas (latitude/longitude) não foram informadas.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropriedadeCard;
