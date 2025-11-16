import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2, Fish, Home, Map, Utensils, Wifi, Car, Shield } from 'lucide-react';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { usePacoteAnalytics, dispararPixel } from '@/hooks/usePacoteAnalytics';
import { PacoteFAQs } from '@/components/PacoteFAQs';
import PacoteMap from '@/components/PacoteMap';
import { PackagePageLayout } from '@/components/packages/PackagePageLayout';
import { PackageHero } from '@/components/packages/PackageHero';
import { PackageQuickInfo } from '@/components/packages/PackageQuickInfo';
import { PackageAbout } from '@/components/packages/PackageAbout';
import { PackageFeatures } from '@/components/packages/PackageFeatures';
import { PackageGallery } from '@/components/packages/PackageGallery';
import { PackagePricing } from '@/components/packages/PackagePricing';

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
  telefone_whatsapp?: string;
  endereco_completo?: string;
  latitude?: number;
  longitude?: number;
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

  // WhatsApp padrão do site, usado se o pacote não tiver um específico
  const whatsappPadrao = "5538999755886";

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
          telefone_whatsapp: pacoteData.telefone_whatsapp,
          endereco_completo: pacoteData.endereco_completo,
          latitude: pacoteData.latitude,
          longitude: pacoteData.longitude,
          imagens: imagesData || [],
        };

        setPacote(pacoteCompleto);
      } catch (error) {
        console.error('Erro ao carregar pacote:', error);
        toast.error('Erro ao carregar informações do pacote');
        navigate('/pacotes');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPacote();
    }
  }, [slug, navigate]);

  const handleWhatsAppClick = () => {
    if (pacote) {
      // Disparar pixel personalizado se configurado
      if (pacote.tracking_code) {
        dispararPixel(pacote.tracking_code, 'Contact', {
          content_name: pacote.nome,
          content_id: pacote.id,
          content_type: 'product'
        });
      }
    }

    const telefone = pacote?.telefone_whatsapp || whatsappPadrao;
    const mensagem = `Olá! Gostaria de saber mais informações sobre o pacote "${pacote?.nome}"`;
    const whatsappUrl = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleReservarClick = () => {
    if (pacote) {
      // Disparar pixel personalizado se configurado
      if (pacote.tracking_code) {
        dispararPixel(pacote.tracking_code, 'InitiateCheckout', {
          content_name: pacote.nome,
          content_id: pacote.id,
          content_type: 'product',
          value: pacote.preco,
          currency: 'BRL'
        });
      }
    }
    handleWhatsAppClick();
  };

  // Mapear ícones para features
  const iconMap: Record<string, any> = {
    'pesca': Fish,
    'acomodação': Home,
    'localização': Map,
    'refeições': Utensils,
    'wifi': Wifi,
    'transporte': Car,
    'seguro': Shield,
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

  // Preparar imagens para galeria
  const galleryImages = pacote?.imagens.map(img => ({
    url: img.url,
    alt: img.alt_text
  })) || [];

  // Imagem principal
  const mainImage = pacote?.imagens.find(img => img.principal)?.url || 
                   pacote?.imagens[0]?.url || 
                   '/placeholder.svg';

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

  return (
    <>
      <Header />
      <PackagePageLayout
        sidebar={
          <PackagePricing
            price={pacote.preco}
            tier={tier}
            onReserveClick={handleReservarClick}
            onWhatsAppClick={handleWhatsAppClick}
          />
        }
      >
        <PackageHero
          title={pacote.nome}
          subtitle={pacote.tipo}
          imageUrl={mainImage}
          rating={pacote.rating}
          reviewsCount={127}
          badge={badge}
          tier={tier}
          onCtaClick={handleReservarClick}
        />

        <PackageQuickInfo
          duration={pacote.duracao}
          people={pacote.pessoas}
          location={pacote.endereco_completo || 'Rio São Francisco'}
          price={`R$ ${pacote.preco.toFixed(2)}`}
        />

        <PackageAbout
          description={pacote.descricao}
          highlights={pacote.caracteristicas?.slice(0, 6)}
        />

        {features.length > 0 && (
          <PackageFeatures features={features} tier={tier} />
        )}

        {galleryImages.length > 0 && (
          <PackageGallery images={galleryImages} initialVisible={6} />
        )}

        {pacote.video_youtube && (
          <section className="py-12">
            <div className="container max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                Conheça o Pacote
              </h2>
              <div className="max-w-4xl mx-auto">
                <YouTubePlayer videoUrl={pacote.video_youtube} title={pacote.nome} />
              </div>
            </div>
          </section>
        )}

        {pacote.latitude && pacote.longitude && (
          <section className="py-12 bg-muted/30">
            <div className="container max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                Localização
              </h2>
              <PacoteMap
                latitude={pacote.latitude}
                longitude={pacote.longitude}
                titulo={pacote.nome}
                endereco={pacote.endereco_completo || 'Rio São Francisco'}
              />
            </div>
          </section>
        )}

        <section className="py-12">
          <div className="container max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Perguntas Frequentes
            </h2>
            <div className="max-w-3xl mx-auto">
              <PacoteFAQs pacoteId={pacote.id} />
            </div>
          </div>
        </section>
      </PackagePageLayout>
      <Footer />
    </>
  );
};

export default PacoteDetalhes;
