import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ImageGallery } from '@/components/ImageGallery';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, Users, Bed, Bath, Maximize, Star, 
  Wifi, Car, Waves, Utensils, Wind, Tv, 
  ArrowLeft, MessageCircle, Loader2, CheckCircle,
  Calendar, Play, CalendarDays
} from 'lucide-react';
import { ReviewsList } from "@/components/reviews/ReviewsList";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { useRanchoAnalytics, registrarEvento } from "@/hooks/useRanchoAnalytics";
import { RanchoFAQs } from '@/components/RanchoFAQs';

interface RanchoDetalhes {
  id: string;
  nome: string;
  descricao: string;
  localizacao: string;
  capacidade: number;
  preco: number;
  rating: number;
  quartos: number;
  banheiros: number;
  area: number;
  comodidades: string[];
  disponivel: boolean;
  telefone_whatsapp?: string;
  video_youtube?: string;
  google_calendar_url?: string;
  tracking_code?: string;
  latitude?: number;
  longitude?: number;
  endereco_completo?: string;
  imagens: {
    url: string;
    alt_text: string;
    principal: boolean;
  }[];
}

const amenityIcons: { [key: string]: React.ReactNode } = {
  'Wi-Fi': <Wifi className="h-5 w-5" />,
  'Estacionamento': <Car className="h-5 w-5" />,
  'Piscina': <Waves className="h-5 w-5" />,
  'Churrasqueira': <Utensils className="h-5 w-5" />,
  'Deck de Pesca': <Waves className="h-5 w-5" />,
  'Ar Condicionado': <Wind className="h-5 w-5" />,
  'TV a Cabo': <Tv className="h-5 w-5" />,
  'Cozinha Completa': <Utensils className="h-5 w-5" />,
};

