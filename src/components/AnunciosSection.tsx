import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const ROTATION_INTERVAL = 8000; // 8 segundos

  useEffect(() => {
    fetchAnuncios();
  }, [posicao]);

  // Auto-rotation effect
  useEffect(() => {
    if (anuncios.length <= 1 || isPaused) {
      return;
    }

    intervalRef.current = setInterval(() => {
      handleNext();
    }, ROTATION_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
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
    setCurrentIndex((prev) => (prev + 1) % anuncios.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + anuncios.length) % anuncios.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  if (loading || anuncios.length === 0) {
    return null;
  }

  const currentAnuncio = anuncios[currentIndex];
  const hasMultiple = anuncios.length > 1;

  const renderAnuncio = (anuncio: Anuncio) => {
    // Banner Principal (Hero Style)
    if (anuncio.tipo === 'banner_principal') {
      return (
        <div
          className="relative h-[400px] rounded-xl overflow-hidden cursor-pointer group"
          onClick={() => handleClick(anuncio)}
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
              <Button size="lg" className="group/btn">
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
      return (
        <Card
          className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleClick(anuncio)}
        >
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-auto">
              <img
                src={anuncio.imagem_url}
                alt={anuncio.titulo}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-8 flex flex-col justify-center">
              {anuncio.subtitulo && (
                <p className="text-primary font-semibold mb-2">{anuncio.subtitulo}</p>
              )}
              <h3 className="text-3xl font-bold mb-4">{anuncio.titulo}</h3>
              {anuncio.descricao && (
                <p className="text-muted-foreground mb-6">{anuncio.descricao}</p>
              )}
              <Button className="w-fit">
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
          onClick={() => handleClick(anuncio)}
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
              <Button variant="secondary">
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
            {/* Botões Prev/Next */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-background/90"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-background/90"
              onClick={(e) => {
                e.stopPropagation();
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
                      ? 'w-8 bg-primary' 
                      : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Ir para anúncio ${index + 1}`}
                />
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
            </div>
          </>
        )}
      </div>
    </section>
  );
};
