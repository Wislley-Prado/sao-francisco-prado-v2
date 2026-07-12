import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ImageGallery } from '@/components/ImageGallery';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  MapPin, Maximize, MessageSquare, Waves, Zap, 
  Droplets, Compass, Play, Navigation, 
  ExternalLink, Copy, CheckCircle, ArrowLeft, Loader2,
  ArrowRight
} from 'lucide-react';
import { usePropriedadeVendaBySlug, useSiteSettings, usePropriedadesVenda } from '@/hooks/useOptimizedData';
import { ShareButtons } from '@/components/ShareButtons';
import PropriedadeCard from '@/components/PropriedadeCard';
import { SITE_CONFIG } from '@/lib/constants';

// Mapping common characteristics to icons
const charIcons: { [key: string]: React.ReactNode } = {
  'água': <Droplets className="h-5 w-5" />,
  'agua': <Droplets className="h-5 w-5" />,
  'luz': <Zap className="h-5 w-5" />,
  'energia': <Zap className="h-5 w-5" />,
  'rio': <Waves className="h-5 w-5" />,
  'represa': <Waves className="h-5 w-5" />,
  'acesso': <Compass className="h-5 w-5" />,
};

const getCharIcon = (char: string) => {
  const lower = char.toLowerCase();
  for (const key in charIcons) {
    if (lower.includes(key)) {
      return charIcons[key];
    }
  }
  return <Compass className="h-5 w-5" />;
};

const getYouTubeEmbedUrl = (url: string | null) => {
  if (!url) return null;
  const shortsMatch = url.match(/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }
  const videoMatch = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:[&?]|$)/);
  if (videoMatch) {
    return `https://www.youtube.com/embed/${videoMatch[1]}`;
  }
  return null;
};

