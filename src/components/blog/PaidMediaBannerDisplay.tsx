import React from 'react';
import { ExternalLink } from 'lucide-react';

interface PaidMediaBannerDisplayProps {
  banner_midia_paga?: {
    imagem_url?: string;
    link_anunciante?: string;
    alt_text?: string;
  } | null;
}

export const PaidMediaBannerDisplay = ({ banner_midia_paga }: PaidMediaBannerDisplayProps) => {
  if (!banner_midia_paga?.imagem_url) return null;

  const BannerContent = () => (
    <div className="relative group overflow-hidden rounded-lg border">
      <img
        src={banner_midia_paga.imagem_url}
        alt={banner_midia_paga.alt_text || 'Banner publicitário'}
        className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      {banner_midia_paga.link_anunciante && (
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs flex items-center gap-1 text-muted-foreground">
          <ExternalLink className="h-3 w-3" />
          <span>Anúncio</span>
        </div>
      )}
    </div>
  );

  if (banner_midia_paga.link_anunciante) {
    return (
      <a
        href={banner_midia_paga.link_anunciante}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block my-8"
        aria-label={`Anúncio: ${banner_midia_paga.alt_text || 'Clique para saber mais'}`}
      >
        <BannerContent />
      </a>
    );
  }

  return (
    <div className="my-8">
      <BannerContent />
    </div>
  );
};
