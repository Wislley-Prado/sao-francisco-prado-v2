
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Loader2, 
  Radio,
  Settings,
  RotateCcw,
  Share2,
  Camera,
  Maximize2
} from 'lucide-react';

const StreamPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [quality, setQuality] = useState('720p');
  const [showControls, setShowControls] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100;
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Transmissão ao Vivo - Rio São Francisco',
        text: 'Veja as condições do rio em tempo real!',
        url: window.location.href,
      });
    }
  };

  const handleCapture = () => {
    console.log('Captura de tela solicitada');
    // Implementar lógica de captura
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const qualityOptions = ['480p', '720p', '1080p'];

  return (
    <div 
      ref={containerRef} 
      className="relative bg-black aspect-video group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
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
        src="https://www.youtube.com/embed/gRDmQvFc6R0"
        title="Rio São Francisco - Transmissão ao Vivo"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onError={(e) => {
          console.log('Erro no iframe YouTube:', e);
          setIsLoading(false);
        }}
        onLoad={() => {
          console.log('YouTube iframe carregado');
          setIsLoading(false);
        }}
      />

      {/* Fallback: Link direto para o YouTube */}
      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
        <div className="text-center text-white bg-black/50 p-6 rounded-lg pointer-events-auto">
          <Radio className="h-12 w-12 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-semibold mb-2">Transmissão ao Vivo</h3>
          <p className="text-sm mb-4">Rio São Francisco</p>
          <a 
            href="https://www.youtube.com/live/gRDmQvFc6R0" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Play className="h-4 w-4 mr-2" />
            Assistir no YouTube
          </a>
        </div>
      </div>

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
          127 assistindo
        </div>
      </div>

      {/* Main Controls Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300 z-20 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Progress Bar (Simulada para Live) */}
        <div className="mb-4">
          <div className="w-full h-1 bg-white/30 rounded">
            <div className="w-full h-1 bg-red-500 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={togglePlay}
              className="text-white hover:bg-white/20 p-2"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleMute}
                className="text-white hover:bg-white/20 p-2"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              
              <div className="w-20">
                <Slider
                  value={volume}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div className="text-white text-sm">
              LIVE
            </div>
          </div>

          {/* Center Controls */}
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCapture}
              className="text-white hover:bg-white/20 p-2"
              title="Capturar Imagem"
            >
              <Camera className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={handleShare}
              className="text-white hover:bg-white/20 p-2"
              title="Compartilhar"
            >
              <Share2 className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={handleReload}
              className="text-white hover:bg-white/20 p-2"
              title="Recarregar Stream"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2">
            <select 
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="text-sm border-0 bg-white/20 text-white rounded px-2 py-1 backdrop-blur-sm"
            >
              {qualityOptions.map(option => (
                <option key={option} value={option} className="text-black">
                  {option}
                </option>
              ))}
            </select>

            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 p-2"
              title="Configurações"
            >
              <Settings className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20 p-2"
              title="Tela Cheia"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Click to Play Overlay */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Button
            size="lg"
            onClick={togglePlay}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 backdrop-blur-sm"
          >
            <Play className="h-8 w-8 mr-2" />
            Reproduzir
          </Button>
        </div>
      )}
    </div>
  );
};

export default StreamPlayer;
