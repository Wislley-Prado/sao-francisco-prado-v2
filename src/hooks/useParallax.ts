import { useEffect, useState, useRef, useCallback } from 'react';

interface UseParallaxOptions {
  speed?: number;
}

export const useParallax = (options: UseParallaxOptions = {}) => {
  const { speed = 0.5 } = options;
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastScrollRef = useRef(0);

  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
      const currentScroll = window.pageYOffset;
      if (currentScroll !== lastScrollRef.current) {
        lastScrollRef.current = currentScroll;
        setOffset(currentScroll * speed);
      }
      rafRef.current = null;
    });
  }, [speed]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  return offset;
};
