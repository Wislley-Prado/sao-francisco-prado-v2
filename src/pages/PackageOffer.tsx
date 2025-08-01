import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Star, Calendar, CheckCircle, Phone, CreditCard, Banknote, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';
import ranchoPradoImage from '@/assets/rancho-prado-pescador-feliz.jpg';
import usina3MariasImage from '@/assets/gallery/usina-3-marias.jpg';
import rancho21Image from '@/assets/gallery/rancho-21.jpg';
import rancho9Image from '@/assets/gallery/rancho-9.png';
import rancho7Image from '@/assets/gallery/rancho-7.png';
import rancho28Image from '@/assets/gallery/rancho-28.png';
import ranchoJulho9Image from '@/assets/gallery/rancho-julho-9.png';
import capturaTelaImage from '@/assets/gallery/captura-tela.png';
import capturaTela1131Image from '@/assets/gallery/captura-tela-11-31-11.png';
import rancho19Image from '@/assets/gallery/rancho-19.png';
import rancho12Image from '@/assets/gallery/rancho-1-2.jpg';

const PackageOption = memo(({ option }: { option: any }) => (
  <Card 
    className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
      option.popular 
        ? 'ring-2 ring-sunset-orange shadow-xl scale-105' 
        : 'hover:shadow-lg'
    }`}
  >
    {option.popular && (
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
        <Badge className="bg-sunset-orange text-white text-xs sm:text-sm">
          Mais Popular
        </Badge>
      </div>
    )}

    <CardHeader className="text-center">
      <CardTitle className="text-lg sm:text-xl lg:text-2xl text-rio-blue mb-2">
        {option.people} Pescadores
      </CardTitle>
      <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-sunset-orange mb-2">
        {option.installments}
      </div>
      <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1">
        por mês, por pessoa
      </div>
      <div className="text-xs sm:text-sm text-gray-500">
        Total: R$ {option.totalPrice.toLocaleString('pt-BR')} | R$ {option.pricePerPerson.toLocaleString('pt-BR')} por pessoa
      </div>
    </CardHeader>

    <CardContent className="space-y-3 sm:space-y-4">
      <div className="border-t pt-3 sm:pt-4">
        <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">💳 Opções de Pagamento:</h4>
        
        {/* Boleto */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3">
          <div className="flex items-center mb-1 sm:mb-2">
            <Banknote className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mr-2" />
            <span className="font-medium text-green-800 text-xs sm:text-sm">10x no Boleto</span>
          </div>
          <div className="text-green-700 text-xs sm:text-sm">
            {option.installments} por pessoa
          </div>
          <div className="text-xs text-green-600 mt-1">
            🔓 Pagou 5 boletos, já pode marcar!
          </div>
        </div>

        {/* Cartão */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3">
          <div className="flex items-center mb-1 sm:mb-2">
            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mr-2" />
            <span className="font-medium text-blue-800 text-xs sm:text-sm">Cartão de Crédito</span>
          </div>
          <div className="text-blue-700 text-xs sm:text-sm">
            Até 12x - reserva na hora!
          </div>
        </div>

        {/* PIX */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3">
          <div className="flex items-center mb-1 sm:mb-2">
            <Percent className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 mr-2" />
            <span className="font-medium text-orange-800 text-xs sm:text-sm">À vista (PIX)</span>
          </div>
          <div className="text-orange-700 text-xs sm:text-sm">
            5% desconto → R$ {(option.totalPrice * 0.95).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <Button 
        className={`w-full ${
          option.popular 
            ? 'bg-sunset-orange hover:bg-orange-600' 
            : 'bg-rio-blue hover:bg-blue-600'
        } text-white text-xs sm:text-sm`}
        size="sm"
      >
        <Calendar className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
        Reservar {option.people} Pessoas
      </Button>
    </CardContent>
  </Card>
));

const FeatureCard = memo(({ feature, index }: { feature: any; index: number }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="text-center">
      <div className="text-2xl sm:text-3xl lg:text-4xl mb-2">{feature.icon}</div>
      <CardTitle className="text-base sm:text-lg lg:text-xl text-rio-blue">
        {feature.title}
      </CardTitle>
      <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
    </CardHeader>
    <CardContent>
      <div className="space-y-1 sm:space-y-2">
        {feature.items.map((item: string, itemIndex: number) => (
          <div key={itemIndex} className="flex items-start">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-water-green mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
));

const PackageOffer = () => {
  const packageOptions = [
    {
      id: 1,
      people: 4,
      totalPrice: 8710,
      pricePerPerson: 2177.50,
      installments: "R$ 217,75",
      popular: false
    },
    {
      id: 2,
      people: 6,
      totalPrice: 11310,
      pricePerPerson: 1885,
      installments: "R$ 188,50",
      popular: true
    },
    {
      id: 3,
      people: 8,
      totalPrice: 14300,
      pricePerPerson: 1787.50,
      installments: "R$ 178,75",
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
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl sm:text-2xl font-bold text-rio-blue">
              Prado Aqui
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <Badge className="bg-sunset-orange text-white mb-3 sm:mb-4 text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2">
              🌟 OFERTA EXCLUSIVA
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              PACOTE VIP EXCLUSIVO
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-rio-blue mb-3 sm:mb-4">
              "Pesca, Prosa e Panelada Boa"
            </h2>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="flex items-center justify-center">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-water-green mr-2" />
                <span className="text-sm sm:text-base text-gray-600">🗓️ De quarta a domingo – 5 dias / 4 noites</span>
              </div>
              <div className="flex items-center justify-center">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-water-green mr-2" />
                <span className="text-sm sm:text-base text-gray-600">📍 Rancho Prado – Aldeia</span>
              </div>
            </div>
          </div>

          {/* Hero Image - Optimized for mobile */}
          <div className="relative mb-6 sm:mb-8 lg:mb-12">
            <img
              src={ranchoPradoImage}
              alt="Rancho Prado - Pescador Feliz"
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] object-cover rounded-lg shadow-xl"
              loading="eager"
            />
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
              <Badge className="bg-sunset-orange text-white text-xs sm:text-sm lg:text-lg px-2 sm:px-4 py-1 sm:py-2">
                👥 Exclusividade Total
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Package Options */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-6 sm:mb-8 lg:mb-12">
            Escolha o Tamanho do Seu Grupo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {packageOptions.map((option) => (
              <PackageOption key={option.id} option={option} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-sand-beige">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-6 sm:mb-8 lg:mb-12">
            O que está incluso no seu pacote
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {packageFeatures.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-6 sm:mb-8 lg:mb-12">
            Conheça Nosso Rancho
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {/* Main featured image */}
            <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
              <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <img
                  src={usina3MariasImage}
                  alt="Usina de Três Marias e Represa"
                  className="w-full h-48 sm:h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                  <Badge className="bg-sunset-orange text-white text-xs sm:text-sm">
                    🌊 Rio São Francisco
                  </Badge>
                </div>
              </div>
            </div>

            {/* Gallery images */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <img
                  src={rancho21Image}
                  alt="Vista do Rancho"
                  className="w-full h-32 sm:h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              
              <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <img
                  src={rancho9Image}
                  alt="Área de Lazer"
                  className="w-full h-32 sm:h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Bottom row */}
            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src={rancho7Image}
                alt="Instalações do Rancho"
                className="w-full h-32 sm:h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src={rancho28Image}
                alt="Área Externa"
                className="w-full h-32 sm:h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src={ranchoJulho9Image}
                alt="Vista Panorâmica"
                className="w-full h-32 sm:h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Additional client ranch photos */}
            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src={capturaTela1131Image}
                alt="Rancho de Cliente - Pescaria Real"
                className="w-full h-32 sm:h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src={rancho19Image}
                alt="Rancho de Cliente - Estrutura Real"
                className="w-full h-32 sm:h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src={rancho12Image}
                alt="Rancho de Cliente - Experiência Real"
                className="w-full h-32 sm:h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </div>

          {/* Additional info */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-sm sm:text-base text-gray-600">
              📸 Todas as fotos são do nosso rancho real - sem surpresas na chegada!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-rio-blue to-water-green text-white">
        <div className="max-w-4xl mx-auto text-center px-3 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Pronto para sua aventura?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90">
            Reserve agora e garante sua vaga nesta experiência única de pesca no Rio São Francisco
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
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

export default memo(PackageOffer);
