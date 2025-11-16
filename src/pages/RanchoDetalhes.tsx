import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, Users, Bed, Bath, Maximize, Star, 
  Wifi, Car, Waves, Utensils, Wind, Tv, 
  ArrowLeft, MessageCircle, Loader2, CheckCircle
} from 'lucide-react';
import { ReviewsList } from "@/components/reviews/ReviewsList";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { useRanchoAnalytics, registrarEvento } from "@/hooks/useRanchoAnalytics";

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
  const [selectedImage, setSelectedImage] = useState(0);

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

        setRancho({
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
        });
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

  // Injetar tracking code específico do rancho
  useEffect(() => {
    if (rancho?.tracking_code) {
      const trackingDiv = document.createElement('div');
      trackingDiv.innerHTML = rancho.tracking_code;
      
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Main Image */}
            <div className="lg:col-span-2">
              {rancho.imagens.length > 0 ? (
                <img
                  src={rancho.imagens[selectedImage]?.url || rancho.imagens[0].url}
                  alt={rancho.imagens[selectedImage]?.alt_text || rancho.nome}
                  className="w-full h-[400px] lg:h-[500px] object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-[400px] lg:h-[500px] bg-gradient-to-br from-rio-blue to-water-green rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">Sem imagens disponíveis</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {rancho.imagens.length > 1 && (
              <div className="lg:col-span-2 grid grid-cols-4 md:grid-cols-6 gap-2">
                {rancho.imagens.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded-lg overflow-hidden transition-all ${
                      selectedImage === index 
                        ? 'ring-2 ring-primary scale-105' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt_text || `${rancho.nome} - Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
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
              {rancho.video_youtube && getYouTubeEmbedUrl(rancho.video_youtube) && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Conheça o Rancho</h2>
                    <div className="relative w-full" style={{ paddingBottom: '177.78%', maxWidth: '315px', margin: '0 auto' }}>
                      <iframe
                        src={getYouTubeEmbedUrl(rancho.video_youtube) || ''}
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`Vídeo ${rancho.nome}`}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Google Maps Location */}
              {rancho.latitude && rancho.longitude && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Localização</h2>
                    {rancho.endereco_completo && (
                      <p className="text-muted-foreground mb-4">{rancho.endereco_completo}</p>
                    )}
                    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.google.com/maps?q=${rancho.latitude},${rancho.longitude}&hl=pt-BR&z=14&output=embed`}
                        className="w-full h-full border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Mapa ${rancho.nome}`}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Google Calendar Availability */}
              {rancho.google_calendar_url && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Disponibilidade</h2>
                    <p className="text-muted-foreground mb-4">
                      Confira as datas disponíveis para reserva no calendário abaixo:
                    </p>
                    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-border">
                      <iframe
                        src={rancho.google_calendar_url}
                        className="w-full h-full border-0"
                        frameBorder="0"
                        scrolling="no"
                        title={`Calendário de disponibilidade ${rancho.nome}`}
                      />
                    </div>
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

      <Footer />
    </div>
  );
};

export default RanchoDetalhes;
