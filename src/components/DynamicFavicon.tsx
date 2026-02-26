import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const DynamicFavicon = () => {
  const { data: faviconUrl } = useQuery({
    queryKey: ['favicon-url'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings_public')
        .select('favicon_url')
        .limit(1)
        .single();

      if (error || !data?.favicon_url) return null;
      return data.favicon_url as string;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (!faviconUrl) return;

    // Update all favicon link tags
    const selectors = [
      'link[rel="icon"][type="image/png"]',
      'link[rel="icon"][type="image/x-icon"]',
      'link[rel="apple-touch-icon"]',
      'link[rel="mask-icon"]',
    ];

    selectors.forEach((selector) => {
      const links = document.querySelectorAll<HTMLLinkElement>(selector);
      links.forEach((link) => {
        link.href = faviconUrl;
      });
    });

    // Also update icon links by size
    const sizeLinks = document.querySelectorAll<HTMLLinkElement>('link[rel="icon"][sizes]');
    sizeLinks.forEach((link) => {
      link.href = faviconUrl;
    });

    // Update manifest icons dynamically isn't practical, but the favicon in the tab will change
  }, [faviconUrl]);

  return null;
};

export default DynamicFavicon;
