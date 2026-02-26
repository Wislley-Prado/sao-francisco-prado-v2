import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface LazyRenderProps {
  children: ReactNode;
  rootMargin?: string;
  fallback?: ReactNode;
}

const LazyRender: React.FC<LazyRenderProps> = ({ 
  children, 
  rootMargin = '200px',
  fallback = null 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  if (isVisible) return <>{children}</>;

  return (
    <div ref={ref} style={{ minHeight: '100px' }}>
      {fallback}
    </div>
  );
};

export default LazyRender;
