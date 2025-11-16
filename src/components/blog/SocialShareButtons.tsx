import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useBlogAnalytics } from '@/hooks/useBlogAnalytics';

interface SocialShareButtonsProps {
  postId: string;
  redes_sociais?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export const SocialShareButtons = ({ postId, redes_sociais }: SocialShareButtonsProps) => {
  const { trackEvent } = useBlogAnalytics();

  if (!redes_sociais) return null;

  const hasAnySocial = Object.values(redes_sociais).some(url => url);
  if (!hasAnySocial) return null;

  const handleClick = (platform: string) => {
    trackEvent({
      postId,
      evento: 'click_social',
      tipo: platform,
    });
  };

  return (
    <div className="flex flex-col gap-4 p-6 border rounded-lg bg-muted/30">
      <h3 className="font-semibold text-lg">Compartilhe este post</h3>
      <div className="flex flex-wrap gap-2">
        {redes_sociais.facebook && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <a 
              href={redes_sociais.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Compartilhar no Facebook"
              onClick={() => handleClick('facebook')}
            >
              <Facebook className="h-4 w-4 text-blue-600" />
              Facebook
            </a>
          </Button>
        )}
        
        {redes_sociais.instagram && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <a 
              href={redes_sociais.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Ver no Instagram"
              onClick={() => handleClick('instagram')}
            >
              <Instagram className="h-4 w-4 text-pink-600" />
              Instagram
            </a>
          </Button>
        )}
        
        {redes_sociais.twitter && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <a 
              href={redes_sociais.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Compartilhar no Twitter/X"
              onClick={() => handleClick('twitter')}
            >
              <Twitter className="h-4 w-4 text-blue-400" />
              Twitter/X
            </a>
          </Button>
        )}
        
        {redes_sociais.linkedin && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <a 
              href={redes_sociais.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Compartilhar no LinkedIn"
              onClick={() => handleClick('linkedin')}
            >
              <Linkedin className="h-4 w-4 text-blue-700" />
              LinkedIn
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};
