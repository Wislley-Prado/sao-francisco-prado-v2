import React, { useState, useEffect, useRef } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  id?: string;
}

/**
 * LazySection - Only renders children when the section scrolls into view.
 * Uses IntersectionObserver to defer below-fold content, reducing initial DOM nodes.
 */
const LazySection: React.FC<LazySectionProps> = ({ 
  children, 
  fallback = null,
  rootMargin = '200px',
  id
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    try {
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
    } catch (e) {
      setIsVisible(true);
    }
  }, [rootMargin]);

  return (
    <div ref={ref} id={id}>
      {isVisible ? children : fallback}
    </div>
  );
};

export default LazySection;
