import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, Users, Star, ArrowLeft, MessageCircle, 
  Loader2, CheckCircle, Calendar, Sparkles, Package
} from 'lucide-react';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { usePacoteAnalytics, registrarEventoPacote, dispararPixel } from '@/hooks/usePacoteAnalytics';

interface PacoteDetalhes {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  preco: number;
  duracao: string;
  pessoas: number;
  rating: number;
  tipo: string;
  caracteristicas: string[];
  inclusos: string[];
  ativo: boolean;
  popular: boolean;
  destaque: boolean;
  video_youtube?: string;
  tracking_code?: string;
  imagens: {
    url: string;
    alt_text: string;
    principal: boolean;
  }[];
}

const PacoteDetalhes = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [pacote, setPacote] = useState<PacoteDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const whatsappNumber = "5538999755886";

  // Registra visualização automaticamente quando o pacote for carregado
  useEffect(() => {
    if (pacote?.id) {
      // Disparar pixel personalizado se configurado
      if (pacote.tracking_code) {
        dispararPixel(pacote.tracking_code, 'ViewContent', {
          content_name: pacote.nome,
          content_id: pacote.id,
          content_type: 'product',
          value: pacote.preco,
          currency: 'BRL'
        });
      }
    }
  }, [pacote]);

  // Hook de analytics
  if (pacote) {
    usePacoteAnalytics(pacote.id, 'visualizacao');
  }

  useEffect(() => {
    const fetchPacote = async () => {
      try {
        setLoading(true);

        const { data: pacoteData, error: pacoteError } = await supabase
          .from('pacotes')
          .select('*')
          .eq('slug', slug)
          .eq('ativo', true)
          .maybeSingle();

        if (pacoteError) throw pacoteError;
        if (!pacoteData) {
          toast.error('Pacote não encontrado');
          navigate('/pacotes');
          return;
        }

        const { data: imagesData } = await supabase
          .from('pacote_imagens')
          .select('url, alt_text, principal, ordem')
          .eq('pacote_id', pacoteData.id)
          .order('ordem', { ascending: true });

        const pacoteCompleto = {
          id: pacoteData.id,
          nome: pacoteData.nome,
          slug: pacoteData.slug,
          descricao: pacoteData.descricao || '',
          preco: Number(pacoteData.preco),
          duracao: pacoteData.duracao,
          pessoas: pacoteData.pessoas,
          rating: Number(pacoteData.rating),
          tipo: pacoteData.tipo,
          caracteristicas: pacoteData.caracteristicas || [],
          inclusos: pacoteData.inclusos || [],
          ativo: pacoteData.ativo,
          popular: pacoteData.popular,
          destaque: pacoteData.destaque,
          video_youtube: pacoteData.video_youtube,
          tracking_code: pacoteData.tracking_code,
          imagens: imagesData || [],
        };

        setPacote(pacoteCompleto);

        // Disparar pixel personalizado se configurado
        if (pacoteData.tracking_code) {
          dispararPixel(pacoteData.tracking_code, 'ViewContent', {
            content_name: pacoteData.nome,
            content_id: pacoteData.id,
            content_type: 'product',
            value: Number(pacoteData.preco),
            currency: 'BRL'
          });
        }
      } catch (error) {
        console.error('Erro ao buscar pacote:', error);
        toast.error('Erro ao carregar pacote');
        navigate('/pacotes');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPacote();
    }
  }, [slug, navigate]);

  const handleWhatsAppClick = async () => {
    if (!pacote) return;

    await registrarEventoPacote(pacote.id, 'clique_whatsapp');

    if (pacote.tracking_code) {
      dispararPixel(pacote.tracking_code, 'Contact', {
        content_name: pacote.nome,
        content_id: pacote.id
      });
    }

    const message = encodeURIComponent(
      `Olá! Gostaria de saber mais sobre o ${pacote.nome} (${pacote.duracao}).`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleReservarClick = async () => {
    if (!pacote) return;

    await registrarEventoPacote(pacote.id, 'clique_reserva');

    if (pacote.tracking_code) {
      dispararPixel(pacote.tracking_code, 'InitiateCheckout', {
        content_ids: [pacote.id],
        content_type: 'product',
        value: pacote.preco,
        currency: 'BRL'
      });
    }

    handleWhatsAppClick();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!pacote) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Pacote não encontrado</h1>
          <Button asChild>
            <Link to="/pacotes">Ver Pacotes</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const mainImage = pacote.imagens.find(img => img.principal) || pacote.imagens[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Início</Link>
          <span>/</span>
          <Link to="/pacotes" className="hover:text-foreground">Pacotes</Link>
          <span>/</span>
          <span className="text-foreground">{pacote.nome}</span>
        </div>

        {/* Botão Voltar */}
        <Button
          variant="ghost"
          onClick={() => navigate('/pacotes')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Pacotes
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header com Título e Badges */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                {pacote.popular && (
                  <Badge variant="default" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    Popular
                  </Badge>
                )}
                {pacote.destaque && (
                  <Badge variant="secondary">Destaque</Badge>
                )}
                <Badge variant="outline" className="capitalize">{pacote.tipo}</Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {pacote.nome}
              </h1>

              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-foreground">{pacote.rating.toFixed(1)}</span>
                </div>
                <Separator orientation="vertical" className="h-5" />
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {pacote.duracao}
                </div>
                <Separator orientation="vertical" className="h-5" />
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {pacote.pessoas} pessoa{pacote.pessoas > 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Galeria de Imagens */}
            {pacote.imagens.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <img
                    src={pacote.imagens[selectedImage]?.url || mainImage?.url}
                    alt={pacote.imagens[selectedImage]?.alt_text || pacote.nome}
                    className="w-full h-[400px] object-cover rounded-t-lg"
                  />
                  {pacote.imagens.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 p-4">
                      {pacote.imagens.slice(0, 4).map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`relative aspect-video rounded-lg overflow-hidden ${
                            selectedImage === idx ? 'ring-2 ring-primary' : ''
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={img.alt_text}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Vídeo YouTube/Shorts */}
            {pacote.video_youtube && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Veja o Pacote em Ação</h2>
                  <YouTubePlayer 
                    videoUrl={pacote.video_youtube} 
                    title={pacote.nome}
                  />
                </CardContent>
              </Card>
            )}

            {/* Descrição */}
            {pacote.descricao && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-3">Sobre o Pacote</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {pacote.descricao}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Características */}
            {pacote.caracteristicas.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Características
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {pacote.caracteristicas.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Inclusos */}
            {pacote.inclusos.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    O que está incluso
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {pacote.inclusos.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Card de Reserva */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Valor por pessoa</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      R$ {pacote.preco.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duração</span>
                    <span className="font-medium">{pacote.duracao}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pessoas</span>
                    <span className="font-medium">{pacote.pessoas}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tipo</span>
                    <span className="font-medium capitalize">{pacote.tipo}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button
                    onClick={handleReservarClick}
                    className="w-full"
                    size="lg"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Reservar Agora
                  </Button>

                  <Button
                    onClick={handleWhatsAppClick}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Falar no WhatsApp
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  <p>Dúvidas? Entre em contato pelo WhatsApp</p>
                  <p className="mt-1">Resposta em até 1 hora</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PacoteDetalhes;
