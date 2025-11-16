import { useEffect, useState } from 'react';

interface UseParallaxOptions {
  speed?: number;
}

export const useParallax = (options: UseParallaxOptions = {}) => {
  const { speed = 0.5 } = options;
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offset;
};
