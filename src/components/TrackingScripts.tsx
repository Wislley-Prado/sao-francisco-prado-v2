/**
 * TrackingScripts - Carrega scripts de tracking apenas para admins autenticados.
 * 
 * A tabela site_settings_public NÃO expõe facebook_pixel, google_analytics,
 * google_tag_manager, nem custom_head_scripts (campos sensíveis).
 * Portanto, este componente só funciona para admins autenticados que têm
 * acesso à tabela site_settings via RLS.
 * 
 * Para visitantes anônimos, o componente não faz nenhum request.
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DOMPurify from 'dompurify';

interface TrackingSettings {
  facebook_pixel: string;
  google_analytics: string;
  google_tag_manager: string;
  custom_head_scripts: string;
}

const EMPTY_SETTINGS: TrackingSettings = {
  facebook_pixel: '',
  google_analytics: '',
  google_tag_manager: '',
  custom_head_scripts: ''
};

const TrackingScripts = () => {
  const [scripts, setScripts] = useState<TrackingSettings>(EMPTY_SETTINGS);

  useEffect(() => {
    const fetchSettings = async () => {
      // Só buscar tracking scripts se o usuário estiver autenticado (admin)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return; // Visitante anônimo - não faz request

      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('facebook_pixel, google_analytics, google_tag_manager, custom_head_scripts')
          .single();

        if (error || !data) return;

        setScripts({
          facebook_pixel: data.facebook_pixel || '',
          google_analytics: data.google_analytics || '',
          google_tag_manager: data.google_tag_manager || '',
          custom_head_scripts: data.custom_head_scripts || ''
        });
      } catch {
        // Silenciar erros - não é crítico
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    // Facebook Pixel
    if (scripts.facebook_pixel) {
      const fbScript = document.createElement('script');
      fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${scripts.facebook_pixel}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbScript);

      const fbNoscript = document.createElement('noscript');
      const fbImg = document.createElement('img');
      fbImg.height = 1;
      fbImg.width = 1;
      fbImg.style.display = 'none';
      fbImg.src = `https://www.facebook.com/tr?id=${scripts.facebook_pixel}&ev=PageView&noscript=1`;
      fbNoscript.appendChild(fbImg);
      document.body.appendChild(fbNoscript);
    }

    // Google Analytics (GA4)
    if (scripts.google_analytics) {
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${scripts.google_analytics}`;
      document.head.appendChild(gaScript);

      const gaConfigScript = document.createElement('script');
      gaConfigScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${scripts.google_analytics}');
      `;
      document.head.appendChild(gaConfigScript);
    }

    // Google Tag Manager
    if (scripts.google_tag_manager) {
      const gtmScript = document.createElement('script');
      gtmScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${scripts.google_tag_manager}');
      `;
      document.head.appendChild(gtmScript);

      const gtmNoscript = document.createElement('noscript');
      const gtmIframe = document.createElement('iframe');
      gtmIframe.src = `https://www.googletagmanager.com/ns.html?id=${scripts.google_tag_manager}`;
      gtmIframe.height = '0';
      gtmIframe.width = '0';
      gtmIframe.style.display = 'none';
      gtmIframe.style.visibility = 'hidden';
      gtmNoscript.appendChild(gtmIframe);
      document.body.insertBefore(gtmNoscript, document.body.firstChild);
    }

    // Scripts personalizados (sanitizados)
    if (scripts.custom_head_scripts) {
      const customDiv = document.createElement('div');
      const sanitizedHTML = DOMPurify.sanitize(scripts.custom_head_scripts, {
        ADD_TAGS: ['script', 'style', 'link'],
        ADD_ATTR: ['src', 'href', 'rel', 'type', 'async', 'defer'],
        ALLOW_DATA_ATTR: false
      });
      customDiv.innerHTML = sanitizedHTML;
      Array.from(customDiv.children).forEach((element) => {
        document.head.appendChild(element.cloneNode(true));
      });
    }
  }, [scripts]);

  return null;
};

export default TrackingScripts;
