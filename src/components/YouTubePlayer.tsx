import { useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubePlayerProps {
  videoUrl: string;
  title?: string;
  className?: string;
}

export const YouTubePlayer = ({ videoUrl, title = 'Vídeo', className = '' }: YouTubePlayerProps) => {

  // Extrair ID do vídeo de diferentes formatos de URL do YouTube
  const getVideoId = (url: string): string | null => {
    if (!url) return null;

    // youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];

    // youtube.com/shorts/VIDEO_ID
    const shortsMatch = url.match(/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) return shortsMatch[1];

    // youtube.com/live/VIDEO_ID
    const liveMatch = url.match(/(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/);
    if (liveMatch) return liveMatch[1];

    // youtu.be/VIDEO_ID
    const youtuBeMatch = url.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (youtuBeMatch) return youtuBeMatch[1];

    return null;
  };

  // Verificar se é um Short
  const isShorts = videoUrl.includes('/shorts/');

  const videoId = getVideoId(videoUrl);

  if (!videoId) {
    return (
      <div className={`rounded-lg bg-muted flex items-center justify-center p-8 ${className}`}>
        <p className="text-muted-foreground">Vídeo inválido</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div 
        className={`relative overflow-hidden rounded-lg shadow-lg ${
          isShorts ? 'aspect-[9/16] max-w-[400px] mx-auto' : 'aspect-video'
        }`}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {/* Badge de Shorts */}
        {isShorts && (
          <div className="absolute top-4 left-4 bg-red-600 pointer-events-none text-white px-3 py-1 rounded-full text-xs font-semibold">
            Shorts
          </div>
        )}
      </div>

      {/* Título do vídeo (opcional) */}
      {title && (
        <div className="mt-3">
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
        </div>
      )}
    </div>
  );
};

// Componente simplificado para preview no admin
export const YouTubePreview = ({ videoUrl, className = '' }: { videoUrl: string; className?: string }) => {
  const getVideoId = (url: string): string | null => {
    if (!url) return null;
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];
    const shortsMatch = url.match(/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) return shortsMatch[1];
    const liveMatch = url.match(/(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/);
    if (liveMatch) return liveMatch[1];
    const youtuBeMatch = url.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (youtuBeMatch) return youtuBeMatch[1];
    return null;
  };

  const isShorts = videoUrl.includes('/shorts/');
  const videoId = getVideoId(videoUrl);

  if (!videoId) {
    return (
      <div className={`rounded-lg bg-muted flex items-center justify-center p-4 ${className}`}>
        <p className="text-sm text-muted-foreground">Preview não disponível</p>
      </div>
    );
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  return (
    <div className={`relative ${className}`}>
      <div className={`relative overflow-hidden rounded-lg border ${
        isShorts ? 'aspect-[9/16] max-w-[200px]' : 'aspect-video'
      }`}>
        <img
          src={thumbnailUrl}
          alt="Preview do vídeo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <Play className="w-8 h-8 text-white fill-white" />
        </div>
        {isShorts && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
            Shorts
          </div>
        )}
      </div>
    </div>
  );
};
