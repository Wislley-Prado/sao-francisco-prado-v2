import React from 'react';
import PackageCard from './PackageCard';
import PackageFeatures from './PackageFeatures';
import { usePacotes } from '@/hooks/useOptimizedData';
import { Skeleton } from './ui/skeleton';

const PackagesSection = () => {
  const { data: pacotesData, isLoading } = usePacotes(true);

  // Transform data to expected format
  const packages = React.useMemo(() => {
    if (!pacotesData) return [];
    return pacotesData.map((pacote, index) => {
      const mainImage = pacote.imagens.find(img => img.principal) || pacote.imagens[0];
      return {
        id: index + 1,
        slug: pacote.slug || '',
        title: pacote.nome,
        description: pacote.descricao || '',
        price: `R$ ${pacote.preco.toFixed(2)}`,
        duration: pacote.duracao,
        people: `${pacote.pessoas} pessoas`,
        rating: pacote.rating,
        features: pacote.inclusos || [],
        image: mainImage?.url || '',
        popular: pacote.popular
      };
    });
  }, [pacotesData]);

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
          {isLoading ? (
            <>
              <Skeleton className="h-[500px] w-full" />
              <Skeleton className="h-[500px] w-full" />
              <Skeleton className="h-[500px] w-full" />
            </>
          ) : packages.length > 0 ? (
            packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">Nenhum pacote disponível no momento.</p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <PackageFeatures />
      </div>
    </section>
  );
};

export default PackagesSection;
