import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Star, Calendar, CheckCircle, Phone, CreditCard, Banknote, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';
import ranchoPradoImage from '@/assets/rancho-prado-pescador-feliz.jpg';

const PackageOffer = () => {
  const packageOptions = [
    {
      id: 1,
      people: 4,
      totalPrice: 7870,
      pricePerPerson: 1967.50,
      installments: "R$ 196,75",
      popular: false
    },
    {
      id: 2,
      people: 6,
      totalPrice: 9123,
      pricePerPerson: 1520.50,
      installments: "R$ 152,05",
      popular: true
    },
    {
      id: 3,
      people: 8,
      totalPrice: 10376,
      pricePerPerson: 1297,
      installments: "R$ 129,70",
      popular: false
    }
  ];

  const packageFeatures = [
    {
      icon: "🏡",
      title: "Estrutura Premium",
      description: "Rancho inteiro reservado só pro grupo",
      items: [
        "Exclusividade total do rancho",
        "Piscina privativa",
        "Fogão a lenha, churrasqueira, freezer",
        "Área gourmet, Wi-Fi",
        "Acomodação confortável",
        "Rancho muito confortável e econômico"
      ]
    },
    {
      icon: "🍳",
      title: "Cozinheira Inclusa",
      description: "Serviço de cozinheira todos os dias",
      items: [
        "Cozinheira experiente à disposição",
        "Você compra os ingredientes",
        "Passa o cardápio para ela",
        "Comida feita com muito carinho",
        "Estilo caseiro, capricho mineiro"
      ]
    },
    {
      icon: "🎣",
      title: "Pescaria Completa",
      description: "Equipamentos e guias inclusos",
      items: [
        "3 barcos com motor",
        "Guia de pesca especializado",
        "1 guia por barco (2 pescadores + guia)",
        "Gasolina incluída",
        "Pesca de quinta a sábado (7h30 às 17h30)",
        "Almoço combinado com o guia"
      ]
    },
    {
      icon: "🧼",
      title: "Serviços Inclusos",
      description: "Tudo cuidado para você",
      items: [
        "Faxina final inclusa",
        "Roupa de cama e banho",
        "Muita pescaria",
        "Assistência 24h"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-rio-blue">
              Prado Aqui
            </Link>
            <Link to="/">
              <Button variant="outline">Voltar ao Início</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-sunset-orange text-white mb-4 text-lg px-4 py-2">
              🌟 OFERTA EXCLUSIVA
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              PACOTE VIP EXCLUSIVO
            </h1>
            <h2 className="text-2xl lg:text-3xl text-rio-blue mb-4">
              "Pesca, Prosa e Panelada Boa"
            </h2>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-water-green mr-2" />
                <span className="text-gray-600">🗓️ De quarta a domingo – 5 dias / 4 noites</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-water-green mr-2" />
                <span className="text-gray-600">📍 Rancho Prado – Aldeia</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative mb-12">
            <img
              src={ranchoPradoImage}
              alt="Rancho Prado - Pescador Feliz"
              className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-xl"
            />
            <div className="absolute top-4 right-4">
              <Badge className="bg-sunset-orange text-white text-lg px-4 py-2">
                👥 Exclusividade Total
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Package Options */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
            Escolha o Tamanho do Seu Grupo
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {packageOptions.map((option) => (
              <Card 
                key={option.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  option.popular 
                    ? 'ring-2 ring-sunset-orange shadow-xl scale-105' 
                    : 'hover:shadow-lg'
                }`}
              >
                {option.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-sunset-orange text-white">
                      Mais Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-rio-blue mb-2">
                    {option.people} Pescadores
                  </CardTitle>
                  <div className="text-6xl font-bold text-sunset-orange mb-2">
                    {option.installments}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    por mês, por pessoa
                  </div>
                  <div className="text-sm text-gray-500">
                    Total: R$ {option.totalPrice.toLocaleString('pt-BR')} | R$ {option.pricePerPerson.toLocaleString('pt-BR')} por pessoa
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">💳 Opções de Pagamento:</h4>
                    
                    {/* Boleto */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center mb-2">
                        <Banknote className="h-4 w-4 text-green-600 mr-2" />
                        <span className="font-medium text-green-800">10x no Boleto</span>
                      </div>
                      <div className="text-green-700">
                        {option.installments} por pessoa
                      </div>
                      <div className="text-sm text-green-600 mt-1">
                        🔓 Pagou 5 boletos, já pode marcar!
                      </div>
                    </div>

                    {/* Cartão */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center mb-2">
                        <CreditCard className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="font-medium text-blue-800">Cartão de Crédito</span>
                      </div>
                      <div className="text-blue-700">
                        Até 12x - reserva na hora!
                      </div>
                    </div>

                    {/* PIX */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <Percent className="h-4 w-4 text-orange-600 mr-2" />
                        <span className="font-medium text-orange-800">À vista (PIX)</span>
                      </div>
                      <div className="text-orange-700">
                        5% desconto → R$ {(option.totalPrice * 0.95).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  <Button 
                    className={`w-full ${
                      option.popular 
                        ? 'bg-sunset-orange hover:bg-orange-600' 
                        : 'bg-rio-blue hover:bg-blue-600'
                    } text-white`}
                    size="lg"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Reservar {option.people} Pessoas
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-sand-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
            O que está incluso no seu pacote
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packageFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{feature.icon}</div>
                  <CardTitle className="text-xl text-rio-blue">
                    {feature.title}
                  </CardTitle>
                  <p className="text-gray-600">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-water-green mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-rio-blue to-water-green text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Pronto para sua aventura?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Reserve agora e garanta sua vaga nesta experiência única de pesca no Rio São Francisco
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-sunset-orange hover:bg-orange-600 text-white">
              <Calendar className="mr-2 h-5 w-5" />
              Fazer Reserva Agora
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-rio-blue">
              <Phone className="mr-2 h-5 w-5" />
              Falar no WhatsApp
            </Button>
          </div>
          
          <div className="mt-8 text-center opacity-75">
            <p className="text-sm">
              💬 Dúvidas? Entre em contato conosco pelo WhatsApp
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackageOffer;
