import { useEffect } from 'react';
import { Home, Utensils, Fish, Car, Users, Shield, Wifi, Zap } from 'lucide-react';
import { PackagePageLayout } from '@/components/packages/PackagePageLayout';
import { PackageHero } from '@/components/packages/PackageHero';
import { PackageQuickInfo } from '@/components/packages/PackageQuickInfo';
import { PackagePricing } from '@/components/packages/PackagePricing';
import { PackageFeatures } from '@/components/packages/PackageFeatures';
import { PackageGallery } from '@/components/packages/PackageGallery';
import { PackageAbout } from '@/components/packages/PackageAbout';
import { PackageTestimonials } from '@/components/packages/PackageTestimonials';
import { PacoteFAQs } from '@/components/PacoteFAQs';
import ranchoPradoAldeia from '@/assets/gallery/rancho-prado-aldeia.jpg';
import paiFilhoDourado from '@/assets/gallery/pai-filho-dourado.jpg';
import clienteMulherDourado from '@/assets/gallery/cliente-mulher-dourado.jpg';
import pescariaCapal1 from '@/assets/gallery/pescaria-casal-1.jpg';
import pescariaCapal2 from '@/assets/gallery/pescaria-casal-2.jpg';
import pescariaCapal3 from '@/assets/gallery/pescaria-casal-3.jpg';

const photos = [
  { url: ranchoPradoAldeia, alt: 'Rancho' },
  { url: paiFilhoDourado, alt: 'Pescaria' },
  { url: clienteMulherDourado, alt: 'Cliente' },
  { url: pescariaCapal1, alt: 'Casal 1' },
  { url: pescariaCapal2, alt: 'Casal 2' },
  { url: pescariaCapal3, alt: 'Casal 3' },
];

const features = [
  { icon: Home, title: 'Acomodação Premium', description: 'Rancho exclusivo para até 6 pessoas' },
  { icon: Utensils, title: 'Refeições Incluídas', description: 'Café, almoço e jantar' },
  { icon: Fish, title: 'Equipamentos', description: 'Material de pesca completo' },
  { icon: Car, title: 'Transporte', description: 'Traslados inclusos' },
  { icon: Users, title: 'Guia', description: 'Profissional experiente' },
  { icon: Shield, title: 'Seguro', description: 'Cobertura completa' },
  { icon: Wifi, title: 'Wi-Fi', description: 'Internet disponível' },
  { icon: Zap, title: 'Energia Solar', description: 'Sistema sustentável' },
];

const PackageVip = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const handleCtaClick = () => window.open(`https://wa.me/5538998101673?text=${encodeURIComponent('Olá! Gostaria de informações sobre o Pacote VIP.')}`, '_blank');

  return (
    <PackagePageLayout sidebar={<PackagePricing price={1479} installments={{ count: 10, value: 147.90 }} discount={15} tier="vip" spotsLeft={3} onReserveClick={handleCtaClick} onWhatsAppClick={handleCtaClick} />}>
      <PackageHero title="Pacote VIP de Pescaria" subtitle="Experiência exclusiva no Rio São Francisco" imageUrl={ranchoPradoAldeia} rating={4.9} reviewsCount={127} badge="popular" tier="vip" onCtaClick={handleCtaClick} />
      <PackageQuickInfo duration="5 dias / 4 noites" people={6} location="Prado-Aldeia, MG" price="10x de R$ 147,90" />
      <PackageAbout description="Experiência completa de pesca com conforto e estrutura." highlights={['Rancho exclusivo', 'Guias experientes', 'Equipamentos premium']} />
      <PackageFeatures features={features} tier="vip" />
      <PackageGallery images={photos} />
      
      <section className="py-16 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">O Que Nossos Clientes Dizem</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Experiências reais de quem já viveu momentos inesquecíveis</p>
          </div>
          <PackageTestimonials tipoPacote="completo" maxItems={4} />
        </div>
      </section>

      <div className="container max-w-7xl mx-auto px-4 pb-12"><PacoteFAQs pacoteId={null} /></div>
    </PackagePageLayout>
  );
};

export default PackageVip;
