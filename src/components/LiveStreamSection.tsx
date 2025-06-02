
import React from 'react';
import StreamPlayer from './StreamPlayer';
import StreamInfo from './StreamInfo';
import StreamControls from './StreamControls';
import ChatBox from './ChatBox';
import StreamStats from './StreamStats';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Waves, Radio, MessageCircle, BarChart3 } from 'lucide-react';

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
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Video Player - Takes more space */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <StreamPlayer />
                <div className="p-4">
                  <StreamControls />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1">
            {/* Mobile Tabs */}
            <div className="lg:hidden">
              <Tabs defaultValue="conditions" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="conditions" className="text-xs">
                    <Waves className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="text-xs">
                    <MessageCircle className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="text-xs">
                    <BarChart3 className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="info" className="text-xs">
                    Info
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="conditions" className="mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Waves className="h-5 w-5 text-rio-blue mr-2" />
                        Condições Atuais
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xl font-bold text-rio-blue">23°C</div>
                          <div className="text-sm text-gray-600">Temperatura</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-xl font-bold text-water-green">Boa</div>
                          <div className="text-sm text-gray-600">Visibilidade</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-xl font-bold text-sunset-orange">5 km/h</div>
                          <div className="text-sm text-gray-600">Vento</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-xl font-bold text-rio-blue">85%</div>
                          <div className="text-sm text-gray-600">Nível</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="chat" className="mt-4">
                  <ChatBox />
                </TabsContent>
                
                <TabsContent value="stats" className="mt-4">
                  <StreamStats />
                </TabsContent>
                
                <TabsContent value="info" className="mt-4">
                  <StreamInfo />
                </TabsContent>
              </Tabs>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block space-y-6">
              <StreamStats />
              <ChatBox />
              
              {/* Quick Conditions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Waves className="h-5 w-5 text-rio-blue mr-2" />
                    Condições Atuais
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm">Temperatura</span>
                      <span className="font-bold text-rio-blue">23°C</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm">Visibilidade</span>
                      <span className="font-bold text-water-green">Boa</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                      <span className="text-sm">Vento</span>
                      <span className="font-bold text-sunset-orange">5 km/h</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm">Nível</span>
                      <span className="font-bold text-rio-blue">85%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveStreamSection;
