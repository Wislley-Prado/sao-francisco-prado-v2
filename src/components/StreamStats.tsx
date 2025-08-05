
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Radio, 
  Users, 
  Eye, 
  Heart, 
  Clock, 
  Wifi, 
  Activity,
  TrendingUp
} from 'lucide-react';
import { useViewerCount } from '@/hooks/useViewerCount';

const StreamStats = () => {
  const { currentViewers, peakViewers, totalViews } = useViewerCount();
  
  const stats = {
    viewers: currentViewers,
    peakViewers: peakViewers,
    totalViews: totalViews,
    uptime: '2h 34min',
    likes: 248,
    quality: '720p',
    bitrate: '2500 kbps',
    fps: 30,
    connectionQuality: 95
  };

  return (
    <div className="space-y-4">
      {/* Main Stats Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Radio className="h-5 w-5 text-red-500 mr-2 animate-pulse" />
            Estatísticas da Transmissão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Viewers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Users className="h-4 w-4 text-rio-blue mr-1" />
              </div>
              <div className="text-2xl font-bold text-rio-blue">{stats.viewers}</div>
              <div className="text-xs text-gray-600">Assistindo Agora</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.peakViewers}</div>
              <div className="text-xs text-gray-600">Pico de Audiência</div>
            </div>
          </div>

          {/* Quality and Connection */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                Qualidade
              </span>
              <Badge className="bg-blue-100 text-blue-800">
                HD {stats.quality}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center">
                <Activity className="h-4 w-4 mr-1" />
                Taxa de Bits
              </span>
              <span className="font-medium">{stats.bitrate}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center">
                <Wifi className="h-4 w-4 mr-1" />
                Qualidade da Conexão
              </span>
              <div className="flex items-center space-x-2">
                <Progress value={stats.connectionQuality} className="w-16 h-2" />
                <span className="text-sm font-medium text-green-600">
                  {stats.connectionQuality}%
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Tempo Online
              </span>
              <span className="font-medium">{stats.uptime}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                Curtidas
              </span>
              <span className="font-medium text-red-500">{stats.likes}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stream Health */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Activity className="h-5 w-5 text-green-500 mr-2" />
            Saúde da Transmissão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status do Servidor</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Latência</span>
              <span className="text-sm font-medium">2.3s</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Frames Perdidos</span>
              <span className="text-sm font-medium">0.1%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreamStats;
