import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const updateLink = (rel: string, href: string, sizes?: string, type?: string) => {
  let selector = `link[rel="${rel}"]`;
  if (sizes) selector += `[sizes="${sizes}"]`;

  let link = document.querySelector(selector) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    if (sizes) link.setAttribute('sizes', sizes);
    document.head.appendChild(link);
  }
  if (type) link.type = type;
  link.href = href;
};

interface FaviconSettings {
  favicon_url: string | null;
  pwa_icon_url: string | null;
}

export const DynamicFavicon = () => {
  const { data: settings } = useQuery({
    queryKey: ['site-settings-favicon'],
    queryFn: async () => {
      const { data } = await supabase
        .from('site_settings_public')
        .select('favicon_url, pwa_icon_url')
        .limit(1)
        .single();
      return data;
    },
    staleTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    if (!settings) return;

    if (settings.favicon_url) {
      updateLink('icon', settings.favicon_url, undefined, 'image/png');
      updateLink('icon', settings.favicon_url, '32x32', 'image/png');
      updateLink('icon', settings.favicon_url, '16x16', 'image/png');
      updateLink('apple-touch-icon', settings.favicon_url);
    }

    const typedSettings = settings as FaviconSettings;
    if (typedSettings.pwa_icon_url) {
      updateLink('icon', typedSettings.pwa_icon_url, '192x192', 'image/png');
    }
  }, [settings]);

  return null;
};
