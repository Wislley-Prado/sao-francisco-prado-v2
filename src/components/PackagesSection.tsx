
import React from 'react';
import PackageCard from './PackageCard';
import PackageFeatures from './PackageFeatures';
import ranchoPradoPescadorFeliz from '@/assets/rancho-prado-pescador-feliz.jpg';
import douradoGiganteSaoFrancisco from '@/assets/gallery/dourado-gigante-sao-francisco.jpg';
import pacoteDiamante from '@/assets/gallery/pacote-diamante.png';

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
      image: ranchoPradoPescadorFeliz,
      popular: true
    },
    {
      id: 2,
      title: "PACOTE LUXO – 'Conforto Premium'",
      description: "Experiência de luxo com hospedagem premium e serviços exclusivos",
      price: "15 X R$199,90",
      duration: "7 dias / 6 noites",
      people: "4-8 pescadores",
      rating: 4.9,
      features: [
        "Hospedagem de luxo com suítes",
        "Chef particular incluso",
        "Equipamentos premium",
        "Guia especializado 24h",
        "Barco exclusivo de luxo",
        "Transfer VIP incluso",
        "Spa e relaxamento",
        "Vista panorâmica do lago"
      ],
      image: douradoGiganteSaoFrancisco,
      popular: true
    },
    {
      id: 3,
      title: "PACOTE DIAMANTE – 'Elite Experience'",
      description: "O mais exclusivo pacote de pesca esportiva do Rio São Francisco",
      price: "20 X R$299,97",
      duration: "10 dias / 9 noites",
      people: "6-12 pescadores",
      rating: 5.0,
      features: [
        "Resort privativo exclusivo",
        "Helicóptero para translado",
        "Chef renomado e sommelier",
        "Equipamentos de última geração",
        "Guias especializados 24/7",
        "Frota de barcos de luxo",
        "Serviço de concierge",
        "Experiências gastronômicas únicas",
        "Spa completo e wellness",
        "Fotógrafo profissional incluso"
      ],
      image: pacoteDiamante,
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
