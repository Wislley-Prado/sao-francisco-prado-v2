
import React from 'react';
import PackageCard from './PackageCard';
import PackageFeatures from './PackageFeatures';

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
    },
    {
      id: 4,
      title: "🌟 PACOTE VIP EXCLUSIVO – Pesca, Prosa e Panelada Boa",
      description: "Rancho inteiro reservado só pro grupo com exclusividade total",
      price: "R$ 8.382",
      duration: "5 dias / 4 noites",
      people: "6 pescadores",
      rating: 5.0,
      features: [
        "🏡 Rancho inteiro reservado só pro grupo",
        "🏊 Piscina privativa",
        "🔥 Fogão a lenha, churrasqueira, freezer, área gourmet, Wi-Fi",
        "🛏️ Acomodação confortável, vista pro lago, sossego absoluto",
        "🍳 Cozinheira todos os dias – comida caseira, no capricho mineiro",
        "🎣 3 barcos com motor",
        "👨‍🏫 1 guia por barco (2 pescadores + guia)",
        "⛽ Gasolina incluída",
        "🎣 Pesca de quinta a sábado (7h30 às 17h30)",
        "🍽️ Almoço combinado com o guia (flexível)",
        "🧼 Faxina final inclusa"
      ],
      image: "/api/placeholder/400/250",
      popular: false,
      vip: true,
      location: "Rancho Prado – Aldeia",
      totalValue: "R$ 8.382,00",
      pricePerPerson: "R$ 1.397,00 por pescador",
      paymentOptions: {
        installments: "10x no boleto: R$ 139,70/mês por pessoa. Pagou 5 boletos (R$ 698,50), já pode marcar a pescaria!",
        creditCard: "Cartão de crédito: Parcelado em até 12x – reserva confirmada na hora!",
        pix: "À vista (PIX): Com 5% de desconto → R$ 7.962,90"
      }
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        {/* Additional Info */}
        <PackageFeatures />
      </div>
    </section>
  );
};

export default PackagesSection;
