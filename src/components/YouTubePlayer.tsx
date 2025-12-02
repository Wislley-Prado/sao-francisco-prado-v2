import { useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubePlayerProps {
  videoUrl: string;
  title?: string;
  className?: string;
}

export const YouTubePlayer = ({ videoUrl, title = 'Vídeo', className = '' }: YouTubePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extrair ID do vídeo de diferentes formatos de URL do YouTube
  const getVideoId = (url: string): string | null => {
    if (!url) return null;

    // youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];

    // youtube.com/shorts/VIDEO_ID
    const shortsMatch = url.match(/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) return shortsMatch[1];

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

  // URL da thumbnail de alta qualidade
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  
  // URL do embed
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className={`relative w-full ${className}`}>
      <div 
        className={`relative overflow-hidden ${
          isShorts ? 'aspect-[9/16] max-w-[400px] mx-auto rounded-xl' : 'aspect-video'
        }`}
      >
        {!isPlaying ? (
          <>
            {/* Thumbnail com overlay cinematográfico */}
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            
            {/* Overlay gradiente cinematográfico */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
            
            {/* Botão de play premium com animação */}
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center group/play"
              aria-label={`Reproduzir ${title}`}
            >
              {/* Círculos de pulse animados */}
              <div className="absolute w-28 h-28 md:w-36 md:h-36 rounded-full bg-red-500/20 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full bg-red-500/30 animate-pulse" />
              
              {/* Botão principal */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 flex items-center justify-center transform transition-all duration-300 group-hover/play:scale-110 shadow-2xl shadow-red-500/50">
                <Play className="w-10 h-10 md:w-12 md:h-12 text-white fill-white ml-1" />
              </div>
            </button>

            {/* Info badges premium */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Vídeo Exclusivo
              </div>
              <div className="bg-white/90 backdrop-blur-sm text-red-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.2c-.3-1-1-1.8-2-2C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.5.5c-1 .3-1.7 1-2 2C0 8.1 0 12 0 12s0 3.9.5 5.8c.3 1 1 1.8 2 2 1.9.5 9.5.5 9.5.5s7.6 0 9.5-.5c1-.3 1.7-1 2-2 .5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8z"/>
                  <polygon fill="white" points="9.5,15.5 15.5,12 9.5,8.5"/>
                </svg>
                YouTube
              </div>
            </div>

            {/* Badge de Shorts */}
            {isShorts && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.77 10.32l-1.2-.5L18 9.06a3.74 3.74 0 00-3.5-6.62L6 6.94a3.74 3.74 0 00.23 6.74l1.2.49-1.52.76a3.74 3.74 0 003.5 6.62l8.5-4.5a3.74 3.74 0 00-.14-6.73zM10 14.65v-5.3L15 12l-5 2.65z"/>
                </svg>
                Shorts
              </div>
            )}
          </>
        ) : (
          /* Player do YouTube com fade-in */
          <div className="w-full h-full animate-fade-in">
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
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
