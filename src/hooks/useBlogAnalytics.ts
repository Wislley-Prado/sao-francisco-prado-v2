import { supabase } from '@/integrations/supabase/client';

interface TrackEventParams {
  postId: string;
  evento: 'click_social' | 'click_banner';
  tipo: string;
}

export const useBlogAnalytics = () => {
  const trackEvent = async ({ postId, evento, tipo }: TrackEventParams) => {
    try {
      const { error } = await supabase
        .from('blog_analytics')
        .insert({
          post_id: postId,
          evento,
          tipo,
          ip_address: null, // Could be collected server-side if needed
          user_agent: navigator.userAgent,
        });

      if (error) {
        console.error('Error tracking event:', error);
      }
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  };

  return { trackEvent };
};
