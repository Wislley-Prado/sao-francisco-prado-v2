import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Clock, Users, MapPin, Star, Calendar, CheckCircle, Phone, CreditCard, Banknote, Percent, HelpCircle, Home, ChefHat, Fish, Sparkles, FileText, MessageCircle, Expand, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ranchoPradoImage from '@/assets/rancho-prado-pescador-feliz.jpg';
import ranchoPradoAldeia from '@/assets/gallery/rancho-prado-aldeia.jpg';
import rancho2Image from '@/assets/gallery/rancho-2.jpg';
import rioSaoFranciscoImage from '@/assets/gallery/rio-sao-francisco.jpg';
import douradoGiganteVelhoChico from '@/assets/gallery/dourado-gigante-velho-chico.jpg';
import clienteSatisfeitoDourado from '@/assets/gallery/cliente-satisfeito-dourado.jpg';
import douradoGiganteSaoFrancisco from '@/assets/gallery/dourado-gigante-sao-francisco.jpg';
import paiFilhoDourado from '@/assets/gallery/pai-filho-dourado.jpg';
import imagem7 from '@/assets/gallery/imagem-7.jpg';
import clienteMulherDourado from '@/assets/gallery/cliente-mulher-dourado.jpg';

const PhotoGallery = () => {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const galleryImages = [
    { src: ranchoPradoAldeia, alt: "Rancho Prado Aldeia - Vista Principal", badge: "Destaque" },
    { src: paiFilhoDourado, alt: "Pai e Filho - Momento Especial com Dourado" },
    { src: clienteMulherDourado, alt: "Cliente Mulher - Sucesso na Pescaria de Dourado" },
    { src: imagem7, alt: "Estrutura e Ambiente do Rancho" },
    { src: rancho2Image, alt: "Vista do Rancho - Estrutura Completa" },
    { src: rioSaoFranciscoImage, alt: "Rio São Francisco - Local de Pesca" },
    { src: douradoGiganteVelhoChico, alt: "Dourado Gigante - Velho Chico" },
    { src: clienteSatisfeitoDourado, alt: "Cliente Satisfeito - Captura de Dourado Gigante" },
    { src: douradoGiganteSaoFrancisco, alt: "Dourado Gigante - São Francisco" }
  ];

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Grid Gallery - Optimized for 9 images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 auto-rows-fr">
        {/* Main featured image - spans 2 columns on desktop, full width on mobile */}
        <div 
          className="col-span-2 sm:col-span-2 lg:col-span-2 row-span-2 relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => openModal(0)}
        >
          <img
            src={galleryImages[0].src}
            alt={galleryImages[0].alt}
            className="w-full h-48 sm:h-52 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Expand className="h-6 w-6 text-white" />
            </div>
          </div>
          {galleryImages[0].badge && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-sunset-orange text-white text-xs">
                {galleryImages[0].badge}
              </Badge>
            </div>
          )}
        </div>

        {/* Gallery images - Regular grid items with improved mobile layout */}
        {galleryImages.slice(1).map((image, index) => (
          <div 
            key={index + 1}
            className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => openModal(index + 1)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-24 sm:h-28 lg:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Expand className="h-4 w-4 text-white" />
              </div>
            </div>
            {/* Add subtle gradient overlay for better text readability if needed */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {/* Lightbox Modal with Carousel */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            <Carousel 
              className="w-full max-w-4xl mx-auto"
              opts={{ startIndex: selectedImageIndex }}
            >
              <CarouselContent>
                {galleryImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="flex items-center justify-center p-4">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="max-w-full max-h-[80vh] object-contain rounded-lg"
                      />
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                      <p className="text-sm font-medium">{image.alt}</p>
                      <p className="text-xs opacity-75">{index + 1} de {galleryImages.length}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30" />
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

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
        <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
          <CreditCard className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          Opções de Pagamento:
        </h4>
        
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
            <CheckCircle className="inline-block mr-1 h-3 w-3" />
            Pagou 5 boletos, já pode marcar!
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
      icon: <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-rio-blue" />,
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
              <Star className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              OFERTA EXCLUSIVA
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
                <span className="text-sm sm:text-base text-gray-600">De quarta a domingo – 5 dias / 4 noites</span>
              </div>
              <div className="flex items-center justify-center">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-water-green mr-2" />
                <span className="text-sm sm:text-base text-gray-600">Rancho Prado – Aldeia</span>
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
                <Users className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Exclusividade Total
              </Badge>
            </div>
          </div>
        </div>
      </section>



      {/* Video Section - Pescaria de Dourado */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-rio-blue to-water-green text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
              Pescaria de Dourado na Cachoeira da Escadinha
            </h2>
            <p className="text-base sm:text-lg lg:text-xl opacity-90 max-w-4xl mx-auto">
              Veja um exemplar incrível de Dourado capturado nas águas cristalinas do Rio São Francisco! 
              Esta é a experiência que você terá nos nossos pontos estratégicos de pesca.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 lg:p-8">
              <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
                <iframe
                  src="https://www.youtube.com/embed/9yTHncRU9Uk"
                  title="Pescaria de Dourado - Cachoeira da Escadinha - Rio São Francisco"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              
              <div className="mt-4 sm:mt-6 text-center">
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base">
                  <div className="flex items-center">
                    <span className="text-sunset-orange font-semibold">Espécie:</span>
                    <span className="ml-2">Dourado (Salminus brasiliensis)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sunset-orange font-semibold">Local:</span>
                    <span className="ml-2">Cachoeira da Escadinha</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sunset-orange font-semibold">Rio:</span>
                    <span className="ml-2">São Francisco</span>
                  </div>
                </div>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm opacity-80">
                  Esta é uma das muitas espécies que você pode capturar durante sua pescaria conosco!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-4">
            Todas as fotos são dos nossos ranchos reais - sem surpresas na chegada!
          </h2>
          <p className="text-center text-gray-600 mb-6 sm:mb-8 lg:mb-12 max-w-4xl mx-auto text-sm sm:text-base lg:text-lg">
            Veja as estruturas reais que nossos clientes encontram. Cada rancho oferece conforto, segurança e a melhor experiência de pesca. 
            <span className="font-semibold text-primary"> O que você vê é exatamente o que você terá!</span>
          </p>
          
          <PhotoGallery />

          {/* Additional testimonial message */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 sm:p-6 mt-6 sm:mt-8">
            <div className="text-center">
              <div className="flex justify-center items-center mb-3">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-2">
                "Transparência Total - Zero Pegadinhas!"
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                Essas são fotos reais dos nossos ranchos. Não usamos fotos fake ou de outros lugares. 
                <span className="font-medium text-green-700"> Chegue e encontre exatamente o que viu aqui!</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Package Options */}
      <section className="py-8 sm:py-12 lg:py-16 bg-sand-beige">
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
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
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

      {/* Social Proof Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
            O que nossos clientes dizem
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Melhor experiência de pesca da minha vida! O rancho é exatamente como nas fotos e a estrutura é impecável. Voltarei com certeza!"
              </p>
              <div className="text-sm font-semibold text-gray-900">
                João Silva - São Paulo
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Trouxe minha família toda e foi perfeito! As crianças adoraram e conseguimos pescar bastante. Atendimento nota 10!"
              </p>
              <div className="text-sm font-semibold text-gray-900">
                Maria Santos - Belo Horizonte
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Organização perfeita! Desde o primeiro contato até a pescaria, tudo foi muito bem planejado. Recomendo demais!"
              </p>
              <div className="text-sm font-semibold text-gray-900">
                Carlos Oliveira - Rio de Janeiro
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-rio-blue">500+</div>
              <div className="text-sm text-gray-600">Clientes Satisfeitos</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-rio-blue">98%</div>
              <div className="text-sm text-gray-600">Recomendação</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-rio-blue">5+</div>
              <div className="text-sm text-gray-600">Anos de Experiência</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-rio-blue">15</div>
              <div className="text-sm text-gray-600">Ranchos Disponíveis</div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Info Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Três Marias: O Paraíso da Pesca no Rio São Francisco
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="text-sm sm:text-base">
                  <span className="font-semibold text-rio-blue">Três Marias</span> é reconhecida nacionalmente como um dos melhores destinos de pesca do Brasil. 
                  Localizada no coração de Minas Gerais, a cidade oferece acesso privilegiado ao majestoso <span className="font-semibold">Rio São Francisco</span>.
                </p>
                <p className="text-sm sm:text-base">
                  O <span className="font-semibold text-water-green">Rio São Francisco</span>, conhecido como "Velho Chico", é famoso por sua rica biodiversidade aquática. 
                  Suas águas abrigam espécies como tucunaré, dourado, surubim, pintado e muitas outras, proporcionando uma experiência de pesca única e inesquecível.
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border-l-4 border-rio-blue">
                  <h3 className="font-semibold text-gray-900 mb-2">Por que Três Marias?</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Localização estratégica no Rio São Francisco</li>
                    <li>• Rica diversidade de peixes nativos</li>
                    <li>• Águas calmas e ideais para pesca</li>
                    <li>• Paisagens naturais deslumbrantes</li>
                    <li>• Tradição pesqueira centenária</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-rio-blue to-water-green text-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">
                  <Star className="inline-block mr-2 h-5 w-5" />
                  Destaque Nacional
                </h3>
                <p className="text-sm opacity-90 mb-4">
                  Três Marias é considerada a "Capital da Pesca de Minas Gerais", atraindo pescadores de todo o Brasil em busca da experiência perfeita.
                </p>
                <div className="bg-white/20 p-3 rounded-lg">
                  <div className="text-lg font-bold">Rio São Francisco</div>
                  <div className="text-sm opacity-90">2.863 km de extensão • Conhecido como "Velho Chico"</div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  <Star className="inline-block mr-2 h-4 w-4" />
                  Diferenciais da Região
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center p-2 bg-white rounded border">
                    <div className="font-semibold text-rio-blue">Clima</div>
                    <div className="text-gray-600">Tropical</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded border">
                    <div className="font-semibold text-rio-blue">Temporada</div>
                    <div className="text-gray-600">Ano Todo</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded border">
                    <div className="font-semibold text-rio-blue">Peixes</div>
                    <div className="text-gray-600">20+ Espécies</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded border">
                    <div className="font-semibold text-rio-blue">Acesso</div>
                    <div className="text-gray-600">Fácil</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              <HelpCircle className="inline-block mr-3 h-8 w-8 text-rio-blue" />
              Perguntas Frequentes
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Tire suas dúvidas sobre nossos pacotes exclusivos no Rancho Prado Aldeia
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-gray-200">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center text-left">
                    <Home className="h-5 w-5 text-rio-blue mr-3 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">O rancho é exclusivo para o grupo?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="text-gray-600 leading-relaxed">
                    <strong>Sim!</strong> Todos os pacotes garantem <strong>uso exclusivo do Rancho Prado – Aldeia</strong>. 
                    Nada de dividir estrutura com outros hóspedes — piscina, fogão a lenha, área gourmet e toda a tranquilidade só pra turma.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b border-gray-200">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center text-left">
                    <Users className="h-5 w-5 text-rio-blue mr-3 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">Quantas pessoas podem participar dos pacotes?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="text-gray-600 leading-relaxed">
                    Temos pacotes para grupos de <strong>4, 6 ou 8 pescadores</strong>, garantindo conforto na hospedagem, 
                    organização na pescaria e economia justa por pessoa. <strong>O limite máximo é 8 pessoas.</strong>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-b border-gray-200">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center text-left">
                    <Fish className="h-5 w-5 text-rio-blue mr-3 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">A pescaria é com guia? E a gasolina está inclusa?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="text-gray-600 leading-relaxed">
                    Sim! Todos os pacotes incluem <strong>guia profissional com barcos motorizados</strong>. 
                    A gasolina está inclusa até <strong>20 litros por dia por barco</strong>. 
                    Se passar disso, o excedente é pago diretamente pelo cliente.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b border-gray-200">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center text-left">
                    <ChefHat className="h-5 w-5 text-rio-blue mr-3 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">A comida está inclusa?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="text-gray-600 leading-relaxed">
                    A <strong>cozinheira está inclusa todos os dias</strong>, preparando tudo com carinho mineiro!
                    Mas a <strong>alimentação (ingredientes e bebidas) é por conta do cliente</strong>. 
                    Você envia o cardápio antes da viagem, e a cozinheira já deixa tudo pronto na hora certa.
                    <div className="mt-2 text-sm italic text-green-700">
                      É só chegar da pescaria e a comida tá no ponto!
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-b border-gray-200">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center text-left">
                    <CreditCard className="h-5 w-5 text-rio-blue mr-3 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">Como funciona o pagamento?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="text-gray-600 leading-relaxed">
                    <div className="space-y-2">
                      <div>Você pode pagar em até <strong>10x no boleto por pessoa</strong>.</div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-green-600 mr-2" />
                        <span>Assim que 50% do pacote for quitado, <strong>já pode marcar a data da pescaria</strong>.</span>
                      </div>
                      <div>Também aceitamos <strong>PIX, transferência ou cartão de crédito (até 12x)</strong>.</div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border-b border-gray-200">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center text-left">
                    <Sparkles className="h-5 w-5 text-rio-blue mr-3 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">A estrutura do rancho é completa?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="text-gray-600 leading-relaxed">
                    <div>Com certeza! Você terá à disposição:</div>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        Piscina privativa
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        Churrasqueira, fogão a lenha, área gourmet
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        Wi-Fi e freezer
                      </li>
                    </ul>
                    <div className="mt-2 font-medium text-rio-blue">
                      Tudo isso com um ambiente super aconchegante, como você merece!
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border-b border-gray-200">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center text-left">
                    <Fish className="h-5 w-5 text-rio-blue mr-3 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">Posso levar minha tralha de pesca?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="text-gray-600 leading-relaxed">
                    Sim! A recomendação é que cada pescador traga sua tralha.
                    <div className="mt-2 flex items-start">
                      <Fish className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        Caso queira alugar equipamento, entre em contato com nosso atendimento com antecedência — 
                        <strong> os valores variam conforme o tipo de material</strong>.
                      </span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border-b border-gray-200">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center text-left">
                    <FileText className="h-5 w-5 text-rio-blue mr-3 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">O que está incluído na pescaria?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="text-gray-600 leading-relaxed">
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        5 dias e 4 noites de hospedagem no Rancho Prado – Aldeia
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        3 dias de pescaria (quinta, sexta e sábado)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        De 2 a 4 barcos com motor, conforme o tamanho do grupo
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        Guia de pesca experiente (1 por barco, com até 2 pescadores)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        Gasolina inclusa até 20L por barco por dia
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        Horário de almoço combinado diretamente com os guias, conforme a rotina de pescaria da turma
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center text-left">
                    <Users className="h-5 w-5 text-rio-blue mr-3 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">Não tenho grupo formado. Posso comprar o pacote mesmo assim?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="text-gray-600 leading-relaxed">
                    <strong>Pode sim!</strong>
                    <div className="mt-2">
                      Você pode comprar <strong>uma cota individual</strong> (por exemplo, 1 vaga num pacote de 4, 6 ou 8 pessoas).
                      Nós te encaixamos num grupo compatível e <strong>você curte tudo sem precisar juntar turma</strong>.
                    </div>
                    <div className="mt-2 italic text-green-700">
                      Ideal pra quem quer pescar, descansar e fazer novas amizades!
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* FAQ CTA */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="bg-gradient-to-r from-sunset-orange to-orange-600 text-white p-6 sm:p-8 rounded-xl shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">
                Bora garantir o seu lugar?
              </h3>
              <p className="text-sm sm:text-base mb-6 opacity-90">
                Fala com o Prado agora mesmo no WhatsApp e deixa que a gente cuida do resto.
              </p>
              <div className="flex items-center justify-center mb-4">
                <Fish className="h-5 w-5 mr-2" />
                <span className="text-sm sm:text-base font-medium">
                  Rancho reservado, peixe esperando e só alegria no horizonte!
                </span>
              </div>
              <Button 
                size="lg" 
                className="bg-white text-sunset-orange hover:bg-gray-100 font-semibold"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar com o Prado e Reservar
              </Button>
            </div>
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
              Dúvidas? Entre em contato conosco pelo WhatsApp
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default memo(PackageOffer);
