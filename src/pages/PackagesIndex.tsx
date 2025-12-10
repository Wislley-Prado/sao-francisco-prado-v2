import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Fish, Star, Calendar, Crown, Gem, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import FeaturedPackagesCarousel from '@/components/FeaturedPackagesCarousel';

interface PacoteImage {
  id: string;
  url: string;
  principal: boolean;
  ordem: number;
}

interface Pacote {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao: string;
  pessoas: number;
  rating: number;
  popular: boolean;
  destaque: boolean;
  ativo: boolean;
  inclusos: string[];
  parcelas_quantidade?: number;
  parcela_valor?: number;
  desconto_avista?: number;
  vagas_disponiveis?: number;
  pacote_imagens: PacoteImage[];
}

const PackagesIndex = () => {
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

        const formattedPackages = data?.map((pacote: Pacote, index: number) => {
          const mainImage = pacote.pacote_imagens.find(img => img.principal) || 
                           pacote.pacote_imagens.sort((a, b) => a.ordem - b.ordem)[0];

          const parcelasQtd = pacote.parcelas_quantidade || 10;
          const parcelaValor = pacote.parcela_valor || (pacote.preco / parcelasQtd);
          const desconto = pacote.desconto_avista || 0;
          const precoAvista = pacote.preco * (1 - desconto / 100);

          return {
            id: index + 1,
            slug: pacote.slug,
            title: pacote.nome,
            description: pacote.descricao || '',
            price: pacote.preco,
            priceFormatted: `R$ ${pacote.preco.toFixed(2).replace('.', ',')}`,
            parcelasQtd,
            parcelaValor,
            desconto,
            precoAvista,
            vagasDisponiveis: pacote.vagas_disponiveis,
            duration: pacote.duracao,
            people: `${pacote.pessoas} pessoas`,
            rating: pacote.rating,
            features: pacote.inclusos || [],
            image: mainImage?.url || '',
            popular: pacote.popular,
            destaque: pacote.destaque,
            badge: pacote.popular ? 'Mais Popular' : pacote.destaque ? 'Destaque' : 'Premium',
            badgeColor: pacote.popular ? 'bg-sunset-orange' : pacote.destaque ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-blue-600'
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

  const getIcon = (index: number) => {
    const icons = [Award, Crown, Gem, Fish];
    return icons[index % icons.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Nossos Pacotes de Pesca</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Escolha o pacote ideal para sua experiência de pesca esportiva no Rio São Francisco. 
            Temos opções para todos os perfis, desde o pescador iniciante até o mais exigente.
          </p>
          <div className="flex justify-center gap-6 text-lg">
            <div className="flex items-center">
              <Fish className="h-6 w-6 mr-2" />
              Equipamentos Inclusos
            </div>
            <div className="flex items-center">
              <Users className="h-6 w-6 mr-2" />
              Guias Especializados
            </div>
            <div className="flex items-center">
              <Star className="h-6 w-6 mr-2 fill-current text-yellow-400" />
              Avaliação 4.9+
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages Carousel */}
      {!loading && packages.length > 0 && (
        <FeaturedPackagesCarousel packages={packages} />
      )}

      {/* All Packages Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Todos os Pacotes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore todas as opções disponíveis e encontre o pacote perfeito para você
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {loading ? (
              <>
                <Skeleton className="h-[600px] w-full" />
                <Skeleton className="h-[600px] w-full" />
                <Skeleton className="h-[600px] w-full" />
              </>
            ) : packages.length > 0 ? (
              packages.map((pkg, index) => {
                const IconComponent = getIcon(index);
                return (
                  <Card 
                    key={pkg.id}
                    className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                      pkg.popular 
                        ? 'ring-2 ring-sunset-orange shadow-xl scale-105' 
                        : 'hover:shadow-lg'
                    }`}
                  >
                    {/* Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className={`${pkg.badgeColor} text-white`}>
                        {pkg.badge}
                      </Badge>
                    </div>

                    {/* Image Header */}
                    <CardHeader className="p-0">
                      <div className="h-48 relative overflow-hidden">
                        <img 
                          src={pkg.image} 
                          alt={pkg.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            console.log('Erro ao carregar imagem:', pkg.image);
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-rio-blue', 'to-water-green');
                          }}
                        />
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
                      <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>

                      {/* Badge de Vagas */}
                      {pkg.vagasDisponiveis && pkg.vagasDisponiveis <= 5 && (
                        <div className="mb-3">
                          <Badge variant="destructive" className="w-full justify-center py-1.5 animate-pulse">
                            🔥 Últimas {pkg.vagasDisponiveis} vagas!
                          </Badge>
                        </div>
                      )}

                      {/* Preço em Destaque */}
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 mb-4 text-white text-center shadow-lg">
                        <div className="text-xs font-medium opacity-90">em até</div>
                        <div className="text-2xl font-extrabold">
                          {pkg.parcelasQtd}x de R$ {pkg.parcelaValor.toFixed(2).replace('.', ',')}
                        </div>
                        <div className="text-xs opacity-80">sem juros</div>
                        {pkg.desconto > 0 ? (
                          <div className="mt-2 pt-2 border-t border-white/20">
                            <span className="text-xs line-through opacity-70">R$ {pkg.price.toFixed(2).replace('.', ',')}</span>
                            <span className="ml-2 font-semibold">R$ {pkg.precoAvista.toFixed(2).replace('.', ',')} à vista</span>
                            <Badge className="ml-2 bg-white/20 text-white text-xs">{pkg.desconto}% OFF</Badge>
                          </div>
                        ) : (
                          <div className="text-xs mt-1 opacity-80">
                            ou R$ {pkg.price.toFixed(2).replace('.', ',')} à vista
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {pkg.duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {pkg.people}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2 mb-6">
                        {pkg.features.slice(0, 4).map((feature: string, featureIndex: number) => (
                          <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                            <IconComponent className="h-4 w-4 mr-2 text-water-green" />
                            {feature}
                          </div>
                        ))}
                        {pkg.features.length > 4 && (
                          <div className="text-sm text-gray-500 italic">
                            +{pkg.features.length - 4} benefícios adicionais
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <Button 
                        className={`w-full ${
                          pkg.destaque
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
                            : pkg.popular 
                              ? 'bg-sunset-orange hover:bg-orange-600' 
                              : 'bg-rio-blue hover:bg-blue-600'
                        } text-white`}
                        asChild
                      >
                        <Link to={`/pacote/${pkg.slug}`}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">Nenhum pacote disponível no momento.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Compare os Pacotes</h2>
          <div className="max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 p-4 text-left">Características</th>
                    <th className="border border-gray-200 p-4 text-center">VIP</th>
                    <th className="border border-gray-200 p-4 text-center">Luxo</th>
                    <th className="border border-gray-200 p-4 text-center">Diamante</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 p-4 font-medium">Duração</td>
                    <td className="border border-gray-200 p-4 text-center">2 dias / 1 noite</td>
                    <td className="border border-gray-200 p-4 text-center">3 dias / 2 noites</td>
                    <td className="border border-gray-200 p-4 text-center">5 dias / 4 noites</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 p-4 font-medium">Capacidade</td>
                    <td className="border border-gray-200 p-4 text-center">Até 6 pessoas</td>
                    <td className="border border-gray-200 p-4 text-center">Até 4 pessoas</td>
                    <td className="border border-gray-200 p-4 text-center">Até 2 pessoas</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 p-4 font-medium">Hospedagem</td>
                    <td className="border border-gray-200 p-4 text-center">Confortável</td>
                    <td className="border border-gray-200 p-4 text-center">Premium</td>
                    <td className="border border-gray-200 p-4 text-center">Suíte Presidencial</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 p-4 font-medium">Alimentação</td>
                    <td className="border border-gray-200 p-4 text-center">Completa</td>
                    <td className="border border-gray-200 p-4 text-center">Gourmet</td>
                    <td className="border border-gray-200 p-4 text-center">Chef Privativo</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 p-4 font-medium">Equipamentos</td>
                    <td className="border border-gray-200 p-4 text-center">Completos</td>
                    <td className="border border-gray-200 p-4 text-center">Premium</td>
                    <td className="border border-gray-200 p-4 text-center">Profissionais</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto para sua aventura?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Escolha o pacote que mais combina com você e garanta uma experiência inesquecível no Rio São Francisco.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
              Falar no WhatsApp
            </Button>
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Ver Galeria
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackagesIndex;