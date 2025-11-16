import React, { useEffect, useState } from 'react';
import PackageCard from './PackageCard';
import PackageFeatures from './PackageFeatures';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from './ui/skeleton';

interface PacoteImage {
  id: string;
  url: string;
  principal: boolean;
  ordem: number;
}

interface Pacote {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao: string;
  pessoas: number;
  rating: number;
  popular: boolean;
  ativo: boolean;
  inclusos: string[];
  pacote_imagens: PacoteImage[];
}

const PackagesSection = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data, error } = await supabase
          .from('pacotes')
          .select(`
            *,
            pacote_imagens (
              id,
              url,
              principal,
              ordem
            )
          `)
          .eq('ativo', true)
          .order('popular', { ascending: false })
          .order('preco', { ascending: true });

        if (error) throw error;

        const formattedPackages = data?.map((pacote: Pacote) => {
          const mainImage = pacote.pacote_imagens.find(img => img.principal) || 
                           pacote.pacote_imagens.sort((a, b) => a.ordem - b.ordem)[0];

          return {
            id: parseInt(pacote.id.split('-')[0], 16) % 1000, // Generate numeric id for routing
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
        }) || [];

        setPackages(formattedPackages);
      } catch (error) {
        console.error('Erro ao carregar pacotes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

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
          {loading ? (
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
