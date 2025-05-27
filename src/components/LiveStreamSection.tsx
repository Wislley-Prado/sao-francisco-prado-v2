
import React from 'react';
import StreamPlayer from './StreamPlayer';
import StreamInfo from './StreamInfo';
import StreamControls from './StreamControls';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Waves, Radio } from 'lucide-react';

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

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <StreamPlayer />
                <div className="p-4">
                  <StreamControls />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Information */}
          <div className="space-y-6">
            <StreamInfo />
            
            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Waves className="h-5 w-5 text-rio-blue mr-2" />
                  Condições Atuais
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-rio-blue">23°C</div>
                    <div className="text-sm text-gray-600">Temperatura</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-water-green">Boa</div>
                    <div className="text-sm text-gray-600">Visibilidade</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-sunset-orange">5 km/h</div>
                    <div className="text-sm text-gray-600">Vento</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-rio-blue">85%</div>
                    <div className="text-sm text-gray-600">Nível</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveStreamSection;
