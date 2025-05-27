
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Calendar, MapPin, Waves } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen bg-river-gradient flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] animate-wave"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Sua experiência de pesca no{' '}
                <span className="text-sand-beige">Rio São Francisco</span>{' '}
                começa aqui!
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Ranchos exclusivos, pacotes de pesca personalizados e a melhor estrutura 
                às margens do Rio São Francisco em Três Marias/MG.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-sunset-orange hover:bg-orange-600 text-white text-lg px-8 py-4 animate-float"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Fazer Reserva
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white hover:text-rio-blue text-lg px-8 py-4"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Ver Localização
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full p-3 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                  <Waves className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm font-medium">Transmissão Ao Vivo</p>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full p-3 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm font-medium">Calendário Lunar</p>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full p-3 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm font-medium">Dados em Tempo Real</p>
              </div>
            </div>
          </div>

          {/* Right Content - Live Stream */}
          <div className="animate-fade-in">
            <Card className="bg-white bg-opacity-10 backdrop-blur-md border-white border-opacity-20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-xl font-semibold">
                      Rio São Francisco - Ao Vivo
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm">LIVE</span>
                    </div>
                  </div>
                  
                  {/* Live Stream Placeholder */}
                  <div className="aspect-video bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="h-16 w-16 mx-auto mb-4 opacity-80" />
                      <p className="text-lg font-medium">Transmissão do Rio São Francisco</p>
                      <p className="text-sm opacity-80">Condições atuais da pesca</p>
                    </div>
                  </div>

                  {/* Live Info */}
                  <div className="grid grid-cols-2 gap-4 text-white text-sm">
                    <div>
                      <p className="opacity-80">Temperatura da Água</p>
                      <p className="font-semibold">24°C</p>
                    </div>
                    <div>
                      <p className="opacity-80">Nível da Represa</p>
                      <p className="font-semibold">86%</p>
                    </div>
                    <div>
                      <p className="opacity-80">Condições</p>
                      <p className="font-semibold text-nature-400">Excelente</p>
                    </div>
                    <div>
                      <p className="opacity-80">Vento</p>
                      <p className="font-semibold">12 km/h</p>
                    </div>
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

export default HeroSection;
