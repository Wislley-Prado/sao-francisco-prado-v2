import { useEffect } from 'react';
import { Gem, Crown, Wine, Plane, Camera, Fish, Car, Shield } from 'lucide-react';
import { PackagePageLayout } from '@/components/packages/PackagePageLayout';
import { PackageHero } from '@/components/packages/PackageHero';
import { PackageQuickInfo } from '@/components/packages/PackageQuickInfo';
import { PackagePricing } from '@/components/packages/PackagePricing';
import { PackageFeatures } from '@/components/packages/PackageFeatures';
import { PackageGallery } from '@/components/packages/PackageGallery';
import { PackageAbout } from '@/components/packages/PackageAbout';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import pacoteDiamanteImage from '@/assets/gallery/pacote-diamante.png';

const photos = [{ url: pacoteDiamanteImage, alt: 'Diamante' }];
const features = [
  { icon: Gem, title: 'Elite', description: 'Exclusivo' },
  { icon: Crown, title: 'VIP', description: 'Personalizado' },
  { icon: Wine, title: 'Gourmet', description: 'Chef renomado' },
  { icon: Plane, title: 'Transfer', description: 'Helicóptero' },
  { icon: Camera, title: 'Cobertura', description: 'Profissional' },
  { icon: Fish, title: 'Premium', description: 'Importado' },
  { icon: Car, title: 'Executivo', description: 'Luxo' },
  { icon: Shield, title: 'Seguro', description: 'Internacional' },
];

const PackageDiamante = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const handleCtaClick = () => window.open(`https://wa.me/5538998101673?text=${encodeURIComponent('Informações Pacote Diamante.')}`, '_blank');

  return (
    <PackagePageLayout sidebar={<PackagePricing price={4999} installments={{ count: 12, value: 416.58 }} discount={5} tier="diamante" spotsLeft={1} onReserveClick={handleCtaClick} onWhatsAppClick={handleCtaClick} />}>
      <PackageHero title="Pacote Diamante Elite" subtitle="Experiência exclusiva" imageUrl={pacoteDiamanteImage} rating={5.0} reviewsCount={45} badge="exclusivo" tier="diamante" onCtaClick={handleCtaClick} />
      <PackageQuickInfo duration="5 dias / 4 noites" people={6} location="Prado-Aldeia, MG" price="12x de R$ 416,58" />
      <PackageAbout description="Elite absoluto." highlights={['Luxo', 'VIP', 'Premium']} />
      <PackageFeatures features={features} tier="diamante" />
      <PackageGallery images={photos} />
      <div className="container max-w-7xl mx-auto px-4 py-12"><TestimonialsSection /></div>
    </PackagePageLayout>
  );
};

export default PackageDiamante;
