
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Waves, Radio, Play, ExternalLink, Camera, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const LiveStreamSection = () => {
  return (
    <section id="live" className="py-16 bg-gradient-to-br from-rio-blue/5 to-water-green/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Radio className="h-8 w-8 text-rio-blue mr-3 animate-pulse" />
            <Badge className="bg-red-500 text-white animate-pulse">
              AO VIVO
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transmissão ao Vivo
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Acompanhe as condições do Rio São Francisco em tempo real. 
            Veja como está o movimento dos peixes e planeje sua pescaria.
          </p>
        </div>

        {/* Preview Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Preview Image/Placeholder */}
              <div className="relative bg-gradient-to-br from-rio-blue to-water-green aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="h-16 w-16 mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-2">Rio São Francisco - Ao Vivo</h3>
                  <p className="text-lg opacity-90 mb-6">Transmissão em tempo real das condições do rio</p>
                  
                  {/* Live Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      AO VIVO
                    </div>
                  </div>

                  {/* Quality Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      HD 720p
                    </div>
                  </div>

                  {/* Play Button Overlay */}
                  <Link to="/live">
                    <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 backdrop-blur-sm">
                      <Play className="h-6 w-6 mr-2 fill-current" />
                      Assistir Transmissão
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Current Stats */}
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-5 w-5 text-rio-blue mr-2" />
                      <span className="font-semibold">127 assistindo</span>
                    </div>
                    <p className="text-sm text-gray-600">Espectadores online</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-5 w-5 text-water-green mr-2" />
                      <span className="font-semibold">2h 34min</span>
                    </div>
                    <p className="text-sm text-gray-600">Tempo ao vivo</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Waves className="h-5 w-5 text-sunset-orange mr-2" />
                      <span className="font-semibold">Condições ideais</span>
                    </div>
                    <p className="text-sm text-gray-600">Para pesca</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Link to="/live" className="flex-1">
                    <Button className="w-full bg-rio-blue hover:bg-rio-blue/80">
                      <Play className="h-5 w-5 mr-2" />
                      Assistir Agora
                    </Button>
                  </Link>
                  
                  <Link to="/live" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Página Completa
                    </Button>
                  </Link>
                </div>

                {/* Quick Conditions Preview */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Waves className="h-4 w-4 text-rio-blue mr-2" />
                    Condições Atuais
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-rio-blue">23°C</div>
                      <div className="text-xs text-gray-600">Temperatura</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-water-green">Boa</div>
                      <div className="text-xs text-gray-600">Visibilidade</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-sunset-orange">5 km/h</div>
                      <div className="text-xs text-gray-600">Vento</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-rio-blue">85%</div>
                      <div className="text-xs text-gray-600">Nível</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LiveStreamSection;
