import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Linkedin, Copy, MessageCircle, Instagram, Check } from 'lucide-react';
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
  const [copied, setCopied] = React.useState(false);

  const shareText = resumo ? `${titulo} - ${resumo}` : titulo;

  // Use direct production URL for all sharing links
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

  const handleInstagramShare = () => {
    // Instagram doesn't have a direct share URL, so we copy the link and notify user
    handleCopyLink();
    toast.info('Link copiado! Cole no Instagram para compartilhar.');
    trackEvent({
      postId,
      evento: 'click_social',
      tipo: 'instagram',
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copiado para a área de transferência!');
      trackEvent({
        postId,
        evento: 'click_social',
        tipo: 'copy_link',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        toast.success('Link copiado para a área de transferência!');
        trackEvent({
          postId,
          evento: 'click_social',
          tipo: 'copy_link',
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        toast.error('Não foi possível copiar o link');
      }
      document.body.removeChild(textArea);
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
          className="gap-2 hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white hover:border-transparent transition-colors"
          onClick={handleInstagramShare}
          aria-label="Compartilhar no Instagram"
        >
          <Instagram className="h-4 w-4" />
          Instagram
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
          className={`gap-2 transition-colors ${copied ? 'bg-green-500 text-white border-green-500' : 'hover:bg-primary hover:text-primary-foreground'}`}
          onClick={handleCopyLink}
          aria-label="Copiar link"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copiado!' : 'Copiar Link'}
        </Button>
      </div>
    </div>
  );
};
