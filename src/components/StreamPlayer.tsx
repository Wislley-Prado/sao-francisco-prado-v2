
import React, { useState } from 'react';
import { Loader2, Radio } from 'lucide-react';
import { useViewerCount } from '@/hooks/useViewerCount';

const StreamPlayer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [quality] = useState('720p');
  const { currentViewers } = useViewerCount();

  return (
    <div className="relative bg-black aspect-video">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-center text-white">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">Carregando transmissão...</p>
          </div>
        </div>
      )}

      {/* YouTube Live Stream */}
      <iframe
        className="w-full h-full"
        src="https://www.youtube.com/embed/GxvF8F7Vds4?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&showinfo=0&enablejsapi=1"
        title="Rio São Francisco - Transmissão ao Vivo"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={() => {
          console.log('YouTube iframe carregado com sucesso');
          setIsLoading(false);
        }}
      />

      {/* Live Badge */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
          AO VIVO
        </div>
      </div>

      {/* Quality Badge */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          HD {quality}
        </div>
      </div>

      {/* Viewer Count */}
      <div className="absolute top-16 right-4 z-20">
        <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center">
          <Radio className="h-3 w-3 mr-1" />
          {currentViewers} assistindo
        </div>
      </div>
    </div>
  );
};

export default StreamPlayer;
