import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ImageGallery } from '@/components/ImageGallery';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';
import {
  MapPin, Users, Bed, Bath, Maximize, Star,
  Wifi, Car, Waves, Utensils, Wind, Tv,
  ArrowLeft, MessageCircle, Loader2, CheckCircle,
  Calendar, Play, CalendarDays, Navigation, Compass, ExternalLink, Copy,
  ArrowRight, HelpCircle
} from 'lucide-react';
import { ReviewsList } from "@/components/reviews/ReviewsList";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { useRanchoAnalytics, registrarEvento } from "@/hooks/useRanchoAnalytics";
import { RanchoFAQs } from '@/components/RanchoFAQs';
import { useRanchoBySlug, useRanchos } from '@/hooks/useOptimizedData';
import { ShareButtons } from '@/components/ShareButtons';
import RanchCard from '@/components/RanchCard';
import { SITE_CONFIG } from '@/lib/constants';
import { invalidateCache } from '@/lib/cacheService';

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
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  // Use optimized hook with cache
  const { data: ranchoData, isLoading: loading, refetch } = useRanchoBySlug(slug);

  // Cache self-healing: if coordinates are missing but it's a known rancho, try clearing cache
  useEffect(() => {
    if (!loading && ranchoData && !ranchoData.latitude && slug) {
      console.log(`[Cache] Dados de localização ausentes para ${slug}, invalidando cache...`);
      invalidateCache(`rancho_${slug}`);
      invalidateCache('ranchos_all');
      invalidateCache('ranchos_available');
      refetch();
    }
  }, [ranchoData, loading, slug, refetch]);

  // Transform to expected format
  const rancho = React.useMemo(() => {
    if (!ranchoData) return null;
    const rawImagens = Array.isArray(ranchoData?.imagens) ? ranchoData.imagens : [];
    return {
      id: ranchoData.id,
      nome: ranchoData.nome || '',
      nome_en: ranchoData.nome_en || null,
      descricao: ranchoData.descricao || '',
      descricao_en: ranchoData.descricao_en || null,
      localizacao: ranchoData.localizacao || '',
      localizacao_en: ranchoData.localizacao_en || null,
      capacidade: Number(ranchoData.capacidade || 0),
      preco: Number(ranchoData.preco || 0),
      rating: Number(ranchoData.rating || 5),
      quartos: Number(ranchoData.quartos || 0),
      banheiros: Number(ranchoData.banheiros || 0),
      area: ranchoData.area || 0,
      comodidades: Array.isArray(ranchoData.comodidades) ? ranchoData.comodidades : [],
      disponivel: Boolean(ranchoData.disponivel),
      telefone_whatsapp: ranchoData.telefone_whatsapp || '',
      mensagem_whatsapp: ranchoData.mensagem_whatsapp || '',
      typebot_url: ranchoData.typebot_url || '',
      texto_botao_whatsapp: ranchoData.texto_botao_whatsapp || '',
      video_youtube: ranchoData.video_youtube || '',
      google_calendar_url: ranchoData.google_calendar_url || '',
      tracking_code: ranchoData.tracking_code || '',
      latitude: ranchoData.latitude,
      longitude: ranchoData.longitude,
      endereco_completo: ranchoData.endereco_completo || '',
      imagens: rawImagens.map(img => ({
        url: typeof img === 'string' ? img : img?.url || '',
        alt_text: (typeof img === 'object' && img?.alt_text) || '',
        principal: (typeof img === 'object' && img?.principal) || false,
      })),
    };
  }, [ranchoData]);

  const nome = (isEn && rancho?.nome_en) ? rancho.nome_en : rancho?.nome || '';
  const descricao = (isEn && rancho?.descricao_en) ? rancho.descricao_en : rancho?.descricao || '';
  const localizacao = (isEn && rancho?.localizacao_en) ? rancho.localizacao_en : rancho?.localizacao || '';

  // Fetch active ranchos to suggest similar ones
  const { data: allRanchosData } = useRanchos(true);

  // Transform and filter out current rancho
  const suggestedRanchos = React.useMemo(() => {
    if (!allRanchosData || !Array.isArray(allRanchosData) || !rancho) return [];
    
    // Filter out current rancho
    const filtered = allRanchosData.filter(r => r && r.id !== rancho.id);

    // Map to the format RanchCard expects
    return filtered.slice(0, 3).map(ranchoItem => {
      const itemImagens = Array.isArray(ranchoItem?.imagens) ? ranchoItem.imagens : [];
      return {
        id: ranchoItem.id,
        name: ranchoItem.nome || '',
        name_en: ranchoItem.nome_en || null,
        slug: ranchoItem.slug || '',
        description: ranchoItem.descricao || '',
        description_en: ranchoItem.descricao_en || null,
        location: ranchoItem.localizacao || '',
        location_en: ranchoItem.localizacao_en || null,
        capacity: Number(ranchoItem.capacidade || 0),
        price: Number(ranchoItem.preco || 0),
        rating: Number(ranchoItem.rating || 5),
        images: [...itemImagens]
          .sort((a, b) => {
            if (a?.principal && !b?.principal) return -1;
            if (!a?.principal && b?.principal) return 1;
            return (a?.ordem || 0) - (b?.ordem || 0);
          })
          .map(img => (typeof img === 'string' ? img : img?.url || ''))
          .filter(Boolean),
        amenities: Array.isArray(ranchoItem.comodidades) ? ranchoItem.comodidades : [],
        available: Boolean(ranchoItem.disponivel),
        features: {
          bedrooms: Number(ranchoItem.quartos || 0),
          bathrooms: Number(ranchoItem.banheiros || 0),
          area: ranchoItem.area ? `${ranchoItem.area}m²` : '0m²'
        }
      };
    });
  }, [allRanchosData, rancho]);

  const whatsappNumber = rancho?.telefone_whatsapp || "5531999999999";

  // Redirect if rancho not found
  useEffect(() => {
    if (!loading && !rancho) {
      navigate('/');
    }
  }, [loading, rancho, navigate]);

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

    // Registrar clique no WhatsApp / Typebot
    registrarEvento(rancho.id, "clique_whatsapp");

    // Se houver Typebot, redireciona pra ele direto
    if (rancho.typebot_url) {
      let finalUrl = rancho.typebot_url;
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl;
      }
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = finalUrl;
      } else {
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    const phone = rancho.telefone_whatsapp || "5531999999999";

    // Usar mensagem personalizada se existir, senão usa padrão
    let message: string;
    if (rancho.mensagem_whatsapp) {
      message = rancho.mensagem_whatsapp
        .replace(/{nome}/g, nome)
        .replace(/{localizacao}/g, localizacao);
    } else {
      message = isEn 
        ? `Hello! I would like to book a stay at ${nome} (${localizacao}). Could you please send me more information about availability and rates?`
        : `Olá! Gostaria de fazer uma reserva no ${nome} (${localizacao}). Pode me passar mais informações sobre disponibilidade e valores?`;
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;

    // Extract video ID from YouTube Shorts URL
    const shortsMatch = url.match(/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }

    // Regular YouTube URLs (watch?v= or youtu.be/)
    const videoMatch = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:[&?]|$)/);
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

  const mainImage = rancho.imagens.find(img => img.principal)?.url || rancho.imagens[0]?.url || '/og-image.png';
  // Always use production domain for sharing URLs
  const pageUrl = `${SITE_CONFIG.PRODUCTION_DOMAIN}/rancho/${slug}`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{nome} | {t('labels.location')} em {localizacao} - PradoAqui</title>
        <meta name="description" content={descricao?.substring(0, 160) || `Rancho ${nome} em ${localizacao}.`} />
        <meta property="og:title" content={`${nome} | PradoAqui`} />
        <meta property="og:description" content={descricao?.substring(0, 160) || `Rancho para pesca em ${localizacao}`} />
        <meta property="og:image" content={mainImage} />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${nome} | PradoAqui`} />
        <meta name="twitter:image" content={mainImage} />
        <link rel="canonical" href={pageUrl} />
      </Helmet>

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
            {t('labels.backToRanches')}
          </Button>
        </div>

        {/* Image Gallery */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <ImageGallery images={rancho.imagens} title={nome} />
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
                    {nome}
                  </h1>
                  {rancho.disponivel && (
                    <Badge className="bg-green-500 text-white">{t('labels.available')}</Badge>
                  )}
                </div>

                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-lg">{localizacao}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{rancho.rating}</span>
                  <span className="text-muted-foreground">• {t('labels.ratingLabel')}</span>
                </div>
              </div>

              <Separator />

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-xl">{rancho.capacidade}</div>
                    <div className="text-sm text-muted-foreground">{t('labels.pessoas')}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <Bed className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-xl">{rancho.quartos}</div>
                    <div className="text-sm text-muted-foreground">{t('labels.bedrooms')}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <Bath className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-xl">{rancho.banheiros}</div>
                    <div className="text-sm text-muted-foreground">{t('labels.bathrooms')}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <Maximize className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-xl">{rancho.area}m²</div>
                    <div className="text-sm text-muted-foreground">{t('labels.area')}</div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold mb-4">{t('labels.aboutRanch')}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {descricao}
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



              {/* Google Calendar Availability */}
              {rancho.google_calendar_url && (
                <>
                  <Separator />
                  <div id="calendar-section">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                        <CalendarDays className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Disponibilidade</h2>
                        <p className="text-sm text-muted-foreground">Confira as datas disponíveis para reserva</p>
                      </div>
                    </div>
                    <Card className="overflow-hidden shadow-2xl border border-border/50 rounded-2xl">
                      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-5">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Calendário de Reservas
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge
                              className="bg-white/20 text-white border-white/30 hover:bg-white/30 cursor-pointer transition-all hover:scale-105 active:scale-95"
                              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${rancho.latitude},${rancho.longitude}`, '_blank')}
                            >
                              <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                              </span>
                              Tempo real
                            </Badge>
                          </div>
                        </div>
                        <p className="text-white/80 text-sm mt-2">
                          Datas marcadas indicam reservas confirmadas
                        </p>
                      </div>
                      <CardContent className="p-0">
                        {/* Container com overflow hidden para esconder o rodapé do Google Calendar */}
                        <div className="relative w-full h-[550px] overflow-hidden bg-background">
                          <iframe
                            src={(() => {
                              try {
                                const url = new URL(rancho.google_calendar_url);
                                if (!url.hostname.includes('calendar.google.com')) return rancho.google_calendar_url;

                                const params = new URLSearchParams(url.search);
                                params.set('showTitle', '0');
                                params.set('showPrint', '0');
                                params.set('showTabs', '0');
                                params.set('showCalendars', '0');
                                params.set('showTz', '0');
                                params.set('mode', 'MONTH');
                                params.set('wkst', '1');
                                params.set('bgcolor', '#ffffff');
                                params.set('ctz', 'America/Sao_Paulo');
                                params.set('_t', String(Date.now()));

                                if (!url.pathname.includes('/embed')) {
                                  const cid = params.get('cid');
                                  if (cid) {
                                    params.set('src', cid);
                                    params.delete('cid');
                                  }
                                }

                                return `https://calendar.google.com/calendar/embed?${params.toString()}`;
                              } catch (e) {
                                return rancho.google_calendar_url;
                              }
                            })()}
                            className="w-full border-0"
                            style={{ height: '620px', marginBottom: '-70px' }}
                            frameBorder="0"
                            scrolling="no"
                            title={`Calendário de disponibilidade ${rancho.nome}`}
                          />
                        </div>
                      </CardContent>
                      {/* Legenda de cores */}
                      <div className="bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 px-5 py-4 border-t border-border/50">
                        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-[#4285f4] shadow-sm"></div>
                            <span className="text-sm text-foreground font-medium">Reservado</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-white border border-gray-300 shadow-sm"></div>
                            <span className="text-sm text-foreground font-medium">Disponível</span>
                          </div>
                        </div>
                      </div>
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
                    <div className="text-muted-foreground">{t('labels.pricePerPerson')}</div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{t('labels.bookingDetails')}:</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                          <span>{t('labels.bookingIncludeCap', { count: rancho.capacidade })}</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                          <span>{t('labels.bookingIncludeRooms', { bedrooms: rancho.quartos, bathrooms: rancho.banheiros })}</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                          <span>{t('labels.bookingIncludeAmenities')}</span>
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
                    {rancho.texto_botao_whatsapp || t('buttons.bookWhatsApp')}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    {t('labels.bookingDetailsText')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Seção de Avaliações */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">{t('labels.reviews')}</h2>
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reviews">{t('labels.viewReviews')}</TabsTrigger>
                <TabsTrigger value="new">{t('labels.writeReview')}</TabsTrigger>
              </TabsList>
              <TabsContent value="reviews" className="mt-6">
                <ReviewsList ranchoId={rancho.id} />
              </TabsContent>
              <TabsContent value="new" className="mt-6">
                <ReviewForm ranchoId={rancho.id} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Seção de Perguntas Frequentes (FAQs) */}
          {rancho && (
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-rio-blue to-blue-700 shadow-lg shadow-rio-blue/20">
                  <HelpCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t('labels.faq')}</h2>
                  <p className="text-sm text-muted-foreground">
                    {isEn ? "Frequently asked questions about this ranch" : "Tire suas dúvidas mais comuns sobre este rancho"}
                  </p>
                </div>
              </div>
              <Card className="border border-gray-100 shadow-md">
                <CardContent className="p-6">
                  <RanchoFAQs ranchoId={rancho.id} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Seção de Localização Premium */}
      {((rancho.latitude && rancho.longitude) || rancho.endereco_completo) ? (
        <section className="py-12 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4">
            {/* Header com ícone gradiente */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t('labels.location')}</h2>
                <p className="text-sm text-muted-foreground">{t('labels.howToGet')}</p>
              </div>
            </div>

            {/* Card de Endereço */}
            {rancho.endereco_completo && (
              <Card className="mb-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50 dark:border-blue-800/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Navigation className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{rancho.endereco_completo}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Button
                           size="sm"
                           variant="outline"
                           className="border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                           onClick={() => {
                             const queryStr = (rancho.latitude && rancho.longitude) ? `${rancho.latitude},${rancho.longitude}` : encodeURIComponent(rancho.endereco_completo || '');
                             const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${queryStr}`;
                             window.open(mapsUrl, '_blank');
                           }}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {t('buttons.abrirMaps')}
                        </Button>
                        <Button
                           size="sm"
                           variant="outline"
                           className="border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                           onClick={() => {
                             navigator.clipboard.writeText(rancho.endereco_completo || '');
                             toast.success(t('labels.addressCopied'));
                           }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {t('buttons.copiar')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mapa com Visual Premium */}
            <Card className="overflow-hidden shadow-xl border-0 rounded-2xl">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-white text-sm font-medium flex items-center gap-2">
                    <Compass className="h-4 w-4" />
                    {rancho.latitude && rancho.longitude ? `${Math.abs(rancho.latitude).toFixed(4)}°S, ${Math.abs(rancho.longitude).toFixed(4)}°W` : t('labels.location')}
                  </span>
                  <Badge
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30 cursor-pointer transition-all hover:scale-105 active:scale-95"
                    onClick={() => {
                      const queryStr = (rancho.latitude && rancho.longitude) ? `${rancho.latitude},${rancho.longitude}` : encodeURIComponent(rancho.endereco_completo || '');
                      window.open(`https://www.google.com/maps/search/?api=1&query=${queryStr}`, '_blank');
                    }}
                    title={isEn ? "See location on Google Maps" : "Ver localização no Google Maps"}
                  >
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    {t('labels.exactLocation')}
                  </Badge>
                </div>
              </div>
              <div className="relative w-full h-[400px]">
                <iframe
                  src={rancho.latitude && rancho.longitude ? `https://www.google.com/maps?q=${rancho.latitude},${rancho.longitude}&hl=${isEn ? 'en' : 'pt-BR'}&z=14&output=embed` : `https://www.google.com/maps?q=${encodeURIComponent(rancho.endereco_completo || '')}&hl=${isEn ? 'en' : 'pt-BR'}&z=14&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa - ${nome}`}
                  className="absolute inset-0"
                />
              </div>
            </Card>
          </div>
        </section>
      ) : null}

      {/* Seção de Compartilhamento */}
      {rancho && (
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <ShareButtons
              titulo={nome}
              url={pageUrl}
              descricao={isEn ? `Ranch in ${localizacao} for up to ${rancho.capacidade} guests` : `Rancho em ${localizacao} para ${rancho.capacidade} pessoas`}
            />
          </div>
        </section>
      )}

      {/* Seção de Ranchos Sugeridos (Outros Ranchos para Locação) */}
      {suggestedRanchos.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t('labels.suggestedRanchos')}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t('labels.suggestedRanchosSub')}</p>
              </div>
              <Button variant="outline" asChild className="hidden sm:inline-flex border-rio-blue text-rio-blue hover:bg-rio-blue hover:text-white rounded-xl">
                <Link to="/ranchos">
                  {t('buttons.verTodas')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedRanchos.map((item) => (
                <RanchCard key={item.id} ranch={item} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" asChild className="w-full border-rio-blue text-rio-blue hover:bg-rio-blue hover:text-white rounded-xl">
                <Link to="/ranchos">
                  {t('buttons.verTodosRanchos')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default RanchoDetalhes;
