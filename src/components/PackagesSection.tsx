
import React from 'react';
import PackageCard from './PackageCard';
import PackageFeatures from './PackageFeatures';

const PackagesSection = () => {
  const packages = [
    {
      id: 1,
      title: 'PACOTE VIP EXCLUSIVO – "Pesca e prosa Boa"',
      description: "Rancho Prado – Aldeia - Para 6 pescadores com exclusividade total do rancho",
      price: "10 X R$147,97",
      duration: "5 dias / 4 noites",
      people: "6 pescadores",
      rating: 4.8,
      features: [
        "De quarta a domingo",
        "Rancho inteiro reservado só pro grupo",
        "Exclusividade total do rancho",
        "Vista pro lago, sossego absoluto"
      ],
      image: "/src/assets/rancho-prado-pescador-feliz.jpg",
      popular: true
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
      image: "/src/assets/gallery/dourado-gigante-sao-francisco.jpg",
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
      image: "/src/assets/gallery/rancho-prado-aldeia.jpg",
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
