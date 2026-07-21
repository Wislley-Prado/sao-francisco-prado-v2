import { useState, useEffect, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { getOriginalUrl } from '@/lib/imageUtils';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  fallbackClassName,
  loading = 'lazy',
  ...props
}: OptimizedImageProps) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [hasFallenBack, setHasFallenBack] = useState(false);

  // Sincroniza o estado caso a prop 'src' mude
  useEffect(() => {
    setCurrentSrc(src);
    setLoaded(false);
    setError(false);
    setHasFallenBack(false);
  }, [src]);

  const handleError = () => {
    // Se o carregamento falhou e ainda não tentamos o fallback, tentamos a URL original
    if (!hasFallenBack && src) {
      const original = getOriginalUrl(src);
      if (currentSrc !== original) {
        setCurrentSrc(original);
        setHasFallenBack(true);
        return;
      }
    }
    // Se já falhou o fallback ou não há URL original diferente, marca como erro geral
    setError(true);
  };

  if (error) {
    return (
      <div
        className={cn(
          'bg-gradient-to-br from-primary/20 to-primary/5',
          fallbackClassName || className
        )}
      />
    );
  }

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <Skeleton className={cn('absolute inset-0', className)} />
      )}
      <img
        src={currentSrc}
        alt={alt || ''}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        {...props}
      />
    </div>
  );
};
