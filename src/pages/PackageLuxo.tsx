import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Clock, Users, MapPin, Star, Calendar, CheckCircle, Phone, CreditCard, Banknote, Percent, HelpCircle, Home, ChefHat, Fish, Sparkles, FileText, MessageCircle, Expand, X, Utensils, Shield, PartyPopper, Flame, Target, Gift, Crown, Wifi, Car, Bed, Camera } from 'lucide-react';
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
    { src: ranchoImage1, alt: "Rancho Prado Aldeia - Vista Principal", badge: "Destaque" },
    { src: paiFilhoDourado, alt: "Pai e Filho - Momento Especial com Dourado" },
    { src: clienteMulherDourado, alt: "Cliente Mulher - Sucesso na Pescaria de Dourado" },
    { src: pescariaCapal1, alt: "Pescaria para Casais - Experiência Especial" },
    { src: pescariaCapal2, alt: "Pescaria de Casal - Momentos Únicos" },
    { src: pescariaCapal3, alt: "Pescaria de Casal - Pacote Especial" },
    { src: douradoProvaSocial, alt: "Dourado - Prova Social dos Resultados" },
    { src: douradoPrado, alt: "Dourado Capturado no Prado" },
    { src: pescariaPintalAbaite, alt: "Pescaria no Pintal do Abaité" },
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
              <Badge className="bg-yellow-500 text-black text-xs">
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
        ? 'ring-2 ring-yellow-500 shadow-xl md:scale-105' 
        : 'hover:shadow-lg'
    }`}
  >
    {option.popular && (
      <div className="absolute top-3 right-3 z-10">
        <Badge className="bg-yellow-500 text-black text-xs font-semibold px-2 py-1">
          Mais Popular
        </Badge>
      </div>
    )}

    <CardHeader className="text-center pb-4">
      <CardTitle className="text-xl md:text-2xl text-amber-700 mb-3 font-bold">
        {option.people} Pescadores
      </CardTitle>
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-600 mb-2">
        {option.installments}
      </div>
      <div className="text-base md:text-lg font-semibold text-gray-900 mb-2">
        por mês, por pessoa
      </div>
      <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
        Total: R$ {option.totalPrice.toLocaleString('pt-BR')} | R$ {option.pricePerPerson.toLocaleString('pt-BR')} por pessoa
      </div>
    </CardHeader>

    <CardContent className="space-y-4 px-4 md:px-6">
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-900 mb-4 text-base flex items-center">
          <CreditCard className="inline-block mr-2 h-4 w-4" />
          Opções de Pagamento:
        </h4>
        
        {/* Boleto */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-3 shadow-sm">
          <div className="flex items-center mb-2">
            <Banknote className="h-4 w-4 text-green-600 mr-2" />
            <span className="font-semibold text-green-800 text-sm">10x no Boleto</span>
          </div>
          <div className="text-green-700 text-sm font-medium mb-2">
            {option.installments} por pessoa
          </div>
          <div className="text-xs text-green-600 flex items-center">
            <CheckCircle className="inline-block mr-1 h-3 w-3" />
            Pagou 5 boletos, já pode marcar!
          </div>
        </div>

        {/* Cartão */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-3 shadow-sm">
          <div className="flex items-center mb-2">
            <CreditCard className="h-4 w-4 text-blue-600 mr-2" />
            <span className="font-semibold text-blue-800 text-sm">Cartão de Crédito</span>
          </div>
          <div className="text-blue-700 text-sm font-medium">
            Até 12x - reserva na hora!
          </div>
        </div>

        {/* PIX */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-2">
            <Percent className="h-4 w-4 text-orange-600 mr-2" />
            <span className="font-semibold text-orange-800 text-sm">À vista (PIX)</span>
          </div>
          <div className="text-orange-700 text-sm font-medium">
            5% de desconto
          </div>
        </div>
      </div>

      <Button 
        className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base"
        asChild
      >
        <Link to="https://wa.me/5537999805019?text=Olá! Gostaria de reservar o Pacote Luxo Premium para {option.people} pessoas. Pode me dar mais detalhes?">
          <MessageCircle className="mr-2 h-4 w-4" />
          Reservar Agora
        </Link>
      </Button>
    </CardContent>
  </Card>
));

const FeatureCard = memo(({ feature, index }: { feature: any; index: number }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="text-center">
      <div className="text-2xl sm:text-3xl lg:text-4xl mb-2">{feature.icon}</div>
      <CardTitle className="text-base sm:text-lg lg:text-xl text-amber-700">
        {feature.title}
      </CardTitle>
      <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
    </CardHeader>
    <CardContent>
      <div className="space-y-1 sm:space-y-2">
        {feature.items.map((item: string, itemIndex: number) => (
          <div key={itemIndex} className="flex items-start">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
));

const PackageLuxo = () => {
  const packageOptions = [
    {
      id: 1,
      people: 2,
      totalPrice: 5990,
      pricePerPerson: 2995,
      installments: "R$ 299,50",
      popular: false
    },
    {
      id: 2,
      people: 4,
      totalPrice: 11980,
      pricePerPerson: 2995,
      installments: "R$ 299,50",
      popular: true
    },
    {
      id: 3,
      people: 6,
      totalPrice: 17970,
      pricePerPerson: 2995,
      installments: "R$ 299,50",
      popular: false
    }
  ];

  const packageFeatures = [
    {
      icon: <Crown className="h-8 w-8 sm:h-10 sm:w-10 text-amber-700" />,
      title: "Hospedagem Premium",
      description: "Suítes com ar condicionado e vista para o rio",
      items: [
        "Suítes com banheiro privativo",
        "Roupa de cama premium", 
        "Wi-Fi de alta velocidade",
        "Frigobar incluso",
        "Vista panorâmica do rio"
      ]
    },
    {
      icon: <Utensils className="h-8 w-8 sm:h-10 sm:w-10 text-amber-700" />,
      title: "Alimentação Gourmet",
      description: "Refeições elaboradas com ingredientes selecionados",
      items: [
        "Café da manhã completo",
        "Almoço e jantar gourmet",
        "Petiscos e bebidas premium",
        "Cardápio personalizado",
        "Chef especializado"
      ]
    },
    {
      icon: <Fish className="h-8 w-8 sm:h-10 sm:w-10 text-amber-700" />,
      title: "Equipamentos Premium",
      description: "Equipamentos de pesca de alta qualidade",
      items: [
        "Varas e molinetes premium",
        "Iscas naturais e artificiais",
        "Caixa térmica grande",
        "Kit de primeiros socorros",
        "Equipamentos Shimano"
      ]
    },
    {
      icon: <Car className="h-8 w-8 sm:h-10 sm:w-10 text-amber-700" />,
      title: "Transporte Executivo",
      description: "Traslado confortável até o local de pesca",
      items: [
        "Veículo executivo",
        "Motorista experiente",
        "Combustível incluso",
        "Seguro completo",
        "Ar condicionado"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl sm:text-2xl font-bold text-amber-700">
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
            <Badge className="bg-yellow-500 text-black mb-3 sm:mb-4 text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2">
              <Crown className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              EXPERIÊNCIA PREMIUM
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              PACOTE LUXO PREMIUM
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-amber-700 mb-3 sm:mb-4">
              "Conforto e Elegância na Pesca"
            </h2>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="flex items-center justify-center">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-2" />
                <span className="text-sm sm:text-base text-gray-600">3 dias / 2 noites</span>
              </div>
              <div className="flex items-center justify-center">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-2" />
                <span className="text-sm sm:text-base text-gray-600">Rancho Prado – Aldeia</span>
              </div>
            </div>
          </div>

          {/* Hero Image - Optimized for mobile */}
          <div className="relative mb-6 sm:mb-8 lg:mb-12">
            <img
              src={headerImage}
              alt="Pescaria no Rio São Francisco - Prado Aqui"
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] object-cover rounded-lg shadow-xl"
              loading="eager"
            />
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
              <Badge className="bg-yellow-500 text-black text-xs sm:text-sm lg:text-lg px-2 sm:px-4 py-1 sm:py-2">
                <Crown className="inline-block mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Experiência Premium
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-4">
            Galeria Premium - Experiência Luxo
          </h2>
          <p className="text-center text-gray-600 mb-6 sm:mb-8 lg:mb-12 max-w-4xl mx-auto text-sm sm:text-base lg:text-lg">
            Conheça as instalações premium que aguardam você. Cada detalhe pensado para proporcionar máximo conforto e elegância.
            <span className="font-semibold text-amber-700"> Luxo e sofisticação em cada momento!</span>
          </p>
          
          <PhotoGallery />
        </div>
      </section>

      {/* Package Options */}
      <section className="py-8 sm:py-12 lg:py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-6 sm:mb-8 lg:mb-12">
            Escolha Seu Pacote Luxo
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 sm:mb-12 max-w-6xl mx-auto">
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
            O que está incluso no Pacote Luxo
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {packageFeatures.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Bonus Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-yellow-500 to-amber-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>
        
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm sm:text-base px-4 py-2">
              BÔNUS EXCLUSIVO LUXO
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 flex items-center justify-center gap-3">
              <Crown className="h-8 w-8 sm:h-10 sm:w-10" />
              EXPERIÊNCIA VIP COMPLETA
              <Crown className="h-8 w-8 sm:h-10 sm:w-10" />
            </h2>
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8 opacity-90">
              Atendimento Personalizado Premium!
            </h3>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 border border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xl sm:text-2xl font-bold flex items-center">
                    <Crown className="h-6 w-6 mr-3" />
                    Serviço Exclusivo Premium
                  </h4>
                  <p className="text-base sm:text-lg opacity-90 leading-relaxed">
                    No Pacote Luxo, você terá acesso a <strong>serviços exclusivos</strong> que transformam sua pescaria em uma experiência verdadeiramente premium e inesquecível.
                  </p>
                </div>

                <div className="bg-white/20 rounded-xl p-4 sm:p-6">
                  <h5 className="font-bold text-lg mb-3 flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Incluso no seu pacote:
                  </h5>
                  <ul className="space-y-2 text-sm sm:text-base">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <span>Concierge pessoal durante toda a estadia</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <span>Sessão de fotos profissional das pescarias</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <span>Atendimento premium 24 horas</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <span>Kit de boas-vindas com brindes exclusivos</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/20 rounded-xl p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/20 p-4 rounded-full">
                      <Crown className="h-12 w-12 sm:h-16 sm:w-16" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-2">Experiência Premium</h4>
                  <p className="text-sm opacity-90">Conforto e elegância únicos</p>
                </div>

                <div className="bg-white/20 rounded-xl p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/20 p-4 rounded-full">
                      <Camera className="h-12 w-12 sm:h-16 sm:w-16" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-2">Memórias Eternas</h4>
                  <p className="text-sm opacity-90">Fotos profissionais incluídas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
            Depoimentos Premium
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-yellow-500/20">
                  <img 
                    src={joaoSilvaDourado} 
                    alt="Cliente Premium"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex text-yellow-500 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    Carlos Oliveira - São Paulo
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "O Pacote Luxo superou todas as expectativas! O atendimento premium e o conforto das instalações fizeram toda a diferença. Experiência inesquecível!"
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-yellow-500/20">
                  <img 
                    src={carlosOliveira} 
                    alt="Cliente Premium"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex text-yellow-500 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    João Silva - Rio de Janeiro
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Experiência única! Os equipamentos premium e o serviço personalizado tornam tudo muito mais especial. Vale cada investimento!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-amber-600 to-yellow-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-3 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Pronto para sua experiência premium?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90">
            Reserve agora o Pacote Luxo e viva momentos únicos de conforto e elegância no Rio São Francisco
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-100">
              <Calendar className="mr-2 h-5 w-5" />
              Fazer Reserva Agora
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600">
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

export default memo(PackageLuxo);