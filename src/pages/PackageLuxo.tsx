import { useEffect } from 'react';
import { Crown, Utensils, Fish, Car, Users, Bed, Wifi, Camera } from 'lucide-react';
import { PackagePageLayout } from '@/components/packages/PackagePageLayout';
import { PackageHero } from '@/components/packages/PackageHero';
import { PackageQuickInfo } from '@/components/packages/PackageQuickInfo';
import { PackagePricing } from '@/components/packages/PackagePricing';
import { PackageFeatures } from '@/components/packages/PackageFeatures';
import { PackageGallery } from '@/components/packages/PackageGallery';
import { PackageAbout } from '@/components/packages/PackageAbout';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { PacoteFAQs } from '@/components/PacoteFAQs';
import ranchoImage1 from '@/assets/gallery/rancho-prado-aldeia.jpg';

const photos = [{ url: ranchoImage1, alt: 'Rancho' }];
const features = [
  { icon: Crown, title: 'Hospedagem Luxo', description: 'Premium' },
  { icon: Utensils, title: 'Gastronomia', description: 'Chef particular' },
  { icon: Fish, title: 'Equipamentos', description: 'Top de linha' },
  { icon: Car, title: 'Transporte', description: 'Executivo' },
  { icon: Users, title: 'Guias', description: 'Experientes' },
  { icon: Bed, title: 'Suítes', description: 'Confortáveis' },
  { icon: Wifi, title: 'Wi-Fi', description: 'Premium' },
  { icon: Camera, title: 'Fotos', description: 'Profissionais' },
];

const PackageLuxo = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const handleCtaClick = () => window.open(`https://wa.me/5538998101673?text=${encodeURIComponent('Olá! Informações sobre Pacote Luxo.')}`, '_blank');

  return (
    <PackagePageLayout sidebar={<PackagePricing price={2499} installments={{ count: 10, value: 249.90 }} discount={10} tier="luxo" spotsLeft={2} onReserveClick={handleCtaClick} onWhatsAppClick={handleCtaClick} />}>
      <PackageHero title="Pacote Luxo" subtitle="Experiência premium" imageUrl={ranchoImage1} rating={5.0} reviewsCount={89} badge="destaque" tier="luxo" onCtaClick={handleCtaClick} />
      <PackageQuickInfo duration="5 dias / 4 noites" people={6} location="Prado-Aldeia, MG" price="10x de R$ 249,90" />
      <PackageAbout description="Luxo e conforto." highlights={['Premium', 'Chef', 'Exclusivo']} />
      <PackageFeatures features={features} tier="luxo" />
      <PackageGallery images={photos} />
      <div className="container max-w-7xl mx-auto px-4 py-12"><TestimonialsSection /></div>
    </PackagePageLayout>
  );
};

export default PackageLuxo;
