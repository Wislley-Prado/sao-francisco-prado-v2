import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, ChevronLeft, ChevronRight, MapPin, Ruler, DollarSign } from 'lucide-react';
import { useAnuncios, Anuncio } from '@/hooks/useOptimizedData';

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotation effect with individual timing
  useEffect(() => {
    if (anuncios.length <= 1 || isPaused) {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      return;
    }

    const currentAnuncio = anuncios[currentIndex];
    const duration = (currentAnuncio?.duracao_exibicao || 8) * 1000;

    // Auto advance to next slide
    intervalRef.current = setTimeout(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev + 1) % anuncios.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }, duration);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [anuncios.length, currentIndex, isPaused]);

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
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % anuncios.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, anuncios.length]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + anuncios.length) % anuncios.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, anuncios.length]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, currentIndex]);

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-8 container mx-auto px-4">
        <div className="relative rounded-xl overflow-hidden">
          <Skeleton className="w-full h-[300px] md:h-[400px]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 gap-4">
            <Skeleton className="h-6 w-32 bg-muted/30" />
            <Skeleton className="h-10 w-3/4 max-w-lg bg-muted/30" />
            <Skeleton className="h-4 w-1/2 max-w-md bg-muted/30" />
            <Skeleton className="h-10 w-36 rounded-md bg-muted/30 mt-4" />
          </div>
          {/* Indicadores de slide skeleton */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <Skeleton className="h-2 w-8 rounded-full bg-muted/30" />
            <Skeleton className="h-2 w-2 rounded-full bg-muted/30" />
            <Skeleton className="h-2 w-2 rounded-full bg-muted/30" />
          </div>
        </div>
      </section>
    );
  }

  if (anuncios.length === 0) {
    return null;
  }

  const currentAnuncio = anuncios[currentIndex];
  const hasMultiple = anuncios.length > 1;

  // Tag "Anúncio" clicável com link nativo
  const renderAnuncioTag = (anuncio: Anuncio, position: 'top-right' | 'top-left' = 'top-right') => {
    if (!anuncio.link_url) return null;
    
    const positionClasses = position === 'top-right' 
      ? 'top-4 right-4' 
      : 'top-4 left-4';
    
    return (
      <a
        href={anuncio.link_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => registerClick(anuncio)}
        className={`absolute ${positionClasses} bg-amber-500 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 hover:bg-amber-600 transition-colors z-20 shadow-lg touch-manipulation`}
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Anúncio
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
        <div className="relative h-full min-h-[300px] md:min-h-[400px] rounded-xl overflow-hidden group">
          {/* Tag Anúncio clicável */}
          {renderAnuncioTag(anuncio)}
          
          <img
            src={anuncio.imagem_url}
            alt={anuncio.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-left">
            <div className="max-w-3xl">
              {anuncio.subtitulo && (
                <p className="text-amber-400 font-medium text-sm md:text-base mb-2 uppercase tracking-wide">{anuncio.subtitulo}</p>
              )}
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight drop-shadow-lg">
                {anuncio.titulo}
              </h2>
              {anuncio.descricao && (
                <p className="text-white/90 text-base md:text-lg mb-4 md:mb-6 max-w-2xl line-clamp-2 drop-shadow-md">
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
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 md:h-12 px-6 md:px-8 rounded-lg text-sm md:text-base font-semibold transition-colors touch-manipulation shadow-lg"
                >
                  {anuncio.texto_botao}
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Card Secundário
    if (anuncio.tipo === 'card_secundario') {
      const hasImovelInfo = anuncio.imovel_area || anuncio.imovel_preco || anuncio.imovel_localizacao;
      
      return (
        <Card className="h-full min-h-[300px] md:min-h-[400px] overflow-hidden hover:shadow-xl transition-shadow border-0 shadow-lg">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-0 h-full">
            {/* Imagem - ocupa mais espaço no mobile */}
            <div className="relative h-[160px] md:h-full flex-shrink-0">
              {/* Tag Anúncio clicável na imagem */}
              {renderAnuncioTag(anuncio, 'top-left')}
              
              <img
                src={anuncio.imagem_url}
                alt={anuncio.titulo}
                className="w-full h-full object-cover"
              />
              {hasImovelInfo && (
                <div className="absolute bottom-3 left-3">
                  <Badge className="bg-green-600 hover:bg-green-700 text-sm font-medium">
                    Imóvel
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Conteúdo - melhor organizado */}
            <CardContent className="p-5 md:p-8 flex flex-col justify-center flex-1">
              {anuncio.subtitulo && (
                <p className="text-primary font-semibold mb-1 text-sm uppercase tracking-wide">{anuncio.subtitulo}</p>
              )}
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 leading-tight line-clamp-2">{anuncio.titulo}</h3>
              {anuncio.descricao && (
                <p className="text-muted-foreground mb-4 text-sm md:text-base line-clamp-2">{anuncio.descricao}</p>
              )}
              
              {/* Informações de imóvel - compacto e elegante */}
              {hasImovelInfo && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {anuncio.imovel_preco && (
                    <Badge variant="secondary" className="text-base md:text-lg font-bold py-1.5 px-3">
                      <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                      R$ {anuncio.imovel_preco.toLocaleString('pt-BR')}
                    </Badge>
                  )}
                  {anuncio.imovel_area && (
                    <Badge variant="outline" className="text-sm py-1.5 px-3">
                      <Ruler className="w-3 h-3 mr-1" />
                      {anuncio.imovel_area.toLocaleString('pt-BR')} {anuncio.imovel_unidade_area === 'm2' ? 'm²' : anuncio.imovel_unidade_area}
                    </Badge>
                  )}
                  {anuncio.imovel_localizacao && (
                    <Badge variant="outline" className="text-sm py-1.5 px-3">
                      <MapPin className="w-3 h-3 mr-1" />
                      {anuncio.imovel_localizacao}
                    </Badge>
                  )}
                </div>
              )}
              
              {anuncio.link_url && (
                <a
                  href={anuncio.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => registerClick(anuncio)}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 md:h-11 px-5 rounded-lg text-sm font-semibold transition-colors w-fit touch-manipulation"
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
        <div className="relative h-full min-h-[300px] md:min-h-[400px] rounded-xl overflow-hidden group">
          {/* Tag Anúncio clicável */}
          {renderAnuncioTag(anuncio)}
          
          <img
            src={anuncio.imagem_url}
            alt={anuncio.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center p-6 md:p-12">
            <div className="max-w-xl">
              {anuncio.subtitulo && (
                <p className="text-amber-400 font-medium text-sm md:text-base mb-2 uppercase tracking-wide">{anuncio.subtitulo}</p>
              )}
              <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight drop-shadow-lg">{anuncio.titulo}</h3>
              {anuncio.descricao && (
                <p className="text-white/90 text-sm md:text-base mb-4 line-clamp-2 drop-shadow-md">{anuncio.descricao}</p>
              )}
              {renderImovelInfo(anuncio, 'overlay')}
              {anuncio.link_url && (
                <a
                  href={anuncio.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => registerClick(anuncio)}
                  className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 md:h-11 px-5 rounded-lg text-sm font-semibold transition-colors touch-manipulation"
                >
                  {anuncio.texto_botao}
                  <ExternalLink className="w-4 h-4" />
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
      className="py-8 container mx-auto px-4"
      onMouseEnter={() => hasMultiple && setIsPaused(true)}
      onMouseLeave={() => hasMultiple && setIsPaused(false)}
    >
      {/* Container com altura fixa para evitar layout shift */}
      <div className="relative min-h-[300px] md:min-h-[400px] group">
        {/* Anúncio atual com animação de fade - posição absoluta */}
        <div 
          className={`absolute inset-0 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        >
          {renderAnuncio(currentAnuncio)}
        </div>

        {/* Controles de navegação (apenas se houver múltiplos anúncios) */}
        {hasMultiple && (
          <>
            {/* Botões Prev/Next - visíveis em mobile, hover em desktop */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 hover:bg-background/90 touch-manipulation min-h-[44px] min-w-[44px]"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handlePrev();
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 hover:bg-background/90 touch-manipulation min-h-[44px] min-w-[44px]"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleNext();
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Indicadores de slide (pontos) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {anuncios.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(index);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'w-6 bg-primary' 
                      : 'w-2 bg-white/50 hover:bg-white/80'
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