const PropriedadeDetalhes = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: propriedade, isLoading: loading } = usePropriedadeVendaBySlug(slug);
  const { data: siteSettings } = useSiteSettings();

  // Fetch active sales properties to suggest similar ones
  const { data: allPropriedades } = usePropriedadesVenda(true);

  // Filter out current property and take up to 3 items
  const suggestedPropriedades = React.useMemo(() => {
    if (!allPropriedades || !propriedade) return [];
    return allPropriedades
      .filter((p) => p.id !== propriedade.id)
      .slice(0, 3);
  }, [allPropriedades, propriedade]);

  // Redirect if not found
  useEffect(() => {
    if (!loading && !propriedade) {
      navigate('/vendas');
    }
  }, [loading, propriedade, navigate]);

  const defaultNumber = siteSettings?.whatsapp_numero || "5538988320108";
  const rawPhone = propriedade?.whatsapp_contato || propriedade?.telefone_contato || defaultNumber;
  const phone = rawPhone.replace(/\D/g, '');

  const message = React.useMemo(() => {
    if (!propriedade) return '';
    if (propriedade.mensagem_whatsapp) {
      return propriedade.mensagem_whatsapp
        .replace(/{titulo}/g, propriedade.titulo)
        .replace(/{localizacao}/g, propriedade.localizacao);
    }
    return `Olá! Vi o anúncio da propriedade "${propriedade.titulo}" em "${propriedade.localizacao}" no site PradoAqui e gostaria de saber mais informações.`;
  }, [propriedade]);

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  const galleryImages = React.useMemo(() => {
    if (!propriedade || !propriedade.imagens || propriedade.imagens.length === 0) return [];
    return propriedade.imagens.map((imgUrl, idx) => ({
      url: imgUrl,
      alt_text: `${propriedade.titulo} - Imagem ${idx + 1}`,
      principal: idx === 0
    }));
  }, [propriedade]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!propriedade) {
    return null;
  }

  const mainImage = propriedade.imagens?.[0] || '/og-image.png';
  const pageUrl = `${SITE_CONFIG.PRODUCTION_DOMAIN}/venda/${slug}`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{propriedade.titulo} | Imóvel à Venda em {propriedade.localizacao} - PradoAqui</title>
        <meta name="description" content={propriedade.descricao?.substring(0, 160) || `Excelente oportunidade: ${propriedade.titulo} em ${propriedade.localizacao}.`} />
        <meta property="og:title" content={`${propriedade.titulo} | PradoAqui`} />
        <meta property="og:description" content={propriedade.descricao?.substring(0, 160) || `Imóvel à Venda em ${propriedade.localizacao}`} />
        <meta property="og:image" content={mainImage} />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${propriedade.titulo} | PradoAqui`} />
        <meta name="twitter:image" content={mainImage} />
        <link rel="canonical" href={pageUrl} />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Breadcrumb & Back Button */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/vendas')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Vendas
          </Button>
        </div>

        {/* Image Gallery */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          {galleryImages.length > 0 ? (
            <ImageGallery images={galleryImages} title={propriedade.titulo} />
          ) : (
            <div className="w-full h-[300px] bg-slate-100 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center text-muted-foreground border border-dashed">
              <Play className="h-12 w-12 text-slate-300 mb-2" />
              <span>Sem imagens cadastradas para esta propriedade</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title, Location & Badge */}
              <div>
                <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                    {propriedade.titulo}
                  </h1>
                  <Badge className="bg-sunset-orange hover:bg-sunset-orange/95 text-white uppercase text-xs font-semibold px-3 py-1">
                    {propriedade.tipo || 'Oportunidade'}
                  </Badge>
                </div>

                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-5 w-5 mr-2 text-emerald-500 shrink-0" />
                  <span className="text-lg">{propriedade.localizacao}</span>
                </div>
              </div>

              <Separator />

              {/* Area Box */}
              {propriedade.area && (
                <div className="bg-muted/30 border border-border/50 rounded-xl p-4 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                    <Maximize className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Área Total</div>
                    <div className="text-lg font-bold text-foreground">
                      {propriedade.area} {propriedade.unidade_area || 'hectares'}
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Sobre o Imóvel</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-base">
                  {propriedade.descricao || 'Excelente oportunidade para investimento ou lazer na região do Rio São Francisco.'}
                </p>
              </div>

              <Separator />

              {/* Characteristics */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Características</h2>
                {propriedade.caracteristicas && propriedade.caracteristicas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {propriedade.caracteristicas.map((char, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 dark:bg-muted/20 border border-border/30 rounded-lg">
                        <div className="text-primary shrink-0">
                          {getCharIcon(char)}
                        </div>
                        <span className="text-sm font-medium capitalize">{char}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Nenhuma característica cadastrada para este imóvel.</p>
                )}
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-lg border-border/50">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <div className="text-xs text-muted-foreground">Valor de Venda</div>
                    <div className="text-3xl font-extrabold text-rio-blue dark:text-emerald-400 mt-1">
                      R$ {propriedade.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-4 text-center space-y-3">
                    <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-300">Gostou deste imóvel?</p>
                    <p className="text-xs text-emerald-800 dark:text-emerald-400">Entre em contato agora mesmo para agendar uma visita ou negociar.</p>
                    
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md py-6 text-base font-semibold transition-all">
                        <MessageSquare className="mr-2 h-5 w-5 fill-white" />
                        {propriedade.texto_botao_whatsapp || 'Falar no WhatsApp'}
                      </Button>
                    </a>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Copiar Link do Anúncio:</h4>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value={pageUrl}
                        className="bg-muted text-xs border-border h-9"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 shrink-0"
                        onClick={() => {
                          navigator.clipboard.writeText(pageUrl);
                          toast.success('Link copiado!');
                        }}
                        title="Copiar Link"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Video and Map Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-border/50 mt-12">
            {/* Presentation Video */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-md">
                  <Play className="h-6 w-6 text-white fill-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-foreground">Vídeo de Apresentação</h3>
                  <p className="text-xs text-muted-foreground">Conheça o imóvel em detalhes</p>
                </div>
              </div>

              {propriedade.video_youtube && getYouTubeEmbedUrl(propriedade.video_youtube) ? (
                <Card className="overflow-hidden shadow-lg border border-border/50 rounded-2xl bg-black">
                  <CardContent className="p-4 md:p-6">
                    {(() => {
                      const isShorts = propriedade.video_youtube.includes('shorts');
                      const embedUrl = getYouTubeEmbedUrl(propriedade.video_youtube);
                      if (isShorts) {
                        return (
                          <div className="relative w-full max-w-[300px] sm:max-w-[340px] mx-auto" style={{ paddingBottom: '177.78%' /* 9:16 vertical */ }}>
                            <iframe
                              src={embedUrl || ''}
                              className="absolute top-0 left-0 w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              title={`Vídeo Shorts ${propriedade.titulo}`}
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 horizontal */ }}>
                            <iframe
                              src={embedUrl || ''}
                              className="absolute top-0 left-0 w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              title={`Vídeo ${propriedade.titulo}`}
                            />
                          </div>
                        );
                      }
                    })()}
                  </CardContent>
                </Card>
              ) : (
                <div className="bg-muted/30 dark:bg-muted/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-dashed border-border min-h-[250px]">
                  <Play className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <h4 className="font-semibold text-muted-foreground mb-1">Vídeo Indisponível</h4>
                  <p className="text-xs text-muted-foreground/70 max-w-[260px]">Nenhum vídeo de tour ou Shorts foi cadastrado pelo administrador para este imóvel.</p>
                </div>
              )}
            </div>

            {/* Map Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xl text-foreground">Mapa de Localização</h3>
                    <p className="text-xs text-muted-foreground">Veja no Google Maps</p>
                  </div>
                  {propriedade.latitude && propriedade.longitude && (
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 border-blue-200 text-blue-600 dark:border-blue-800 dark:text-blue-400 hover:bg-blue-50/50 text-xs"
                        onClick={() => {
                          const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${propriedade.latitude},${propriedade.longitude}`;
                          window.open(mapsUrl, '_blank');
                        }}
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        Rotas
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 border-blue-200 text-blue-600 dark:border-blue-800 dark:text-blue-400 hover:bg-blue-50/50 text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText(`${propriedade.latitude}, ${propriedade.longitude}`);
                          toast.success('Coordenadas copiadas!');
                        }}
                      >
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Coordenadas
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {propriedade.latitude && propriedade.longitude ? (
                <Card className="overflow-hidden shadow-lg border border-border/50 rounded-2xl">
                  <div className="relative w-full h-[320px] md:h-[350px]">
                    <iframe
                      src={`https://www.google.com/maps?q=${propriedade.latitude},${propriedade.longitude}&hl=pt-BR&z=14&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Mapa de ${propriedade.titulo}`}
                      className="absolute inset-0"
                    />
                  </div>
                </Card>
              ) : (
                <div className="bg-muted/30 dark:bg-muted/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-dashed border-border min-h-[250px]">
                  <MapPin className="h-10 w-10 text-muted-foreground/30 mb-3" />
                  <h4 className="font-semibold text-muted-foreground mb-1">Mapa Indisponível</h4>
                  <p className="text-xs text-muted-foreground/70 max-w-[260px]">As coordenadas geográficas exatas (latitude/longitude) não foram cadastradas.</p>
                </div>
              )}
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-16 bg-muted/20 dark:bg-muted/5 rounded-2xl p-8 border border-border/30">
            <ShareButtons
              titulo={propriedade.titulo}
              url={pageUrl}
              descricao={`Excelente oportunidade: ${propriedade.titulo} em ${propriedade.localizacao} - PradoAqui`}
            />
          </div>

          {/* Outras Oportunidades Section */}
          {suggestedPropriedades.length > 0 && (
            <div className="mt-16 pt-12 border-t border-border/50">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Outras Oportunidades à Venda</h2>
                  <p className="text-muted-foreground text-sm mt-1">Imóveis similares na região do Rio São Francisco</p>
                </div>
                <Button variant="outline" asChild className="hidden sm:inline-flex border-rio-blue text-rio-blue hover:bg-rio-blue hover:text-white rounded-xl">
                  <Link to="/vendas">
                    Ver Todas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestedPropriedades.map((item) => (
                  <PropriedadeCard key={item.id} propriedade={item} />
                ))}
              </div>

              <div className="mt-8 text-center sm:hidden">
                <Button variant="outline" asChild className="w-full border-rio-blue text-rio-blue hover:bg-rio-blue hover:text-white rounded-xl">
                  <Link to="/vendas">
                    Ver Todas as Oportunidades
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropriedadeDetalhes;
