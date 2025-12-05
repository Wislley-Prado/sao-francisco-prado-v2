import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ChevronLeft, ChevronRight, Pause, Play, MapPin, Ruler, DollarSign } from 'lucide-react';

interface Anuncio {
  id: string;
  titulo: string;
  subtitulo: string | null;
  descricao: string | null;
  imagem_url: string;
  link_url: string | null;
  texto_botao: string;
  tipo: string;
  posicao: string;
  cliques: number;
  visualizacoes: number;
  duracao_exibicao: number;
  // Campos de imóveis
  imovel_area: number | null;
  imovel_unidade_area: string | null;
  imovel_preco: number | null;
  imovel_localizacao: string | null;
}

interface AnunciosSectionProps {
  posicao: 'topo' | 'meio' | 'rodape' | 'sidebar';
}

export const AnunciosSection = ({ posicao }: AnunciosSectionProps) => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchAnuncios();
  }, [posicao]);

  // Auto-rotation effect with individual timing
  useEffect(() => {
    if (anuncios.length <= 1 || isPaused) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      return;
    }

    const currentAnuncio = anuncios[currentIndex];
    const duration = (currentAnuncio?.duracao_exibicao || 8) * 1000;
    
    // Reset progress
    setProgress(0);

    // Progress animation (update every 100ms)
    const progressStep = 100 / (duration / 100);
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + progressStep;
      });
    }, 100);

    // Auto advance to next slide
    intervalRef.current = setTimeout(() => {
      handleNext();
    }, duration);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [anuncios.length, currentIndex, isPaused]);

  // Register view when anuncio changes
  useEffect(() => {
    if (anuncios.length > 0 && !loading) {
      registerView(anuncios[currentIndex]);
    }
  }, [currentIndex, anuncios, loading]);

  const fetchAnuncios = async () => {
    try {
      const { data, error } = await supabase
        .from('anuncios')
        .select('*')
        .eq('posicao', posicao)
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      setAnuncios(data || []);
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerView = async (anuncio: Anuncio) => {
    try {
      await supabase
        .from('anuncios')
        .update({ visualizacoes: anuncio.visualizacoes + 1 })
        .eq('id', anuncio.id);
    } catch (error) {
      console.error('Erro ao registrar visualização:', error);
    }
  };

  const handleClick = async (anuncio: Anuncio) => {
    // Registrar clique
    try {
      await supabase
        .from('anuncios')
        .update({ cliques: anuncio.cliques + 1 })
        .eq('id', anuncio.id);
    } catch (error) {
      console.error('Erro ao registrar clique:', error);
    }

    // Abrir link
    if (anuncio.link_url) {
      window.open(anuncio.link_url, '_blank');
    }
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % anuncios.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + anuncios.length) % anuncios.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setProgress(0);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  if (loading || anuncios.length === 0) {
    return null;
  }

  const currentAnuncio = anuncios[currentIndex];
  const hasMultiple = anuncios.length > 1;

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
        <div
          className="relative h-[400px] rounded-xl overflow-hidden cursor-pointer group"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('button')) return;
            handleClick(anuncio);
          }}
          onTouchEnd={(e) => {
            if ((e.target as HTMLElement).closest('button')) return;
            e.preventDefault();
            handleClick(anuncio);
          }}
        >
          <img
            src={anuncio.imagem_url}
            alt={anuncio.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center text-center p-8">
            <div className="max-w-3xl">
              {anuncio.subtitulo && (
                <p className="text-white/90 text-lg mb-2">{anuncio.subtitulo}</p>
              )}
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {anuncio.titulo}
              </h2>
              {anuncio.descricao && (
                <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                  {anuncio.descricao}
                </p>
              )}
              {renderImovelInfo(anuncio, 'overlay')}
              <Button 
                size="lg" 
                className="group/btn touch-manipulation min-h-[44px]"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleClick(anuncio);
                }}
              >
                {anuncio.texto_botao}
                <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Card Secundário
    if (anuncio.tipo === 'card_secundario') {
      const hasImovelInfo = anuncio.imovel_area || anuncio.imovel_preco || anuncio.imovel_localizacao;
      
      return (
        <Card
          className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('button')) return;
            handleClick(anuncio);
          }}
          onTouchEnd={(e) => {
            if ((e.target as HTMLElement).closest('button')) return;
            e.preventDefault();
            handleClick(anuncio);
          }}
        >
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-auto">
              <img
                src={anuncio.imagem_url}
                alt={anuncio.titulo}
                className="w-full h-full object-cover"
              />
              {hasImovelInfo && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-600 hover:bg-green-700">
                    Imóvel
                  </Badge>
                </div>
              )}
            </div>
            <CardContent className="p-8 flex flex-col justify-center">
              {anuncio.subtitulo && (
                <p className="text-primary font-semibold mb-2">{anuncio.subtitulo}</p>
              )}
              <h3 className="text-3xl font-bold mb-4">{anuncio.titulo}</h3>
              {anuncio.descricao && (
                <p className="text-muted-foreground mb-4">{anuncio.descricao}</p>
              )}
              
              {/* Informações de imóvel */}
              {renderImovelInfo(anuncio, 'card')}
              
              <Button 
                className="w-fit touch-manipulation min-h-[44px]"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleClick(anuncio);
                }}
              >
                {anuncio.texto_botao}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </div>
        </Card>
      );
    }

    // Full Width
    if (anuncio.tipo === 'full_width') {
      return (
        <div
          className="relative h-[300px] rounded-xl overflow-hidden cursor-pointer group"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('button')) return;
            handleClick(anuncio);
          }}
          onTouchEnd={(e) => {
            if ((e.target as HTMLElement).closest('button')) return;
            e.preventDefault();
            handleClick(anuncio);
          }}
        >
          <img
            src={anuncio.imagem_url}
            alt={anuncio.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
          <div className="absolute inset-0 flex items-center p-12">
            <div className="max-w-xl">
              {anuncio.subtitulo && (
                <p className="text-white/90 mb-2">{anuncio.subtitulo}</p>
              )}
              <h3 className="text-3xl font-bold text-white mb-3">{anuncio.titulo}</h3>
              {anuncio.descricao && (
                <p className="text-white/90 mb-4">{anuncio.descricao}</p>
              )}
              {renderImovelInfo(anuncio, 'overlay')}
              <Button 
                variant="secondary"
                className="touch-manipulation min-h-[44px]"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleClick(anuncio);
                }}
              >
                {anuncio.texto_botao}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
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
      <div className="relative group">
        {/* Anúncio atual com animação de fade */}
        <div 
          className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
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
              {anuncios.map((anuncio, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(index);
                  }}
                  className={`h-2 rounded-full transition-all relative overflow-hidden ${
                    index === currentIndex 
                      ? 'w-8' 
                      : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Ir para anúncio ${index + 1}`}
                  title={`${anuncio.titulo} (${anuncio.duracao_exibicao}s)`}
                >
                  {index === currentIndex && (
                    <>
                      <div className="absolute inset-0 bg-white/30" />
                      <div 
                        className="absolute inset-0 bg-primary transition-all ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    </>
                  )}
                </button>
              ))}
              
              {/* Botão de Pause/Play */}
              <Button
                variant="secondary"
                size="icon"
                className="h-6 w-6 ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                title={isPaused ? 'Retomar rotação' : 'Pausar rotação'}
              >
                {isPaused ? (
                  <Play className="w-3 h-3" />
                ) : (
                  <Pause className="w-3 h-3" />
                )}
              </Button>
            </div>

            {/* Contador de anúncios */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
              {currentIndex + 1} / {anuncios.length}
              <span className="ml-2 text-white/70">({currentAnuncio.duracao_exibicao}s)</span>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
