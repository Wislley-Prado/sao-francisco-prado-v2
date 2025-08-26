import React, { memo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Clock, Users, MapPin, Star, Calendar, CheckCircle, Phone, CreditCard, Banknote, Percent, HelpCircle, Home, ChefHat, Fish, Sparkles, FileText, MessageCircle, Expand, X, Utensils, Shield, PartyPopper, Flame, Target, Gift, Gem, Crown, Wine, Plane, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import headerImage from '@/assets/pescaria-rio-sao-francisco-header.jpg';
import ranchoImage1 from '@/assets/gallery/rancho-prado-aldeia.jpg';
import rancho2Image from '@/assets/gallery/rancho-2.jpg';
import rioSaoFranciscoImage from '@/assets/gallery/rio-sao-francisco.jpg';
import douradoGiganteVelhoChico from '@/assets/gallery/dourado-gigante-velho-chico.jpg';
import clienteSatisfeitoDourado from '@/assets/gallery/cliente-satisfeito-dourado.jpg';
import douradoGiganteSaoFrancisco from '@/assets/gallery/dourado-gigante-sao-francisco.jpg';
import paiFilhoDourado from '@/assets/gallery/pai-filho-dourado.jpg';
import imagem7 from '@/assets/gallery/imagem-7.jpg';
import clienteMulherDourado from '@/assets/gallery/cliente-mulher-dourado.jpg';
import pacoteDiamanteImage from '@/assets/gallery/pacote-diamante.png';
import pescariaCapal1 from '@/assets/gallery/pescaria-casal-1.jpg';
import pescariaCapal2 from '@/assets/gallery/pescaria-casal-2.jpg';
import pescariaCapal3 from '@/assets/gallery/pescaria-casal-3.jpg';
import douradoProvaSocial from '@/assets/gallery/dourado-prova-social.jpg';
import douradoPrado from '@/assets/gallery/dourado-prado.jpg';
import pescariaPintalAbaite from '@/assets/gallery/pescaria-pintal-abaite.jpg';
import joaoSilvaDourado from '@/assets/testimonials/joao-silva-dourado.jpg';
import carlosOliveira from '@/assets/testimonials/carlos-oliveira.jpg';

const PhotoGallery = () => {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const galleryImages = [
    { src: pacoteDiamanteImage, alt: "Experiência Diamante Elite", badge: "Exclusivo" },
    { src: paiFilhoDourado, alt: "Momento Especial VIP com Dourado" },
    { src: clienteMulherDourado, alt: "Cliente VIP - Sucesso na Pescaria Elite" },
    { src: pescariaCapal1, alt: "Pescaria para Casais - Experiência Especial" },
    { src: pescariaCapal2, alt: "Pescaria de Casal - Momentos Únicos" },
    { src: pescariaCapal3, alt: "Pescaria de Casal - Pacote Especial" },
    { src: douradoProvaSocial, alt: "Dourado - Prova Social dos Resultados" },
    { src: douradoPrado, alt: "Dourado Capturado no Prado" },
    { src: pescariaPintalAbaite, alt: "Pescaria no Pintal do Abaité" },
    { src: imagem7, alt: "Estrutura VIP Premium" },
    { src: rancho2Image, alt: "Vista Exclusiva do Rancho Elite" },
    { src: rioSaoFranciscoImage, alt: "Rio São Francisco - Área VIP" },
    { src: douradoGiganteVelhoChico, alt: "Dourado Gigante - Experiência Elite" },
    { src: clienteSatisfeitoDourado, alt: "Cliente Elite - Captura Premium" },
    { src: douradoGiganteSaoFrancisco, alt: "Dourado Gigante - Serviço VIP" }
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
          className="col-span-2 sm:col-span-2 lg:col-span-2 row-span-2 relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-yellow-400/20"
          onClick={() => openModal(0)}
        >
          <img
            src={galleryImages[0].src}
            alt={galleryImages[0].alt}
            className="w-full h-48 sm:h-52 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-yellow-400/20 backdrop-blur-sm rounded-full p-3 border border-yellow-400/30">
              <Expand className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
          {galleryImages[0].badge && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs">
                {galleryImages[0].badge}
              </Badge>
            </div>
          )}
        </div>

        {/* Gallery images - Regular grid items with improved mobile layout */}
        {galleryImages.slice(1).map((image, index) => (
          <div 
            key={index + 1}
            className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-yellow-400/10"
            onClick={() => openModal(index + 1)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-24 sm:h-28 lg:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-yellow-400/20 backdrop-blur-sm rounded-full p-2 border border-yellow-400/30">
                <Expand className="h-4 w-4 text-yellow-400" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
    className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gray-800/50 border-2 ${
      option.popular 
        ? 'border-yellow-400 shadow-xl md:scale-105 shadow-yellow-400/20' 
        : 'border-yellow-400/20 hover:border-yellow-400/40'
    }`}
  >
    {option.popular && (
      <div className="absolute top-3 right-3 z-10">
        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-semibold px-2 py-1">
          Mais Exclusivo
        </Badge>
      </div>
    )}

    <CardHeader className="text-center pb-4">
      <CardTitle className="text-xl md:text-2xl text-yellow-400 mb-3 font-bold">
        {option.people} Pessoas VIP
      </CardTitle>
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-2">
        {option.installments}
      </div>
      <div className="text-base md:text-lg font-semibold text-gray-300 mb-2">
        por mês, por pessoa
      </div>
      <div className="text-sm text-gray-400 bg-gray-700/50 px-3 py-2 rounded-lg border border-yellow-400/20">
        Total: R$ {option.totalPrice.toLocaleString('pt-BR')} | R$ {option.pricePerPerson.toLocaleString('pt-BR')} por pessoa
      </div>
    </CardHeader>

    <CardContent className="space-y-4 px-4 md:px-6">
      <div className="border-t border-yellow-400/20 pt-4">
        <h4 className="font-semibold text-gray-300 mb-4 text-base flex items-center">
          <CreditCard className="inline-block mr-2 h-4 w-4 text-yellow-400" />
          Opções de Pagamento Elite:
        </h4>
        
        {/* Boleto */}
        <div className="bg-green-900/30 border border-green-400/30 rounded-xl p-4 mb-3 shadow-sm">
          <div className="flex items-center mb-2">
            <Banknote className="h-4 w-4 text-green-400 mr-2" />
            <span className="font-semibold text-green-300 text-sm">10x no Boleto</span>
          </div>
          <div className="text-green-400 text-sm font-medium mb-2">
            {option.installments} por pessoa
          </div>
          <div className="text-xs text-green-300 flex items-center">
            <CheckCircle className="inline-block mr-1 h-3 w-3" />
            Pagou 5 boletos, já pode marcar!
          </div>
        </div>

        {/* Cartão */}
        <div className="bg-blue-900/30 border border-blue-400/30 rounded-xl p-4 mb-3 shadow-sm">
          <div className="flex items-center mb-2">
            <CreditCard className="h-4 w-4 text-blue-400 mr-2" />
            <span className="font-semibold text-blue-300 text-sm">Cartão de Crédito</span>
          </div>
          <div className="text-blue-400 text-sm font-medium">
            Até 12x - reserva na hora!
          </div>
        </div>

        {/* PIX */}
        <div className="bg-orange-900/30 border border-orange-400/30 rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-2">
            <Percent className="h-4 w-4 text-orange-400 mr-2" />
            <span className="font-semibold text-orange-300 text-sm">À vista (PIX)</span>
          </div>
          <div className="text-orange-400 text-sm font-medium">
            5% de desconto
          </div>
        </div>
      </div>

      <Button 
        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base"
        asChild
      >
        <Link to="https://wa.me/5537999805019?text=Olá! Quero conhecer o Pacote Diamante Elite para {option.people} pessoas. Gostaria de saber todos os detalhes sobre esta experiência exclusiva!">
          <MessageCircle className="mr-2 h-4 w-4" />
          Reservar Experiência Elite
        </Link>
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

const PackageDiamante = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const packageOptions = [
    {
      id: 1,
      people: 2,
      totalPrice: 11999,
      pricePerPerson: 5999.50,
      installments: "R$ 599,95",
      popular: true
    }
  ];

  const packageFeatures = [
    {
      icon: <Gem className="h-8 w-8 sm:h-10 sm:w-10 text-rio-blue" />,
      title: "Hospedagem VIP Exclusive",
      description: "Suítes presidenciais com máximo conforto e privacidade",
      items: [
        "Suíte presidencial com jacuzzi",
        "Serviço de quarto 24h",
        "Wi-Fi premium e TV smart",
        "Minibar premium incluso",
        "Vista panorâmica do rio",
        "Concierge pessoal"
      ]
    },
    {
      icon: <Wine className="h-8 w-8 sm:h-10 sm:w-10 text-rio-blue" />,
      title: "Gastronomia de Alto Nível",
      description: "Chef privativo e vinhos selecionados",
      items: [
        "Chef exclusivo para o grupo",
        "Menu degustação personalizado",
        "Vinhos e bebidas premium",
        "Jantar especial à beira do rio",
        "Coffee break gourmet",
        "Sommelier incluso"
      ]
    },
    {
      icon: <Crown className="h-8 w-8 sm:h-10 sm:w-10 text-rio-blue" />,
      title: "Equipamentos Profissionais",
      description: "Equipamentos de pesca profissionais e exclusivos",
      items: [
        "Equipamentos Shimano premium",
        "Barco exclusivo com sonar",
        "Guia especializado particular",
        "Kit completo de iscas importadas",
        "Seguro total dos equipamentos",
        "Backup de equipamentos"
      ]
    },
    {
      icon: <Plane className="h-8 w-8 sm:h-10 sm:w-10 text-rio-blue" />,
      title: "Transporte Executivo",
      description: "Traslado VIP com todo conforto e segurança",
      items: [
        "Transfer executivo porta a porta",
        "Veículo de luxo climatizado",
        "Motorista bilíngue",
        "Seguro premium",
        "Paradas personalizadas no trajeto",
        "Serviço de manobrista"
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
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black mb-3 sm:mb-4 text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2">
              <Gem className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              EXPERIÊNCIA ELITE EXCLUSIVA
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              PACOTE DIAMANTE ELITE
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-rio-blue mb-3 sm:mb-4">
              "O Ápice do Luxo e Exclusividade"
            </h2>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="flex items-center justify-center">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-water-green mr-2" />
                <span className="text-sm sm:text-base text-gray-600">5 dias / 4 noites</span>
              </div>
              <div className="flex items-center justify-center">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-water-green mr-2" />
                <span className="text-sm sm:text-base text-gray-600">Rancho Prado – Aldeia VIP</span>
              </div>
            </div>
          </div>

          {/* Hero Image - Optimized for mobile */}
          <div className="relative mb-6 sm:mb-8 lg:mb-12">
            <img
              src={headerImage}
              alt="Pescaria no Rio São Francisco - Experiência Diamante Elite"
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] object-cover rounded-lg shadow-xl border border-yellow-400/20"
              loading="eager"
            />
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs sm:text-sm lg:text-lg px-2 sm:px-4 py-1 sm:py-2">
                <Gem className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Experiência Elite
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section - Pescaria de Dourado */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              Pescaria de Dourado na Cachoeira da Escadinha
            </h2>
            <p className="text-base sm:text-lg lg:text-xl opacity-90 max-w-4xl mx-auto">
              Veja um exemplar incrível de Dourado capturado nas águas cristalinas do Rio São Francisco! 
              Esta é a experiência que você terá nos nossos pontos estratégicos de pesca.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 lg:p-8 border border-yellow-400/20">
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
                    <span className="text-yellow-400 font-semibold">Espécie:</span>
                    <span className="ml-2">Dourado (Salminus brasiliensis)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400 font-semibold">Local:</span>
                    <span className="ml-2">Cachoeira da Escadinha</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400 font-semibold">Rio:</span>
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
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-4">
            Galeria Exclusiva Diamante Elite
          </h2>
          <p className="text-center text-gray-300 mb-6 sm:mb-8 lg:mb-12 max-w-4xl mx-auto text-sm sm:text-base lg:text-lg">
            Conheça o que há de mais exclusivo e luxuoso. Cada detalhe pensado para proporcionar uma experiência única e inesquecível.
            <span className="font-semibold text-yellow-400"> O máximo em sofisticação e exclusividade!</span>
          </p>
          
          <PhotoGallery />
        </div>
      </section>

      {/* Package Options */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-6 sm:mb-8 lg:mb-12">
            Experiência Diamante Elite
          </h2>
          
          <div className="grid grid-cols-1 gap-6 lg:gap-8 mb-8 sm:mb-12 max-w-2xl mx-auto">
            {packageOptions.map((option) => (
              <PackageOption key={option.id} option={option} />
            ))}
          </div>
          
          <div className="text-center">
            <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2">
              Limitado a apenas 2 pessoas por período
            </Badge>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-6 sm:mb-8 lg:mb-12">
            Experiências Exclusivas do Pacote Diamante
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {packageFeatures.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Bonus Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 overflow-hidden relative border-t border-b border-yellow-400/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/5 rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>
        
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="bg-yellow-400/20 p-3 rounded-full border border-yellow-400/30">
                <Sparkles className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
            <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 mb-4 text-sm sm:text-base px-4 py-2">
              SERVIÇOS EXCLUSIVOS DIAMANTE
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 flex items-center justify-center gap-3">
              <Gem className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-400" />
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                EXPERIÊNCIA ÚNICA NO MUNDO
              </span>
              <Gem className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-400" />
            </h2>
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8 text-gray-300">
              Serviços que Só o Diamante Oferece!
            </h3>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 border border-yellow-400/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xl sm:text-2xl font-bold flex items-center text-yellow-400">
                    <Crown className="h-6 w-6 mr-3" />
                    Serviços Únicos e Exclusivos
                  </h4>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    No Pacote Diamante Elite, você terá acesso a <strong className="text-yellow-400">serviços únicos no mundo</strong> que transformam sua experiência em algo verdadeiramente extraordinário e inesquecível.
                  </p>
                </div>

                <div className="bg-yellow-400/10 rounded-xl p-4 sm:p-6 border border-yellow-400/20">
                  <h5 className="font-bold text-lg mb-3 flex items-center text-yellow-400">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Exclusivo do Diamante:
                  </h5>
                  <ul className="space-y-2 text-sm sm:text-base">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-yellow-400" />
                      <span className="text-gray-300">Fotógrafo profissional dedicado 24h</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-yellow-400" />
                      <span className="text-gray-300">Massagista para relaxamento pós-pescaria</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-yellow-400" />
                      <span className="text-gray-300">Acesso a pontos secretos de pesca</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-yellow-400" />
                      <span className="text-gray-300">Certificado de experiência exclusiva</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-yellow-400/10 rounded-xl p-6 text-center border border-yellow-400/20">
                  <div className="flex justify-center mb-4">
                    <div className="bg-yellow-400/20 p-4 rounded-full border border-yellow-400/30">
                      <Gem className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-400" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-yellow-400">Experiência Única</h4>
                  <p className="text-sm text-gray-300">Limitado a 2 pessoas no mundo</p>
                </div>

                <div className="bg-yellow-400/10 rounded-xl p-6 text-center border border-yellow-400/20">
                  <div className="flex justify-center mb-4">
                    <div className="bg-yellow-400/20 p-4 rounded-full border border-yellow-400/30">
                      <Camera className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-400" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-yellow-400">Documentação Completa</h4>
                  <p className="text-sm text-gray-300">Álbum profissional da experiência</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-8 sm:mb-12">
            Depoimentos de Clientes VIP
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border-l-4 border-yellow-400">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-yellow-400/20">
                  <img 
                    src={joaoSilvaDourado} 
                    alt="Cliente VIP Elite"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex text-yellow-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <div className="text-sm font-semibold text-yellow-400">
                    Roberto Mendes - São Paulo
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-4 italic">
                "O Pacote Diamante é simplesmente incomparável! Cada detalhe pensado para proporcionar a melhor experiência possível. Valeu cada centavo!"
              </p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border-l-4 border-yellow-400">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-yellow-400/20">
                  <img 
                    src={carlosOliveira} 
                    alt="Cliente VIP Elite"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex text-yellow-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <div className="text-sm font-semibold text-yellow-400">
                    Eduardo Santos - Rio de Janeiro
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-4 italic">
                "A exclusividade e o atendimento VIP fazem toda a diferença. Uma experiência para a vida toda! Recomendo sem reservas."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-black via-gray-900 to-black border-t border-yellow-400/20">
        <div className="max-w-4xl mx-auto text-center px-3 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            Viva a Experiência Mais Exclusiva
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-gray-300">
            Apenas 2 vagas por período. Garanta agora sua experiência única e exclusiva no Rio São Francisco
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black">
              <Calendar className="mr-2 h-5 w-5" />
              Reservar Experiência Elite
            </Button>
            <Button size="lg" variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
              <Phone className="mr-2 h-5 w-5" />
              Falar no WhatsApp
            </Button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              * Experiência limitada e exclusiva - Sujeita à disponibilidade
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default memo(PackageDiamante);