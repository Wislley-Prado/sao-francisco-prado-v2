import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, ChevronLeft, ChevronRight, MapPin, Ruler, DollarSign } from 'lucide-react';
import { useAnuncios, Anuncio } from '@/hooks/useOptimizedData';
import useEmblaCarousel from 'embla-carousel-react';

interface AnunciosSectionProps {
  posicao: 'topo' | 'meio' | 'rodape' | 'sidebar';
}

// Track which ads have been viewed in this session to avoid duplicate view counts
const viewedAdsSession = new Set<string>();

export const AnunciosSection = ({ posicao }: AnunciosSectionProps) => {
  const { data: anunciosData, isLoading } = useAnuncios(posicao);
  const anuncios = anunciosData || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Embla Carousel para swipe no mobile
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    dragFree: false,
    containScroll: 'trimSnaps'
  });

  // Sincroniza o índice do Embla com o estado
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Auto-rotação com timing individual
  useEffect(() => {
    if (anuncios.length <= 1 || isPaused || !emblaApi) {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      return;
    }

    const currentAnuncio = anuncios[currentIndex];
    const duration = (currentAnuncio?.duracao_exibicao || 8) * 1000;

    intervalRef.current = setTimeout(() => {
      emblaApi.scrollNext();
    }, duration);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [anuncios.length, currentIndex, isPaused, emblaApi, anuncios]);

  // Register view when anuncio changes - DEBOUNCED to reduce API calls
  const registerView = useCallback(async (anuncio: Anuncio) => {
    // Skip if already viewed in this session
    if (viewedAdsSession.has(anuncio.id)) return;
    viewedAdsSession.add(anuncio.id);
    
    try {
      await supabase
        .from('anuncios')
        .update({ visualizacoes: (anuncio.visualizacoes || 0) + 1 })
        .eq('id', anuncio.id);
    } catch (error) {
      console.error('Erro ao registrar visualização:', error);
    }
  }, []);

  useEffect(() => {
    if (anuncios.length > 0 && !isLoading) {
      registerView(anuncios[currentIndex]);
    }
  }, [currentIndex, anuncios, isLoading, registerView]);
  // Registra clique sem abrir link (para uso com tag <a>)
  const registerClick = async (anuncio: Anuncio) => {
    try {
      await supabase
        .from('anuncios')
        .update({ cliques: anuncio.cliques + 1 })
        .eq('id', anuncio.id);
    } catch (error) {
      console.error('Erro ao registrar clique:', error);
    }
  };

  const handleNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handlePrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const goToSlide = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-6 container mx-auto px-4">
        <div className="relative rounded-xl overflow-hidden">
          <Skeleton className="w-full h-[320px] md:h-[400px]" />
        </div>
      </section>
    );
  }

  if (anuncios.length === 0) {
    return null;
  }

  const currentAnuncio = anuncios[currentIndex];
  const hasMultiple = anuncios.length > 1;

  // Tag discreta "Patrocinado" - menos intrusiva
  const renderAnuncioTag = (anuncio: Anuncio, position: 'top-right' | 'top-left' = 'top-right') => {
    if (!anuncio.link_url) return null;
    
    const positionClasses = position === 'top-right' 
      ? 'top-3 right-3' 
      : 'top-3 left-3';
    
    return (
      <a
        href={anuncio.link_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => registerClick(anuncio)}
        className={`absolute ${positionClasses} bg-black/40 backdrop-blur-sm text-white/80 px-2 py-0.5 rounded text-[10px] font-normal flex items-center gap-1 hover:bg-black/60 transition-colors z-20`}
      >
        <ExternalLink className="w-2.5 h-2.5" />
        Patrocinado
      </a>
    );
  };

  // Helper para renderizar informações de imóvel
  const renderImovelInfo = (anuncio: Anuncio, variant: 'overlay' | 'card' = 'card') => {
    const hasInfo = anuncio.imovel_area || anuncio.imovel_preco || anuncio.imovel_localizacao;
    if (!hasInfo) return null;

    if (variant === 'overlay') {
      return (
        <div className="flex flex-wrap gap-2 mb-4">
          {anuncio.imovel_preco && (
            <Badge className="bg-green-600 hover:bg-green-700 text-white">
              <DollarSign className="w-3 h-3 mr-1" />
              R$ {anuncio.imovel_preco.toLocaleString('pt-BR')}
            </Badge>
          )}
          {anuncio.imovel_area && (
            <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
              <Ruler className="w-3 h-3 mr-1" />
              {anuncio.imovel_area.toLocaleString('pt-BR')} {anuncio.imovel_unidade_area === 'm2' ? 'm²' : anuncio.imovel_unidade_area}
            </Badge>
          )}
          {anuncio.imovel_localizacao && (
            <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
              <MapPin className="w-3 h-3 mr-1" />
              {anuncio.imovel_localizacao}
            </Badge>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-2 mb-4 p-4 bg-muted/50 rounded-lg">
        {anuncio.imovel_area && (
          <div className="flex items-center gap-2 text-sm">
            <Ruler className="w-4 h-4 text-primary" />
            <span className="font-medium">
              {anuncio.imovel_area.toLocaleString('pt-BR')} {anuncio.imovel_unidade_area === 'm2' ? 'm²' : anuncio.imovel_unidade_area}
            </span>
          </div>
        )}
        {anuncio.imovel_preco && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="font-bold text-lg">
              R$ {anuncio.imovel_preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
        {anuncio.imovel_localizacao && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{anuncio.imovel_localizacao}</span>
          </div>
        )}
      </div>
    );
  };

  const renderAnuncio = (anuncio: Anuncio) => {
    // Banner Principal (Hero Style)
    if (anuncio.tipo === 'banner_principal') {
      return (
        <div className="relative h-full min-h-[320px] md:min-h-[420px] rounded-2xl overflow-hidden group shadow-xl">
          {/* Tag Anúncio clicável */}
          {renderAnuncioTag(anuncio)}
          
          <img
            src={anuncio.imagem_url}
            alt={anuncio.titulo}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Gradient overlay melhorado para legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
          
          {/* Container de conteúdo com melhor espaçamento */}
          <div className="absolute bottom-0 left-0 right-0 p-5 pb-14 md:p-10 lg:p-12">
            <div className="max-w-3xl space-y-3 md:space-y-4">
              {anuncio.subtitulo && (
                <span className="inline-block bg-amber-500/90 text-white font-semibold text-xs md:text-sm px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  {anuncio.subtitulo}
                </span>
              )}
              <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                {anuncio.titulo}
              </h2>
              {anuncio.descricao && (
                <p className="text-white/95 text-sm sm:text-base md:text-lg max-w-2xl line-clamp-2 leading-relaxed" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                  {anuncio.descricao}
                </p>
              )}
              {renderImovelInfo(anuncio, 'overlay')}
              {anuncio.link_url && (
                <a
                  href={anuncio.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => registerClick(anuncio)}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-12 md:h-14 px-6 md:px-8 rounded-xl text-sm md:text-base font-bold transition-all duration-300 touch-manipulation shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  {anuncio.texto_botao}
                  <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Card Secundário - Layout responsivo: coluna no mobile, lado a lado no desktop
    if (anuncio.tipo === 'card_secundario') {
      const hasImovelInfo = anuncio.imovel_area || anuncio.imovel_preco || anuncio.imovel_localizacao;
      
      return (
        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-xl rounded-2xl bg-card">
          {/* Layout: Coluna no mobile, Flex row no tablet+ */}
          <div className="flex flex-col md:flex-row">
            {/* Imagem - aspect ratio fixo em ambos */}
            <div className="relative w-full md:w-[45%] aspect-[16/9] md:aspect-[4/3] flex-shrink-0 overflow-hidden">
              {/* Tag Patrocinado na imagem */}
              {renderAnuncioTag(anuncio, 'top-left')}
              
              <img
                src={anuncio.imagem_url}
                alt={anuncio.titulo}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              
              {hasImovelInfo && (
                <div className="absolute bottom-3 left-3">
                  <Badge className="bg-green-600 hover:bg-green-700 text-xs font-semibold px-2.5 py-1 shadow-md">
                    Imóvel
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Conteúdo - ao lado da imagem no desktop */}
            <CardContent className="p-4 sm:p-5 md:p-6 flex flex-col justify-center flex-1 md:w-[55%]">
              {/* Header */}
              <div className="space-y-1.5 mb-3">
                {anuncio.subtitulo && (
                  <span className="inline-block w-fit bg-primary/10 text-primary font-semibold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                    {anuncio.subtitulo}
                  </span>
                )}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight line-clamp-2 text-foreground">
                  {anuncio.titulo}
                </h3>
              </div>
              
              {/* Descrição */}
              {anuncio.descricao && (
                <p className="text-muted-foreground text-sm md:text-base line-clamp-2 mb-3">
                  {anuncio.descricao}
                </p>
              )}
              
              {/* Informações de imóvel - compactas */}
              {hasImovelInfo && (
                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
                  {anuncio.imovel_preco && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-xs md:text-sm font-bold py-1 px-2.5 border border-green-200">
                      <DollarSign className="w-3 h-3 mr-1" />
                      R$ {anuncio.imovel_preco.toLocaleString('pt-BR')}
                    </Badge>
                  )}
                  {anuncio.imovel_area && (
                    <Badge variant="outline" className="text-xs md:text-sm py-1 px-2 bg-muted/50">
                      <Ruler className="w-3 h-3 mr-1" />
                      {anuncio.imovel_area.toLocaleString('pt-BR')} {anuncio.imovel_unidade_area === 'm2' ? 'm²' : anuncio.imovel_unidade_area}
                    </Badge>
                  )}
                  {anuncio.imovel_localizacao && (
                    <Badge variant="outline" className="text-xs md:text-sm py-1 px-2 bg-muted/50">
                      <MapPin className="w-3 h-3 mr-1" />
                      {anuncio.imovel_localizacao}
                    </Badge>
                  )}
                </div>
              )}
              
              {/* Botão - alinhado à esquerda no desktop */}
              {anuncio.link_url && (
                <a
                  href={anuncio.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => registerClick(anuncio)}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 md:h-11 px-5 md:px-6 rounded-lg text-sm font-bold transition-all duration-300 w-full md:w-fit touch-manipulation shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  {anuncio.texto_botao}
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </CardContent>
          </div>
        </Card>
      );
    }

    // Full Width
    if (anuncio.tipo === 'full_width') {
      return (
        <div className="relative h-full min-h-[320px] md:min-h-[420px] rounded-2xl overflow-hidden group shadow-xl">
          {/* Tag Anúncio clicável */}
          {renderAnuncioTag(anuncio)}
          
          <img
            src={anuncio.imagem_url}
            alt={anuncio.titulo}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Gradient overlay melhorado */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          
          {/* Container de conteúdo centralizado verticalmente */}
          <div className="absolute inset-0 flex items-center p-5 pb-14 md:p-10 lg:p-12">
            <div className="max-w-xl space-y-3 md:space-y-4">
              {anuncio.subtitulo && (
                <span className="inline-block bg-amber-500/90 text-white font-semibold text-xs md:text-sm px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  {anuncio.subtitulo}
                </span>
              )}
              <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-white leading-tight tracking-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                {anuncio.titulo}
              </h3>
              {anuncio.descricao && (
                <p className="text-white/95 text-sm sm:text-base md:text-lg line-clamp-2 leading-relaxed" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                  {anuncio.descricao}
                </p>
              )}
              {renderImovelInfo(anuncio, 'overlay')}
              {anuncio.link_url && (
                <a
                  href={anuncio.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => registerClick(anuncio)}
                  className="inline-flex items-center justify-center gap-2 bg-white text-foreground hover:bg-white/90 h-12 md:h-14 px-6 md:px-8 rounded-xl text-sm md:text-base font-bold transition-all duration-300 touch-manipulation shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  {anuncio.texto_botao}
                  <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Renderização baseada no tipo de anúncio
  return (
    <section 
      className="py-6 container mx-auto px-4"
      onMouseEnter={() => hasMultiple && setIsPaused(true)}
      onMouseLeave={() => hasMultiple && setIsPaused(false)}
    >
      {/* Container do carousel com swipe - centralizado */}
      <div className="relative group max-w-5xl mx-auto">
        <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
          <div className="flex">
            {anuncios.map((anuncio, index) => (
              <div key={anuncio.id} className="flex-[0_0_100%] min-w-0 flex justify-center">
                <div className="w-full max-w-4xl">
                  {renderAnuncio(anuncio)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controles de navegação (apenas se houver múltiplos anúncios) */}
        {hasMultiple && (
          <>
            {/* Botões Prev/Next - apenas no hover em desktop, escondidos no mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 hidden md:flex opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity z-10 bg-black/20 hover:bg-black/40 text-white h-10 w-10"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handlePrev();
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity z-10 bg-black/20 hover:bg-black/40 text-white h-10 w-10"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleNext();
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Indicadores de slide (pontos) - mais discretos */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {anuncios.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(index);
                  }}
                  className={`rounded-full transition-all ${
                    index === currentIndex 
                      ? 'w-4 h-1.5 bg-white/80' 
                      : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Ir para anúncio ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
