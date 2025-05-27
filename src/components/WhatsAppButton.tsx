
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, X, Phone, Clock } from 'lucide-react';

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const whatsappNumber = "5531999999999"; // Replace with actual number
  const message = "Olá! Gostaria de saber mais sobre os pacotes de pesca no PradoAqui.";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const quickMessages = [
    {
      text: "Quero fazer uma reserva",
      message: "Olá! Gostaria de fazer uma reserva para pesca no Rio São Francisco."
    },
    {
      text: "Consultar disponibilidade",
      message: "Oi! Podem me informar a disponibilidade para os próximos finais de semana?"
    },
    {
      text: "Informações sobre pacotes",
      message: "Olá! Gostaria de saber mais detalhes sobre os pacotes de pesca disponíveis."
    },
    {
      text: "Condições atuais do rio",
      message: "Oi! Como estão as condições de pesca no rio hoje?"
    }
  ];

  const handleQuickMessage = (msg: string) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 animate-fade-in">
          <Card className="w-80 shadow-2xl border-2 border-green-500">
            <div className="bg-green-500 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">PradoAqui - Atendimento</h3>
                    <div className="flex items-center space-x-1 text-green-100 text-xs">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                      <span>Online agora</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <CardContent className="p-4 space-y-3">
              <div className="bg-gray-100 rounded-lg p-3 text-sm">
                <p className="text-gray-700 mb-2">
                  👋 Olá! Como podemos ajudar você hoje?
                </p>
                <p className="text-xs text-gray-500">
                  Escolha uma opção abaixo ou digite sua mensagem:
                </p>
              </div>

              <div className="space-y-2">
                {quickMessages.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-3 hover:bg-green-50 hover:border-green-300"
                    onClick={() => handleQuickMessage(item.message)}
                  >
                    <span className="text-sm">{item.text}</span>
                  </Button>
                ))}
              </div>

              <div className="border-t pt-3">
                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Abrir WhatsApp
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Seg-Dom: 6h às 22h</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-3 w-3" />
                  <span>Resposta rápida</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-2xl animate-float"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
        
        {/* Notification Badge */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">1</span>
          </div>
        )}
      </div>
    </>
  );
};

export default WhatsAppButton;
