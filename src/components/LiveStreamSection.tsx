import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Radio, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const LiveStreamSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-blue-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Transmissão ao Vivo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Acompanhe as condições do Rio São Francisco em tempo real
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <CardTitle className="flex items-center justify-center">
                <Radio className="h-5 w-5 mr-2 animate-pulse" />
                Rio São Francisco - Ao Vivo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative bg-black aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/gRDmQvFc6R0?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&showinfo=0&enablejsapi=1"
                  title="Rio São Francisco - Transmissão ao Vivo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
                
                {/* Live Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    AO VIVO
                  </div>
                </div>
              </div>
              
              <div className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Veja as condições do rio, pescarias em tempo real e muito mais!
                </p>
                <Link to="/live">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                    <Play className="h-5 w-5 mr-2" />
                    Ver Transmissão Completa
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LiveStreamSection;