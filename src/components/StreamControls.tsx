
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Share2, 
  Camera, 
  Settings, 
  MessageCircle, 
  Heart, 
  Users,
  Download
} from 'lucide-react';

const StreamControls = () => {
  const [liked, setLiked] = useState(false);
  const [quality, setQuality] = useState('720p');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Transmissão ao Vivo - Rio São Francisco',
        text: 'Acompanhe as condições do rio em tempo real no PradoAqui',
        url: window.location.href,
      });
    } else {
      // Fallback para cópia do link
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const qualityOptions = ['480p', '720p', '1080p'];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Left Side - Interaction */}
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleLike}
          className={`${liked ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
        >
          <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
          {liked ? '248' : '247'}
        </Button>

        <Button size="sm" variant="outline">
          <MessageCircle className="h-4 w-4 mr-1" />
          Chat
        </Button>

        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-1" />
          127 assistindo
        </div>
      </div>

      {/* Right Side - Controls */}
      <div className="flex items-center space-x-2">
        <Button size="sm" variant="outline">
          <Camera className="h-4 w-4 mr-1" />
          Capturar
        </Button>

        <Button size="sm" variant="outline">
          <Download className="h-4 w-4 mr-1" />
          Salvar
        </Button>

        <Button size="sm" variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-1" />
          Compartilhar
        </Button>

        <div className="flex items-center space-x-1">
          <Settings className="h-4 w-4 text-gray-500" />
          <select 
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="text-sm border rounded px-2 py-1 bg-white"
          >
            {qualityOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StreamControls;
