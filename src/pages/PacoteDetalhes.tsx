import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, Users, Star, ArrowLeft, MessageCircle, 
  Loader2, CheckCircle, Calendar, Sparkles, Package, HelpCircle
} from 'lucide-react';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { usePacoteAnalytics, registrarEventoPacote, dispararPixel } from '@/hooks/usePacoteAnalytics';
import { PacoteFAQs } from '@/components/PacoteFAQs';
import { sanitizeHtml } from '@/utils/htmlSanitizer';

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
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
          <span>/</span>
          <Link to="/pacotes" className="hover:text-foreground transition-colors">Pacotes</Link>
          <span>/</span>
          <span className="text-foreground">{pacote.nome}</span>
        </nav>

        {/* Botão Voltar */}
        <Button
          variant="ghost"
          onClick={() => navigate('/pacotes')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Pacotes
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header com Título e Badges */}
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {pacote.popular && (
                  <Badge variant="default" className="gap-1 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                    <Sparkles className="h-3 w-3" />
                    Popular
                  </Badge>
                )}
                {pacote.destaque && (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    Destaque
                  </Badge>
                )}
                <Badge variant="outline" className="capitalize border-border text-muted-foreground">
                  {pacote.tipo}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {pacote.nome}
              </h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span className="font-medium text-foreground">{pacote.rating.toFixed(1)}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{pacote.duracao}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span>{pacote.pessoas} pessoa{pacote.pessoas > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            {/* Galeria de Imagens */}
            {pacote.imagens.length > 0 && (
              <Card className="border-border overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-video">
                    <img
                      src={pacote.imagens[selectedImage]?.url || mainImage?.url}
                      alt={pacote.imagens[selectedImage]?.alt_text || pacote.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {pacote.imagens.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 p-4 bg-muted/30">
                      {pacote.imagens.slice(0, 4).map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`relative aspect-video rounded-md overflow-hidden transition-all hover:opacity-80 ${
                            selectedImage === idx 
                              ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                              : 'opacity-60 hover:opacity-100'
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
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-xl">Veja o Pacote em Ação</CardTitle>
                </CardHeader>
                <CardContent>
                  <YouTubePlayer 
                    videoUrl={pacote.video_youtube} 
                    title={pacote.nome}
                  />
                </CardContent>
              </Card>
            )}

            {/* Descrição com HTML Rico */}
            {pacote.descricao && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-xl">Sobre o Pacote</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-sm max-w-none text-muted-foreground
                      prose-headings:text-foreground prose-headings:font-semibold
                      prose-p:leading-relaxed prose-p:mb-4
                      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-foreground prose-strong:font-semibold
                      prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                      prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
                      prose-li:text-muted-foreground
                      prose-img:rounded-lg prose-img:my-4"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(pacote.descricao) }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Características */}
            {pacote.caracteristicas.length > 0 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    Características
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {pacote.caracteristicas.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary/70 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Inclusos */}
            {pacote.inclusos.length > 0 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary/70" />
                    O que está incluso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {pacote.inclusos.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary/70 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FAQs integrado na coluna principal */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  Perguntas Frequentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PacoteFAQs pacoteId={pacote.id} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Card de Reserva */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-border shadow-lg">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Valor por pessoa</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">
                      R$ {pacote.preco.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Separator className="bg-border" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duração</span>
                    <span className="font-medium text-foreground">{pacote.duracao}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pessoas</span>
                    <span className="font-medium text-foreground">{pacote.pessoas}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tipo</span>
                    <span className="font-medium text-foreground capitalize">{pacote.tipo}</span>
                  </div>
                </div>

                <Separator className="bg-border" />

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
                    className="w-full border-border hover:bg-muted"
                    size="lg"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Falar no WhatsApp
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center pt-2 space-y-1">
                  <p>Dúvidas? Entre em contato pelo WhatsApp</p>
                  <p>Resposta em até 1 hora</p>
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
