import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Loader2, 
  Fish, 
  Home, 
  Map, 
  Utensils, 
  Wifi, 
  Car, 
  Shield, 
  Play, 
  MapPin, 
  Navigation, 
  Compass, 
  ExternalLink, 
  Copy,
  ArrowLeft,
  Star,
  Sparkles,
  Clock,
  Users,
  CheckCircle2
} from 'lucide-react';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { usePacoteAnalytics, dispararPixel } from '@/hooks/usePacoteAnalytics';
import { PacoteFAQs } from '@/components/PacoteFAQs';
import { PackagePricing } from '@/components/packages/PackagePricing';
import { PackageTestimonials } from '@/components/packages/PackageTestimonials';
import { ImageGallery } from '@/components/ImageGallery';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { usePacoteBySlug } from '@/hooks/useOptimizedData';
import { ShareButtons } from '@/components/ShareButtons';
import { SITE_CONFIG } from '@/lib/constants';
import { useTranslation } from 'react-i18next';

const PacoteDetalhes = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Use optimized hook with cache
  const { data: pacoteData, isLoading: loading } = usePacoteBySlug(slug);

  // Transform to expected format
  const pacote = useMemo(() => {
    if (!pacoteData) return null;
    return {
      id: pacoteData.id,
      nome: pacoteData.nome,
      nome_en: pacoteData.nome_en,
      slug: pacoteData.slug,
      descricao: pacoteData.descricao,
      descricao_en: pacoteData.descricao_en,
      preco: pacoteData.preco,
      duracao: pacoteData.duracao,
      pessoas: pacoteData.pessoas,
      rating: pacoteData.rating,
      tipo: pacoteData.tipo || '',
      caracteristicas: pacoteData.caracteristicas,
      inclusos: pacoteData.inclusos,
      ativo: pacoteData.ativo,
      popular: pacoteData.popular,
      destaque: pacoteData.destaque,
      parcelas_quantidade: pacoteData.parcelas_quantidade,
      parcela_valor: pacoteData.parcela_valor,
      desconto_avista: pacoteData.desconto_avista,
      vagas_disponiveis: pacoteData.vagas_disponiveis,
      video_youtube: pacoteData.video_youtube,
      tracking_code: pacoteData.tracking_code,
      telefone_whatsapp: pacoteData.telefone_whatsapp,
      link_botao_acao: pacoteData.link_botao_acao,
      endereco_completo: pacoteData.endereco_completo,
      latitude: pacoteData.latitude,
      longitude: pacoteData.longitude,
      imagens: pacoteData.imagens.map(img => ({
        url: img.url,
        alt_text: img.alt_text || '',
        principal: img.principal,
      })),
    };
  }, [pacoteData]);

  // WhatsApp padrão do site, usado se o pacote não tiver um específico
  const whatsappPadrao = "5538999755886";

  // Hook de analytics - SEMPRE deve ser chamado no nível superior
  usePacoteAnalytics(pacote?.id || '', 'visualizacao');

  const nome = (isEn && pacote?.nome_en) ? pacote.nome_en : pacote?.nome || '';
  const descricao = (isEn && pacote?.descricao_en) ? pacote.descricao_en : pacote?.descricao || '';

  // Registra visualização automaticamente quando o pacote for carregado
  useEffect(() => {
    if (pacote?.id) {
      // Disparar pixel personalizado se configurado
      if (pacote.tracking_code) {
        dispararPixel(pacote.tracking_code, 'ViewContent', {
          content_name: nome,
          content_id: pacote.id,
          content_type: 'product',
          value: pacote.preco,
          currency: 'BRL'
        });
      }
    }
  }, [pacote, nome]);

  // Redirect if pacote not found
  useEffect(() => {
    if (!loading && !pacote) {
      toast.error(t('labels.noPackages', 'Pacote não encontrado'));
      navigate('/pacotes');
    }
  }, [loading, pacote, navigate, t]);


  const handleWhatsAppClick = () => {
    if (pacote) {
      // Disparar pixel personalizado se configurado
      if (pacote.tracking_code) {
        dispararPixel(pacote.tracking_code, 'Contact', {
          content_name: nome,
          content_id: pacote.id,
          content_type: 'product'
        });
      }
    }

    const telefone = pacote?.telefone_whatsapp || whatsappPadrao;
    const mensagem = isEn 
      ? `Hello! I would like to get more information about the "${nome}" package`
      : `Olá! Gostaria de saber mais informações sobre o pacote "${nome}"`;
    const whatsappUrl = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleReservarClick = () => {
    if (pacote) {
      // Disparar pixel personalizado se configurado
      if (pacote.tracking_code) {
        dispararPixel(pacote.tracking_code, 'InitiateCheckout', {
          content_name: nome,
          content_id: pacote.id,
          content_type: 'product',
          value: pacote.preco,
          currency: 'BRL'
        });
      }
    }

    // Se tiver link/URL de ação próprio, redireciona diretamente
    if (pacote?.link_botao_acao && pacote.link_botao_acao.trim() !== '') {
      const url = pacote.link_botao_acao.trim();
      const finalUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Fallback: abre conversa de WhatsApp do pacote
    handleWhatsAppClick();
  };

  // Mapear ícones para features
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iconMap: Record<string, any> = {
    'pesca': Fish,
    'acomodação': Home,
    'localização': Map,
    'refeições': Utensils,
    'wifi': Wifi,
    'transporte': Car,
    'seguro': Shield,
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

  const getFeatureIcon = (title: string) => {
    const key = Object.keys(iconMap).find(k =>
      title.toLowerCase().includes(k)
    );
    return iconMap[key] || Fish;
  };

  // Converter características em features
  const features = pacote?.caracteristicas.slice(0, 8).map((carac) => ({
    icon: getFeatureIcon(carac),
    title: carac.split(':')[0] || carac,
    description: carac.split(':')[1]?.trim() || 'Incluso no pacote'
  })) || [];

  // Determinar tier baseado no preço
  const getTier = (): 'vip' | 'luxo' | 'diamante' => {
    if (!pacote) return 'vip';
    if (pacote.preco > 2000) return 'diamante';
    if (pacote.preco > 1500) return 'luxo';
    return 'vip';
  };

  // Imagem principal
  const mainImage = pacote?.imagens.find(img => img.principal)?.url ||
    pacote?.imagens[0]?.url ||
    '/placeholder.svg';

  const galleryImages = useMemo(() => {
    if (pacote?.imagens && pacote.imagens.length > 0) {
      return pacote.imagens.map(img => ({
        url: img.url,
        alt_text: img.alt_text || nome,
        principal: img.principal
      }));
    }
    return [{
      url: mainImage,
      alt_text: nome,
      principal: true
    }];
  }, [pacote?.imagens, mainImage, nome]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!pacote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Pacote não encontrado</p>
      </div>
    );
  }

  const tier = getTier();
  const badge = pacote.popular ? 'popular' : pacote.destaque ? 'destaque' : undefined;

  const heroImage = mainImage || '/og-image.png';
  // Always use production domain for sharing URLs
  const pageUrl = `${SITE_CONFIG.PRODUCTION_DOMAIN}/pacote/${pacote.slug}`;
  const isShorts = pacote.video_youtube?.includes('/shorts/');

  return (
    <>
      <Helmet>
        <title>{nome} | Pacote de Pesca - PradoAqui</title>
        <meta name="description" content={descricao?.substring(0, 160) || `Pacote ${nome}. ${pacote.duracao} para ${pacote.pessoas} pessoas.`} />
        <meta property="og:title" content={`${nome} | PradoAqui`} />
        <meta property="og:description" content={descricao?.substring(0, 160) || `Pacote de pesca: ${pacote.duracao}`} />
        <meta property="og:image" content={heroImage} />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${nome} | PradoAqui`} />
        <meta name="twitter:image" content={heroImage} />
        <link rel="canonical" href={pageUrl} />
      </Helmet>

      <Header />

      {/* Barra de Navegação / Voltar */}
      <div className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/pacotes')}
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('buttons.backToPackages', 'Voltar para pacotes')}
          </Button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Cabeçalho do Pacote: Badges, Título e Meta Info */}
        <div className="mb-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {badge && (
              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-medium">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                {badge === 'popular' ? 'Mais Popular' : 'Em Destaque'}
              </Badge>
            )}
            {pacote.tipo && (
              <Badge variant="secondary" className="capitalize">
                {pacote.tipo}
              </Badge>
            )}
            {pacote.vagas_disponiveis && pacote.vagas_disponiveis <= 5 && (
              <Badge variant="destructive">
                Últimas {pacote.vagas_disponiveis} vagas!
              </Badge>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            {nome}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1 font-semibold text-foreground">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{pacote.rating || 5.0}</span>
              <span className="text-muted-foreground font-normal">(127 avaliações)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{pacote.endereco_completo || 'Rio São Francisco'}</span>
            </div>
            {pacote.duracao && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  {pacote.duracao}
                </span>
              </>
            )}
            {pacote.pessoas && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  {pacote.pessoas} pessoas
                </span>
              </>
            )}
          </div>
        </div>

        {/* Galeria de Fotos em Destaque */}
        <div className="mb-10">
          <ImageGallery
            images={galleryImages}
            title={nome}
          />
        </div>

        {/* Layout de 2 Colunas: Detalhes + Card de Reserva Fixo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cards Rápidos de Informação */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card className="bg-card/60 backdrop-blur-sm border-border hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-xs text-muted-foreground">{t('labels.duration', 'Duração')}</div>
                  <div className="font-semibold text-sm sm:text-base text-foreground mt-0.5">{pacote.duracao || '-'}</div>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur-sm border-border hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-xs text-muted-foreground">{t('labels.pessoas', 'Capacidade')}</div>
                  <div className="font-semibold text-sm sm:text-base text-foreground mt-0.5">Até {pacote.pessoas || 1} pessoas</div>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur-sm border-border hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-xs text-muted-foreground">{t('labels.location', 'Local')}</div>
                  <div className="font-semibold text-xs sm:text-sm text-foreground mt-0.5 line-clamp-1" title={pacote.endereco_completo || 'Rio São Francisco'}>
                    {pacote.endereco_completo?.split('-')[0]?.trim() || 'Rio São Francisco'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur-sm border-border hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-xs text-muted-foreground">Garantia</div>
                  <div className="font-semibold text-xs sm:text-sm text-foreground mt-0.5">100% Seguro</div>
                </CardContent>
              </Card>
            </div>

            {/* Sobre este pacote */}
            <Card className="border shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                  {t('labels.aboutPackage', 'Sobre este pacote')}
                </h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line text-base">
                  {descricao}
                </div>

                {/* Destaques / Características se houver */}
                {pacote.caracteristicas && pacote.caracteristicas.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Destaques da experiência
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {pacote.caracteristicas.map((carac, index) => (
                        <div key={index} className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/40 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{carac}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* O que está incluído */}
            {pacote.inclusos && pacote.inclusos.length > 0 && (
              <Card className="border shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Fish className="w-6 h-6 text-primary" />
                    O que está incluído
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pacote.inclusos.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-foreground font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features com ícones se não tiver lista de inclusos */}
            {features.length > 0 && (!pacote.inclusos || pacote.inclusos.length === 0) && (
              <Card className="border shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                    Características do Pacote
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {features.map((feat, index) => {
                      const IconComponent = feat.icon;
                      return (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-foreground">{feat.title}</div>
                            <div className="text-xs text-muted-foreground">{feat.description}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vídeo do Pacote (YouTube) */}
            {pacote.video_youtube && (
              <Card className="overflow-hidden shadow-md border rounded-xl">
                <div className="bg-slate-900 px-5 py-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <Play className="h-5 w-5 fill-primary text-primary" />
                    <span className="font-semibold text-sm sm:text-base">
                      {t('labels.knowPackage', 'Conheça o Pacote em Vídeo')}
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-white/10 text-white border-0 text-xs">
                    HD
                  </Badge>
                </div>
                <CardContent className="p-0 bg-black">
                  <div className={`relative w-full mx-auto overflow-hidden ${isShorts ? 'aspect-[9/16] max-w-sm' : 'aspect-video'}`}>
                    {getYouTubeEmbedUrl(pacote.video_youtube) ? (
                      <iframe
                        src={getYouTubeEmbedUrl(pacote.video_youtube) || ''}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        title={`Vídeo ${nome}`}
                      />
                    ) : (
                      <YouTubePlayer videoUrl={pacote.video_youtube} title={nome} />
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Localização & Como Chegar */}
            {((pacote.latitude && pacote.longitude) || pacote.endereco_completo) && (
              <Card className="border shadow-sm overflow-hidden">
                <CardContent className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{t('labels.location', 'Localização')}</h2>
                      <p className="text-xs text-muted-foreground">{t('labels.howToGet', 'Como chegar ao local de partida')}</p>
                    </div>
                  </div>

                  {pacote.endereco_completo && (
                    <div className="p-4 rounded-lg bg-muted/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <Navigation className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-foreground">{pacote.endereco_completo}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const queryStr = (pacote.latitude && pacote.longitude) ? `${pacote.latitude},${pacote.longitude}` : encodeURIComponent(pacote.endereco_completo || '');
                            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${queryStr}`;
                            window.open(mapsUrl, '_blank');
                          }}
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                          Maps
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(pacote.endereco_completo || '');
                            toast.success(t('labels.addressCopied', 'Endereço copiado!'));
                          }}
                        >
                          <Copy className="h-3.5 w-3.5 mr-1.5" />
                          Copiar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Mapa Iframe */}
                  <div className="relative w-full h-[320px] rounded-lg overflow-hidden border border-border">
                    <iframe
                      src={pacote.latitude && pacote.longitude ? `https://www.google.com/maps?q=${pacote.latitude},${pacote.longitude}&hl=${isEn ? 'en' : 'pt-BR'}&z=14&output=embed` : `https://www.google.com/maps?q=${encodeURIComponent(pacote.endereco_completo || '')}&hl=${isEn ? 'en' : 'pt-BR'}&z=14&output=embed`}
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
                </CardContent>
              </Card>
            )}

            {/* Dúvidas Frequentes (FAQ) */}
            <Card className="border shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                  {t('labels.faq', 'Dúvidas Frequentes')}
                </h2>
                <PacoteFAQs pacoteId={pacote.id} />
              </CardContent>
            </Card>

            {/* Compartilhamento */}
            <div className="pt-2">
              <ShareButtons
                titulo={nome}
                url={pageUrl}
                descricao={isEn ? `Package ${pacote.duracao} for ${pacote.pessoas} guests` : `Pacote ${pacote.duracao} para ${pacote.pessoas} pessoas`}
              />
            </div>
          </div>

          {/* Coluna Lateral (Sticky) - Preço e Reserva */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <PackagePricing
                price={pacote.preco}
                tier={tier}
                installments={pacote.parcela_valor || pacote.parcelas_quantidade ? {
                  count: pacote.parcelas_quantidade || 10,
                  value: pacote.parcela_valor || (pacote.preco / (pacote.parcelas_quantidade || 10))
                } : undefined}
                discount={pacote.desconto_avista}
                spotsLeft={pacote.vagas_disponiveis}
                onReserveClick={handleReservarClick}
                onWhatsAppClick={handleWhatsAppClick}
                sticky={false}
              />
            </div>
          </div>
        </div>

        {/* Depoimentos de Clientes (Seção Inferior) */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {t('labels.testimonialsTitle', 'O Que Nossos Clientes Dizem')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              {t('labels.testimonialsSub', 'Experiências reais de quem já viveu momentos inesquecíveis')}
            </p>
          </div>
          <PackageTestimonials
            pacoteId={pacote.id}
            tipoPacote={pacote.tipo as 'pescaria' | 'completo' | 'personalizado'}
            maxItems={4}
          />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PacoteDetalhes;
