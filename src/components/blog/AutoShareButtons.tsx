import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Linkedin, Copy, MessageCircle } from 'lucide-react';
import { useBlogAnalytics } from '@/hooks/useBlogAnalytics';
import { toast } from 'sonner';

interface AutoShareButtonsProps {
  postId: string;
  titulo: string;
  url: string;
  resumo?: string;
}

export const AutoShareButtons = ({ postId, titulo, url, resumo }: AutoShareButtonsProps) => {
  const { trackEvent } = useBlogAnalytics();

  const shareText = resumo ? `${titulo} - ${resumo}` : titulo;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(titulo)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${url}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const handleShare = (platform: string, link: string) => {
    trackEvent({
      postId,
      evento: 'click_social',
      tipo: platform,
    });
    window.open(link, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copiado para a área de transferência!');
      trackEvent({
        postId,
        evento: 'click_social',
        tipo: 'copy_link',
      });
    } catch (err) {
      toast.error('Não foi possível copiar o link');
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 border rounded-lg bg-muted/30 my-8">
      <h3 className="font-semibold text-lg">Compartilhe este post</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors"
          onClick={() => handleShare('facebook', shareLinks.facebook)}
          aria-label="Compartilhar no Facebook"
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors"
          onClick={() => handleShare('whatsapp', shareLinks.whatsapp)}
          aria-label="Compartilhar no WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-black hover:text-white hover:border-black transition-colors"
          onClick={() => handleShare('twitter', shareLinks.twitter)}
          aria-label="Compartilhar no Twitter/X"
        >
          <Twitter className="h-4 w-4" />
          Twitter/X
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors"
          onClick={() => handleShare('linkedin', shareLinks.linkedin)}
          aria-label="Compartilhar no LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={handleCopyLink}
          aria-label="Copiar link"
        >
          <Copy className="h-4 w-4" />
          Copiar Link
        </Button>
      </div>
    </div>
  );
};
