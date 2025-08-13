import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, MessageCircle, Clock, Users, Fish, Star, Calendar, MapPin, Wifi, Car, Utensils, Bed, Camera, Crown, Gem } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import das imagens
import ranchoImage1 from '@/assets/gallery/rancho-prado-aldeia.jpg';
import ranchoImage2 from '@/assets/gallery/rancho-1-2.jpg';
import ranchoImage3 from '@/assets/gallery/rancho-2.jpg';
import douradoImage from '@/assets/gallery/dourado-gigante-sao-francisco.jpg';
import clienteImage from '@/assets/gallery/cliente-satisfeito-dourado.jpg';

const PackageLuxo = () => {
  const whatsappNumber = "5537999805019";
  const whatsappMessage = "Olá! Tenho interesse no Pacote Luxo Premium. Gostaria de saber mais detalhes sobre disponibilidade e formas de pagamento.";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  const packageFeatures = [
    {
      icon: Crown,
      title: "Hospedagem Premium",
      description: "Quartos com ar condicionado e vista para o rio",
      items: ["Suítes com banheiro privativo", "Roupa de cama premium", "Wi-Fi de alta velocidade", "Frigobar incluso"]
    },
    {
      icon: Utensils,
      title: "Alimentação Gourmet",
      description: "Refeições elaboradas com ingredientes selecionados",
      items: ["Café da manhã completo", "Almoço e jantar gourmet", "Petiscos e bebidas", "Cardápio personalizado"]
    },
    {
      icon: Fish,
      title: "Equipamentos Premium",
      description: "Equipamentos de pesca de alta qualidade",
      items: ["Varas e molinetes premium", "Iscas naturais e artificiais", "Caixa térmica grande", "Kit de primeiros socorros"]
    },
    {
      icon: Car,
      title: "Transporte Executivo",
      description: "Traslado confortável até o local de pesca",
      items: ["Veículo executivo", "Motorista experiente", "Combustível incluso", "Seguro completo"]
    }
  ];

  const testimonials = [
    {
      name: "Carlos Oliveira",
      text: "O Pacote Luxo superou todas as expectativas! A hospedagem era incrível e a pesca foi extraordinária.",
      rating: 5,
      image: "/src/assets/testimonials/carlos-oliveira.jpg"
    },
    {
      name: "João Silva",
      text: "Experiência única! O atendimento premium e os equipamentos de qualidade fizeram toda a diferença.",
      rating: 5,
      image: "/src/assets/testimonials/joao-silva-dourado.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/pacotes" className="flex items-center text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar aos Pacotes
            </Link>
            <h1 className="text-2xl font-bold text-primary">Pacote Luxo Premium</h1>
            <div className="flex gap-2">
              <Button onClick={handleWhatsAppClick} className="bg-green-600 hover:bg-green-700">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <Badge className="bg-yellow-500 text-black mb-4">
              <Crown className="h-4 w-4 mr-1" />
              Premium Experience
            </Badge>
            <h1 className="text-5xl font-bold mb-4">Pacote Luxo Premium</h1>
            <p className="text-xl mb-6">Experiência de pesca exclusiva com hospedagem premium, equipamentos de alta qualidade e atendimento personalizado no Rio São Francisco.</p>
            <div className="flex items-center gap-6 text-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                3 dias / 2 noites
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Até 4 pessoas
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2 fill-current text-yellow-400" />
                4.9 avaliação
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preço e CTA */}
      <section className="bg-white py-12 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="text-center">
                <div className="flex justify-center items-center gap-4 mb-6">
                  <div className="text-6xl font-bold text-blue-600">R$ 2.998,50</div>
                  <div className="text-lg text-gray-600">
                    <div>por pessoa</div>
                    <div className="text-sm">3 dias / 2 noites</div>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mb-8">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Parcelamento disponível
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Tudo incluso
                  </Badge>
                </div>
                <div className="flex justify-center gap-4">
                  <Button size="lg" onClick={handleWhatsAppClick} className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Reservar via WhatsApp
                  </Button>
                  <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                    <Phone className="h-5 w-5 mr-2" />
                    Ligar Agora
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria de Fotos */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Galeria Premium</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="md:col-span-2">
              <img src={ranchoImage1} alt="Rancho Premium" className="w-full h-80 object-cover rounded-lg shadow-lg" />
            </div>
            <div className="space-y-6">
              <img src={douradoImage} alt="Dourado Capturado" className="w-full h-36 object-cover rounded-lg shadow-lg" />
              <img src={clienteImage} alt="Cliente Satisfeito" className="w-full h-36 object-cover rounded-lg shadow-lg" />
            </div>
            <img src={ranchoImage2} alt="Instalações" className="w-full h-60 object-cover rounded-lg shadow-lg" />
            <img src={ranchoImage3} alt="Vista do Rio" className="w-full h-60 object-cover rounded-lg shadow-lg" />
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-8 flex items-center justify-center text-white">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-semibold">E muito mais!</p>
                <p className="text-sm opacity-90">Fotos exclusivas da sua experiência</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Premium */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">O que está incluído no Pacote Luxo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {packageFeatures.map((feature, index) => (
              <Card key={index} className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <feature.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Depoimentos dos Clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto para sua aventura premium?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Garante já sua vaga no Pacote Luxo Premium e viva uma experiência inesquecível no Rio São Francisco.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={handleWhatsAppClick} className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
              <MessageCircle className="h-5 w-5 mr-2" />
              Reservar Agora
            </Button>
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
              <Phone className="h-5 w-5 mr-2" />
              (37) 99980-5019
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackageLuxo;