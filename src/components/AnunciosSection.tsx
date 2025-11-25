import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

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
}

interface AnunciosSectionProps {
  posicao: 'topo' | 'meio' | 'rodape' | 'sidebar';
}

export const AnunciosSection = ({ posicao }: AnunciosSectionProps) => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnuncios();
  }, [posicao]);

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

  if (loading || anuncios.length === 0) {
    return null;
  }

  // Renderização baseada no tipo de anúncio
  return (
    <section className="py-8 container mx-auto px-4">
      <div className="space-y-6">
        {anuncios.map((anuncio) => {
          // Banner Principal (Hero Style)
          if (anuncio.tipo === 'banner_principal') {
            return (
              <div
                key={anuncio.id}
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
                key={anuncio.id}
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
                key={anuncio.id}
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
        })}
      </div>
    </section>
  );
};
