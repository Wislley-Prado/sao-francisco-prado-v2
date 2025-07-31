import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Star, Calendar, CheckCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import ranchoPradoImage from '@/assets/rancho-prado-pescador-feliz.jpg';

const PackageOffer = () => {
  const packageDetails = {
    title: 'PACOTE VIP EXCLUSIVO – "Pesca e prosa Boa"',
    location: 'Rancho Prado – Aldeia',
    price: '10 X R$147,97',
    priceNote: 'por pessoa',
    duration: '5 dias / 4 noites',
    people: '6 pescadores',
    rating: 4.8,
    description: 'Uma experiência única de pesca no Rio São Francisco com exclusividade total do rancho. Desconecte-se do mundo e conecte-se com a natureza em um ambiente reservado especialmente para seu grupo.',
    features: [
      '🗓️ De quarta a domingo',
      'Rancho inteiro reservado só pro grupo',
      'Exclusividade total do rancho',
      'Vista pro lago, sossego absoluto',
      'Equipamentos de pesca inclusos',
      'Todas as refeições inclusas',
      'Guia especializado',
      'Seguro incluso'
    ],
    includes: [
      'Hospedagem exclusiva no rancho',
      'Café da manhã, almoço e jantar',
      'Equipamentos de pesca premium',
      'Iscas e materiais',
      'Guia especializado 24h',
      'Barco para pescaria',
      'Seguro de vida e acidentes',
      'Transfer ida e volta'
    ]
  };

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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <Badge className="bg-sunset-orange text-white mb-4">
                Oferta Especial
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {packageDetails.title}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-water-green mr-2" />
                  <span className="text-gray-600">{packageDetails.location}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">{packageDetails.rating}</span>
                </div>
              </div>
              <p className="text-xl text-gray-600 mb-8">
                {packageDetails.description}
              </p>
              
              {/* Price */}
              <div className="bg-white rounded-lg border-2 border-sunset-orange p-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-rio-blue mb-2">
                    {packageDetails.price}
                  </div>
                  <div className="text-lg text-gray-600 mb-4">
                    {packageDetails.priceNote}
                  </div>
                  <div className="flex justify-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {packageDetails.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {packageDetails.people}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-sunset-orange hover:bg-orange-600 text-white">
                  <Calendar className="mr-2 h-5 w-5" />
                  Reservar Agora
                </Button>
                <Button size="lg" variant="outline" className="border-rio-blue text-rio-blue">
                  <Phone className="mr-2 h-5 w-5" />
                  Falar no WhatsApp
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src={ranchoPradoImage}
                alt="Rancho Prado - Pescador Feliz"
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-xl"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-sunset-orange text-white">
                  Exclusivo
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-rio-blue">
                  O que está incluso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {packageDetails.includes.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-water-green mr-3" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-rio-blue">
                  Destaques do pacote
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {packageDetails.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-sunset-orange mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
            Reserve agora e garante sua vaga nesta experiência única de pesca no Rio São Francisco
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-sunset-orange hover:bg-orange-600 text-white">
              <Calendar className="mr-2 h-5 w-5" />
              Fazer Reserva
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-rio-blue">
              <Phone className="mr-2 h-5 w-5" />
              Tirar Dúvidas
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackageOffer;