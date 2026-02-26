import { useState, lazy, Suspense } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageIcon, Camera } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { getOptimizedUrl, getOriginalUrl } from '@/lib/imageUtils';

const Carousel = lazy(() => import('@/components/ui/carousel').then(module => ({
  default: module.Carousel
})));

interface PackageGalleryProps {
  images: { url: string; alt?: string }[];
  initialVisible?: number;
}

const GalleryImage = ({ image, index, onClick }: { image: { url: string; alt?: string }; index: number; onClick: () => void }) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      }`}
      style={{ transitionDelay: `${(index % 6) * 80}ms` }}
    >
      <div
        className="relative aspect-video overflow-hidden rounded-xl cursor-pointer group shadow-lg hover:shadow-2xl transition-all"
        onClick={onClick}
      >
        <img
          src={getOptimizedUrl(image.url, index < 6 ? 600 : 400)}
          alt={image.alt || `Foto ${index + 1}`}
          loading={index < 6 ? 'eager' : 'lazy'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Camera className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
      </div>
    </div>
  );
};

export const PackageGallery = ({ images, initialVisible = 6 }: PackageGalleryProps) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal({ threshold: 0.5 });

  const visibleImages = showAll ? images : images.slice(0, initialVisible);
  const remainingCount = images.length - initialVisible;

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-7xl mx-auto px-4">
        <div
          ref={titleRef}
          className={`text-center mb-12 transition-all duration-700 ${
            titleVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Galeria de Fotos
          </h2>
          <p className="text-muted-foreground text-lg">
            Veja os momentos incríveis que te esperam
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {visibleImages.map((image, index) => (
            <GalleryImage
              key={index}
              image={image}
              index={index}
              onClick={() => setSelectedImage(index)}
            />
          ))}
        </div>

        {!showAll && remainingCount > 0 && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(true)}
              className="shadow-lg hover:shadow-xl transition-all"
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              Ver mais {remainingCount} fotos
            </Button>
          </div>
        )}

        {/* Modal de Imagem */}
        <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-5xl p-0">
            <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
              {selectedImage !== null && (
                <img
                  src={images[selectedImage].url}
                  alt={images[selectedImage].alt || `Foto ${selectedImage + 1}`}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              )}
            </Suspense>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