const RanchoDetalhes = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [rancho, setRancho] = useState<RanchoDetalhes | null>(null);
  const [loading, setLoading] = useState(true);

  const whatsappNumber = rancho?.telefone_whatsapp || "5531999999999";

  useEffect(() => {
    const fetchRancho = async () => {
      try {
        setLoading(true);

        // Buscar rancho pelo slug
        const { data: ranchoData, error: ranchoError } = await supabase
          .from('ranchos')
          .select('*')
          .eq('slug', slug)
          .eq('disponivel', true)
          .maybeSingle();

        if (ranchoError) throw ranchoError;
        if (!ranchoData) {
          toast.error('Rancho não encontrado');
          navigate('/');
          return;
        }

        // Buscar imagens do rancho
        const { data: imagesData } = await supabase
          .from('rancho_imagens')
          .select('url, alt_text, principal, ordem')
          .eq('rancho_id', ranchoData.id)
          .order('ordem', { ascending: true });

        const ranchoCompleto = {
          id: ranchoData.id,
          nome: ranchoData.nome,
          descricao: ranchoData.descricao || '',
          localizacao: ranchoData.localizacao,
          capacidade: ranchoData.capacidade,
          preco: Number(ranchoData.preco),
          rating: Number(ranchoData.rating),
          quartos: ranchoData.quartos,
          banheiros: ranchoData.banheiros,
          area: ranchoData.area,
          comodidades: ranchoData.comodidades || [],
          disponivel: ranchoData.disponivel,
          telefone_whatsapp: ranchoData.telefone_whatsapp,
          video_youtube: ranchoData.video_youtube,
          google_calendar_url: ranchoData.google_calendar_url,
          tracking_code: ranchoData.tracking_code,
          latitude: ranchoData.latitude,
          longitude: ranchoData.longitude,
          endereco_completo: ranchoData.endereco_completo,
          imagens: imagesData || []
        };

        // Debug logs
        console.log('Video YouTube:', ranchoCompleto.video_youtube);
        console.log('Google Calendar:', ranchoCompleto.google_calendar_url);
        console.log('Coordenadas:', { lat: ranchoCompleto.latitude, lng: ranchoCompleto.longitude });
        
        setRancho(ranchoCompleto);
      } catch (error) {
        console.error('Erro ao buscar rancho:', error);
        toast.error('Erro ao carregar detalhes do rancho');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchRancho();
    }
  }, [slug, navigate]);

  // Registrar visualização da página
  useRanchoAnalytics(rancho?.id || "", "visualizacao");

  // Injetar tracking code específico do rancho (sanitizado)
  useEffect(() => {
    if (rancho?.tracking_code) {
      const trackingDiv = document.createElement('div');
      // Sanitize HTML to prevent XSS attacks
      const sanitizedHTML = DOMPurify.sanitize(rancho.tracking_code, {
        ADD_TAGS: ['script', 'style', 'link'],
        ADD_ATTR: ['src', 'href', 'rel', 'type', 'async', 'defer'],
        ALLOW_DATA_ATTR: false
      });
      trackingDiv.innerHTML = sanitizedHTML;
      
      Array.from(trackingDiv.children).forEach((element) => {
        const clonedElement = element.cloneNode(true) as HTMLElement;
        
        if (clonedElement.tagName === 'SCRIPT') {
          const script = document.createElement('script');
          if ((element as HTMLScriptElement).src) {
            script.src = (element as HTMLScriptElement).src;
            script.async = true;
          } else {
            script.innerHTML = element.innerHTML;
          }
          document.head.appendChild(script);
        } else {
          document.head.appendChild(clonedElement);
        }
      });
    }
  }, [rancho]);

  const handleWhatsAppReserva = () => {
    if (!rancho) return;
    
    // Registrar clique no WhatsApp
    registrarEvento(rancho.id, "clique_whatsapp");
    
    const phone = rancho.telefone_whatsapp || "5531999999999";
    const message = `Olá! Gostaria de fazer uma reserva no ${rancho.nome} (${rancho.localizacao}). Pode me passar mais informações sobre disponibilidade e valores?`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // Extract video ID from YouTube Shorts URL
    const shortsMatch = url.match(/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }
    
    // Handle regular YouTube URLs as fallback
    const videoMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (videoMatch) {
      return `https://www.youtube.com/embed/${videoMatch[1]}`;
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!rancho) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Breadcrumb & Back Button */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Ranchos
          </Button>
        </div>

        {/* Image Gallery */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <ImageGallery images={rancho.imagens} title={rancho.nome} />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Location */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                    {rancho.nome}
                  </h1>
                  {rancho.disponivel && (
                    <Badge className="bg-green-500 text-white">Disponível</Badge>
                  )}
                </div>
                
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-lg">{rancho.localizacao}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{rancho.rating}</span>
                  <span className="text-muted-foreground">• Avaliação</span>
                </div>
              </div>

              <Separator />

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-xl">{rancho.capacidade}</div>
                    <div className="text-sm text-muted-foreground">Pessoas</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <Bed className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-xl">{rancho.quartos}</div>
                    <div className="text-sm text-muted-foreground">Quartos</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <Bath className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-xl">{rancho.banheiros}</div>
                    <div className="text-sm text-muted-foreground">Banheiros</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <Maximize className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-xl">{rancho.area}m²</div>
                    <div className="text-sm text-muted-foreground">Área</div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Sobre o Rancho</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {rancho.descricao}
                </p>
              </div>

              <Separator />

              {/* Amenities */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Comodidades</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {rancho.comodidades.map((comodidade, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                      <div className="text-primary">
                        {amenityIcons[comodidade] || <CheckCircle className="h-5 w-5" />}
                      </div>
                      <span className="text-sm font-medium">{comodidade}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* YouTube Video */}
              {rancho.video_youtube && (
                <>
                  <Separator />
                  <div id="video-section">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                        <Play className="h-6 w-6 text-white fill-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Conheça o Rancho</h2>
                        <p className="text-sm text-muted-foreground">Assista ao vídeo e conheça cada detalhe</p>
                      </div>
                    </div>
                    {getYouTubeEmbedUrl(rancho.video_youtube) ? (
                      <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-b from-muted/50 to-background">
                        <CardContent className="p-4 md:p-6">
                          <div className="relative w-full max-w-lg mx-auto rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                            <div className="bg-gradient-to-b from-black to-zinc-900" style={{ paddingBottom: '177.78%' }}>
                              <iframe
                                src={getYouTubeEmbedUrl(rancho.video_youtube) || ''}
                                className="absolute top-0 left-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                title={`Vídeo ${rancho.nome}`}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="border-dashed">
                        <CardContent className="py-8 text-center">
                          <Play className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                          <p className="text-muted-foreground">URL do vídeo inválida. Verifique o formato.</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </>
              )}

              {/* Google Maps Location */}
              {rancho.latitude && rancho.longitude && (
                <>
                  <Separator />
                  <div id="map-section">
                    <h2 className="text-2xl font-bold mb-4">Localização</h2>
                    {rancho.endereco_completo && (
                      <p className="text-muted-foreground mb-4">{rancho.endereco_completo}</p>
                    )}
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative w-full h-[450px] bg-muted">
                          <iframe
                            src={`https://www.google.com/maps?q=${rancho.latitude},${rancho.longitude}&hl=pt-BR&z=14&output=embed`}
                            className="w-full h-full border-0"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Mapa ${rancho.nome}`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {/* Google Calendar Availability */}
              {rancho.google_calendar_url && (
                <>
                  <Separator />
                  <div id="calendar-section">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                        <CalendarDays className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Disponibilidade</h2>
                        <p className="text-sm text-muted-foreground">Confira as datas disponíveis para reserva</p>
                      </div>
                    </div>
                    <Card className="overflow-hidden shadow-xl border-0">
                      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Calendário de Reservas
                          </h3>
                          <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                            Atualizado em tempo real
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-0">
                        <div className="relative w-full h-[600px] bg-background">
                          <iframe
                            src={`${rancho.google_calendar_url}&showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&mode=MONTH&wkst=1&bgcolor=%23ffffff&ctz=America/Sao_Paulo`}
                            className="w-full h-full border-0"
                            frameBorder="0"
                            scrolling="yes"
                            title={`Calendário de disponibilidade ${rancho.nome}`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <div className="text-3xl font-bold text-foreground">
                      R$ {rancho.preco.toFixed(2)}
                    </div>
                    <div className="text-muted-foreground">por dia</div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Inclui:</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                          <span>Acomodação para até {rancho.capacidade} pessoas</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                          <span>{rancho.quartos} quartos e {rancho.banheiros} banheiros</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                          <span>Todas as comodidades listadas</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <Button 
                    onClick={handleWhatsAppReserva}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    size="lg"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Reservar via WhatsApp
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Entre em contato para consultar disponibilidade e confirmar sua reserva
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Seção de Avaliações */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">Avaliações dos Hóspedes</h2>
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reviews">Ver Avaliações</TabsTrigger>
                <TabsTrigger value="new">Deixar Avaliação</TabsTrigger>
              </TabsList>
              <TabsContent value="reviews" className="mt-6">
                <ReviewsList ranchoId={rancho.id} />
              </TabsContent>
              <TabsContent value="new" className="mt-6">
                <ReviewForm ranchoId={rancho.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Seção de FAQs */}
      {rancho && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
                <RanchoFAQs ranchoId={rancho.id} />
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default RanchoDetalhes;
