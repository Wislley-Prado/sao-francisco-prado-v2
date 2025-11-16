import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useBlogAnalytics } from '@/hooks/useBlogAnalytics';

// Função para processar formatação básica (negrito e itálico)
const parseFormattedText = (text: string) => {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  let key = 0;

  // Regex para capturar **negrito** e *itálico*
  const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Adiciona texto antes do match
    if (match.index > currentIndex) {
      parts.push(text.substring(currentIndex, match.index));
    }

    // Verifica se é negrito ou itálico
    if (match[1]) {
      // Negrito **texto**
      parts.push(<strong key={`bold-${key++}`}>{match[2]}</strong>);
    } else if (match[3]) {
      // Itálico *texto*
      parts.push(<em key={`italic-${key++}`}>{match[4]}</em>);
    }

    currentIndex = match.index + match[0].length;
  }

  // Adiciona texto restante
  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }

  return parts.length > 0 ? parts : text;
};

interface PaidMediaBannerDisplayProps {
  postId: string;
  banner_midia_paga?: {
    imagem_url?: string;
    link_anunciante?: string;
    alt_text?: string;
    data_inicio?: string;
    data_fim?: string;
  } | null;
}

export const PaidMediaBannerDisplay = ({ postId, banner_midia_paga }: PaidMediaBannerDisplayProps) => {
  const { trackEvent } = useBlogAnalytics();

  if (!banner_midia_paga?.imagem_url) return null;

  // Verifica se a campanha está ativa baseado nas datas
  const now = new Date();
  const dataInicio = banner_midia_paga.data_inicio ? new Date(banner_midia_paga.data_inicio) : null;
  const dataFim = banner_midia_paga.data_fim ? new Date(banner_midia_paga.data_fim) : null;

  // Se tem data de início e ainda não começou, não exibe
  if (dataInicio && now < dataInicio) return null;
  
  // Se tem data de fim e já passou, não exibe
  if (dataFim && now > dataFim) return null;

  const handleClick = () => {
    trackEvent({
      postId,
      evento: 'click_banner',
      tipo: 'paid_media',
    });
  };

  const BannerContent = () => (
    <figure className="space-y-2">
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
      {banner_midia_paga.alt_text && (
        <figcaption className="text-sm text-muted-foreground text-center">
          {parseFormattedText(banner_midia_paga.alt_text)}
        </figcaption>
      )}
    </figure>
  );

  if (banner_midia_paga.link_anunciante) {
    return (
      <a
        href={banner_midia_paga.link_anunciante}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block my-8"
        aria-label={`Anúncio: ${banner_midia_paga.alt_text || 'Clique para saber mais'}`}
        onClick={handleClick}
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
