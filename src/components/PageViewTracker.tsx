import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Facebook Pixel - dispara PageView a cada mudança de rota
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }

    // Google Analytics GA4 - dispara page_view a cada mudança de rota
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
        page_location: window.location.href,
      });
    }

    // Google Tag Manager - envia evento pageview para o dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'pageview',
        page: location.pathname,
        pageTitle: document.title,
      });
    }
  }, [location.pathname]);

  return null;
};

export default PageViewTracker;
