import { useState, lazy, Suspense } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageIcon } from 'lucide-react';

const Carousel = lazy(() => import('@/components/ui/carousel').then(module => ({
  default: module.Carousel
})));

interface PackageGalleryProps {
  images: { url: string; alt?: string }[];
  initialVisible?: number;
}

export const PackageGallery = ({ images, initialVisible = 6 }: PackageGalleryProps) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const visibleImages = showAll ? images : images.slice(0, initialVisible);
  const remainingCount = images.length - initialVisible;

  return (
    <section className="py-12 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Galeria de Fotos
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {visibleImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-video overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image.url}
                alt={image.alt || `Foto ${index + 1}`}
                loading={index < 6 ? 'eager' : 'lazy'}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}
        </div>

        {!showAll && remainingCount > 0 && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(true)}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
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
