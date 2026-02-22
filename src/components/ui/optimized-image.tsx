import { useState, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

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
        src={src}
        alt={alt || ''}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
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
