import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Linkedin, Copy, MessageCircle, Instagram, Check, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { SITE_CONFIG } from '@/lib/constants';

interface ShareButtonsProps {
  titulo: string;
  url: string;
  descricao?: string;
  onShare?: (platform: string) => void;
}

// Generate OG proxy URL for better social media previews using production domain
const getOgProxyUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    
    // Always use production domain for OG proxy
    return `https://zeqloqlhnbdeivnyghkx.supabase.co/functions/v1/og-proxy?path=${encodeURIComponent(path)}&baseUrl=${encodeURIComponent(SITE_CONFIG.PRODUCTION_DOMAIN)}`;
  } catch {
    return url;
  }
};

export const ShareButtons = ({ titulo, url, descricao, onShare }: ShareButtonsProps) => {
  const [copied, setCopied] = React.useState(false);

  const shareText = descricao ? `${titulo} - ${descricao}` : titulo;
  
  // Use OG proxy URL for social platforms that need rich previews
  const ogUrl = getOgProxyUrl(url);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ogUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(titulo)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${ogUrl}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(ogUrl)}`,
  };

  const handleShare = (platform: string, link: string) => {
    onShare?.(platform);
    window.open(link, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleInstagramShare = () => {
    handleCopyLink();
    toast.info('Link copiado! Cole no Instagram para compartilhar.');
    onShare?.('instagram');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copiado para a área de transferência!');
      onShare?.('copy_link');
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
        onShare?.('copy_link');
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        toast.error('Não foi possível copiar o link');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 border rounded-lg bg-muted/30">
      <div className="flex items-center gap-2">
        <Share2 className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Compartilhe</h3>
      </div>
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
