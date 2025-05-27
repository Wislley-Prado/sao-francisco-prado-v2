
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Fish, Star, MapPin } from 'lucide-react';

const PackagesSection = () => {
  const packages = [
    {
      id: 1,
      title: "Pacote Meio Dia",
      description: "Perfeito para pescadores iniciantes ou quem tem pouco tempo",
      price: "R$ 180",
      duration: "4 horas",
      people: "1-3 pessoas",
      rating: 4.8,
      features: [
        "Guia especializado",
        "Equipamentos inclusos",
        "Isca natural",
        "Seguro incluso"
      ],
      image: "/api/placeholder/400/250",
      popular: false
    },
    {
      id: 2,
      title: "Pacote Dia Inteiro",
      description: "A experiência completa de pesca no Rio São Francisco",
      price: "R$ 320",
      duration: "8 horas",
      people: "1-4 pessoas",
      rating: 4.9,
      features: [
        "Guia especializado",
        "Equipamentos profissionais",
        "Iscas variadas",
        "Almoço incluso",
        "Barco privativo",
        "Seguro incluso"
      ],
      image: "/api/placeholder/400/250",
      popular: true
    },
    {
      id: 3,
      title: "Pacote Fim de Semana",
      description: "Dois dias de pesca e hospedagem em rancho exclusivo",
      price: "R$ 850",
      duration: "2 dias",
      people: "1-6 pessoas",
      rating: 5.0,
      features: [
        "Hospedagem em rancho",
        "Todas as refeições",
        "Guia 24h",
        "Equipamentos premium",
        "Barco exclusivo",
        "Transfer incluso"
      ],
      image: "/api/placeholder/400/250",
      popular: false
    }
  ];

  return (
    <section id="pacotes" className="py-20 bg-sand-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pacotes de Pesca
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Escolha o pacote perfeito para sua experiência no Rio São Francisco. 
            Todos incluem equipamentos de qualidade e guias especializados.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                pkg.popular 
                  ? 'ring-2 ring-sunset-orange shadow-xl scale-105' 
                  : 'hover:shadow-lg'
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-sunset-orange text-white">
                    Mais Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="p-0">
                <div className="h-48 bg-gradient-to-br from-rio-blue to-water-green relative">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="text-sm font-medium">{pkg.rating}</span>
                    </div>
                    <CardTitle className="text-2xl font-bold">{pkg.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">{pkg.description}</p>

                {/* Package Info */}
                <div className="flex justify-between items-center mb-4">
                  <div className="text-3xl font-bold text-rio-blue">{pkg.price}</div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {pkg.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {pkg.people}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <Fish className="h-4 w-4 mr-2 text-water-green" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  className={`w-full ${
                    pkg.popular 
                      ? 'bg-sunset-orange hover:bg-orange-600' 
                      : 'bg-rio-blue hover:bg-blue-600'
                  } text-white`}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Reservar Agora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Todos os pacotes incluem
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-rio-blue rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Fish className="h-8 w-8 text-white" />
                </div>
                <p className="font-medium">Equipamentos</p>
                <p className="text-sm text-gray-600">Varas, molinetes e acessórios</p>
              </div>
              <div className="text-center">
                <div className="bg-water-green rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <p className="font-medium">Guia Especializado</p>
                <p className="text-sm text-gray-600">Conhecimento local</p>
              </div>
              <div className="text-center">
                <div className="bg-sunset-orange rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <p className="font-medium">Melhores Pontos</p>
                <p className="text-sm text-gray-600">Locais exclusivos</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-600 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <p className="font-medium">Seguro Total</p>
                <p className="text-sm text-gray-600">Cobertura completa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
