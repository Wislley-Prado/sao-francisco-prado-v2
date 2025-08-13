import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, MessageCircle, Clock, Users, Fish, Star, Calendar, MapPin, Wifi, Car, Utensils, Bed, Camera, Crown, Gem, Plane, Shield, Wine } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import das imagens
import ranchoImage1 from '@/assets/gallery/rancho-prado-aldeia.jpg';
import ranchoImage2 from '@/assets/gallery/rancho-1-2.jpg';
import ranchoImage3 from '@/assets/gallery/rancho-2.jpg';
import douradoImage from '@/assets/gallery/dourado-gigante-sao-francisco.jpg';
import clienteImage from '@/assets/gallery/cliente-satisfeito-dourado.jpg';
import pacoteDiamanteImage from '@/assets/gallery/pacote-diamante.png';

const PackageDiamante = () => {
  const whatsappNumber = "5537999805019";
  const whatsappMessage = "Olá! Quero conhecer o Pacote Diamante Elite - a experiência mais exclusiva! Gostaria de saber todos os detalhes sobre disponibilidade e condições especiais.";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  const packageFeatures = [
    {
      icon: Gem,
      title: "Hospedagem VIP Exclusive",
      description: "Suítes presidenciais com máximo conforto e privacidade",
      items: ["Suíte presidencial com jacuzzi", "Serviço de quarto 24h", "Wi-Fi premium e TV smart", "Minibar premium incluso", "Vista panorâmica do rio"]
    },
    {
      icon: Wine,
      title: "Gastronomia de Alto Nível",
      description: "Chef privativo e vinhos selecionados",
      items: ["Chef exclusivo para o grupo", "Menu degustação personalizado", "Vinhos e bebidas premium", "Jantar especial à beira do rio", "Coffee break gourmet"]
    },
    {
      icon: Crown,
      title: "Equipamentos Profissionais",
      description: "Equipamentos de pesca profissionais e exclusivos",
      items: ["Equipamentos Shimano premium", "Barco exclusivo com sonar", "Guia especializado particular", "Kit completo de iscas importadas", "Seguro total dos equipamentos"]
    },
    {
      icon: Plane,
      title: "Transporte Executivo",
      description: "Traslado VIP com todo conforto e segurança",
      items: ["Transfer executivo porta a porta", "Veículo de luxo climatizado", "Motorista bilíngue", "Seguro premium", "Paradas personalizadas no trajeto"]
    },
    {
      icon: Shield,
      title: "Serviços Exclusivos",
      description: "Atendimento personalizado e serviços únicos",
      items: ["Concierge pessoal", "Fotógrafo profissional", "Massagista para relaxamento", "Serviço de lavanderia express", "Coordenador de experiências"]
    },
    {
      icon: Camera,
      title: "Experiências Únicas",
      description: "Momentos especiais que só o Diamante oferece",
      items: ["Pescaria noturna exclusiva", "Sessão de fotos profissional", "Degustação de peixes locais", "Visita a locais secretos", "Certificado de experiência exclusiva"]
    }
  ];

  const testimonials = [
    {
      name: "Roberto Mendes",
      text: "O Pacote Diamante é simplesmente incomparável! Cada detalhe pensado para proporcionar a melhor experiência possível.",
      rating: 5,
      image: "/src/assets/testimonials/carlos-oliveira.jpg"
    },
    {
      name: "Eduardo Santos",
      text: "Valeu cada centavo! A exclusividade e o atendimento VIP fazem toda a diferença. Uma experiência para a vida toda!",
      rating: 5,
      image: "/src/assets/testimonials/joao-silva-dourado.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gold/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/pacotes" className="flex items-center text-gold hover:text-gold/80 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar aos Pacotes
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">Pacote Diamante Elite</h1>
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
      <section className="relative h-96 bg-gradient-to-r from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-yellow-400/10"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <Badge className="bg-gradient-to-r from-gold to-yellow-400 text-black mb-4 px-4 py-2">
              <Gem className="h-4 w-4 mr-1" />
              Experiência Elite Exclusiva
            </Badge>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">
              Pacote Diamante Elite
            </h1>
            <p className="text-xl mb-6 text-gray-300">
              A experiência de pesca mais exclusiva e luxuosa do Rio São Francisco. Atendimento VIP, equipamentos profissionais e momentos únicos que só o Diamante pode proporcionar.
            </p>
            <div className="flex items-center gap-6 text-lg text-gray-300">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-gold" />
                5 dias / 4 noites
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-gold" />
                Até 2 pessoas
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2 fill-current text-yellow-400" />
                5.0 avaliação
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preço e CTA */}
      <section className="bg-gradient-to-r from-gray-800 to-black py-12 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-black/80 to-gray-900/80 rounded-2xl p-8 border-2 border-gold/30 shadow-2xl">
              <div className="text-center">
                <div className="flex justify-center items-center gap-4 mb-6">
                  <div className="text-6xl font-bold bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">
                    R$ 5.999,40
                  </div>
                  <div className="text-lg text-gray-300">
                    <div>por pessoa</div>
                    <div className="text-sm">5 dias / 4 noites</div>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mb-8">
                  <Badge variant="secondary" className="bg-gold/20 text-gold border-gold/30">
                    Experiência Única
                  </Badge>
                  <Badge variant="secondary" className="bg-green-900/50 text-green-300 border-green-600/30">
                    Tudo Premium Incluso
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-900/50 text-purple-300 border-purple-600/30">
                    Limitado a 2 pessoas
                  </Badge>
                </div>
                <div className="flex justify-center gap-4">
                  <Button size="lg" onClick={handleWhatsAppClick} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 text-lg shadow-lg">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Reservar Experiência Elite
                  </Button>
                  <Button size="lg" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black px-8 py-4 text-lg">
                    <Phone className="h-5 w-5 mr-2" />
                    Ligar Agora
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria Exclusiva */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">
            Galeria Exclusiva Diamante
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="md:col-span-2">
              <img src={pacoteDiamanteImage} alt="Experiência Diamante" className="w-full h-80 object-cover rounded-lg shadow-2xl border border-gold/20" />
            </div>
            <div className="space-y-6">
              <img src={douradoImage} alt="Dourado Premium" className="w-full h-36 object-cover rounded-lg shadow-2xl border border-gold/20" />
              <img src={clienteImage} alt="Cliente VIP" className="w-full h-36 object-cover rounded-lg shadow-2xl border border-gold/20" />
            </div>
            <img src={ranchoImage2} alt="Instalações VIP" className="w-full h-60 object-cover rounded-lg shadow-2xl border border-gold/20" />
            <img src={ranchoImage3} alt="Vista Exclusiva" className="w-full h-60 object-cover rounded-lg shadow-2xl border border-gold/20" />
            <div className="bg-gradient-to-br from-gold/20 to-yellow-400/20 rounded-lg p-8 flex items-center justify-center border border-gold/30">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 text-gold" />
                <p className="text-lg font-semibold text-gold">Fotógrafo Profissional</p>
                <p className="text-sm text-gray-300">Incluso na experiência</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Diamante */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">
            Experiências Exclusivas do Pacote Diamante
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {packageFeatures.map((feature, index) => (
              <Card key={index} className="bg-gray-800/50 border-2 border-gold/20 hover:border-gold/40 transition-colors backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-gold/20 to-yellow-400/20 rounded-lg border border-gold/30">
                      <feature.icon className="h-8 w-8 text-gold" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gold">{feature.title}</CardTitle>
                      <p className="text-gray-300 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-gray-300 text-sm">
                        <div className="w-2 h-2 bg-gold rounded-full mr-3"></div>
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

      {/* Depoimentos VIP */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">
            Depoimentos de Clientes VIP
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-800/50 border-2 border-gold/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gold/20 to-yellow-400/20 rounded-full border border-gold/30"></div>
                    <div>
                      <h4 className="font-semibold text-gold">{testimonial.name}</h4>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Elite */}
      <section className="py-16 bg-gradient-to-r from-black via-gray-900 to-black border-t border-gold/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">
            Viva a Experiência Mais Exclusiva
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Apenas 2 vagas por período. Garante agora sua experiência única e exclusiva no Rio São Francisco.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={handleWhatsAppClick} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 text-lg shadow-xl">
              <MessageCircle className="h-5 w-5 mr-2" />
              Reservar Experiência Elite
            </Button>
            <Button size="lg" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black px-8 py-4 text-lg">
              <Phone className="h-5 w-5 mr-2" />
              (37) 99980-5019
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            * Experiência limitada e exclusiva - Sujeita à disponibilidade
          </p>
        </div>
      </section>
    </div>
  );
};

export default PackageDiamante;