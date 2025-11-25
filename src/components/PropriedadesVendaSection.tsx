import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Ruler, DollarSign, Phone, MessageCircle, Star } from 'lucide-react';

interface Propriedade {
  id: string;
  titulo: string;
  slug: string;
  descricao: string;
  tipo: string;
  localizacao: string;
  area: number;
  unidade_area: string;
  preco: number;
  imagens: string[];
  caracteristicas: string[];
  telefone_contato: string;
  whatsapp_contato: string;
  destaque: boolean;
}

export const PropriedadesVendaSection = () => {
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPropriedades();
  }, []);

  const fetchPropriedades = async () => {
    try {
      const { data, error } = await supabase
        .from('propriedades_venda')
        .select('*')
        .eq('ativo', true)
        .order('destaque', { ascending: false })
        .order('ordem', { ascending: true })
        .limit(6);

      if (error) throw error;
      setPropriedades(data || []);
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizacaoLabel = (loc: string) => {
    const labels: Record<string, string> = {
      velho_chico: 'Velho Chico',
      represa: 'Represa',
      outros: 'Outros'
    };
    return labels[loc] || loc;
  };

  const getTipoLabel = (tipo: string) => {
    return tipo === 'terreno' ? 'Terreno' : 'Rancho';
  };

  const handleWhatsAppClick = (whatsapp: string, titulo: string) => {
    const message = encodeURIComponent(`Olá! Tenho interesse na propriedade: ${titulo}`);
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
  };

  if (loading || propriedades.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Oportunidade de Compras
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Terrenos e Ranchos de Pesca à Venda
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            no Velho Chico e na Represa
          </p>
          <p className="mt-4 text-muted-foreground">
            Realize o sonho de ter sua própria propriedade às margens do Rio São Francisco
          </p>
        </div>

        {/* Grid de Propriedades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propriedades.map((propriedade) => (
            <Card key={propriedade.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Imagem */}
              {propriedade.imagens && propriedade.imagens.length > 0 && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={propriedade.imagens[0]}
                    alt={propriedade.titulo}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {propriedade.destaque && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500 text-black">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Destaque
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary">
                      {getTipoLabel(propriedade.tipo)}
                    </Badge>
                  </div>
                </div>
              )}

              <CardContent className="p-6">
                {/* Título */}
                <h3 className="text-xl font-bold mb-2 line-clamp-2">
                  {propriedade.titulo}
                </h3>

                {/* Localização */}
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{getLocalizacaoLabel(propriedade.localizacao)}</span>
                </div>

                {/* Descrição */}
                {propriedade.descricao && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {propriedade.descricao}
                  </p>
                )}

                {/* Características em destaque */}
                {propriedade.caracteristicas && propriedade.caracteristicas.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {propriedade.caracteristicas.slice(0, 3).map((carac, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {carac}
                      </Badge>
                    ))}
                    {propriedade.caracteristicas.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{propriedade.caracteristicas.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Informações principais */}
                <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Área</p>
                      <p className="font-semibold">{propriedade.area} {propriedade.unidade_area}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Preço</p>
                      <p className="font-semibold">
                        R$ {propriedade.preco.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botões de contato */}
                <div className="flex gap-2">
                  {propriedade.whatsapp_contato && (
                    <Button
                      className="flex-1"
                      onClick={() => handleWhatsAppClick(propriedade.whatsapp_contato, propriedade.titulo)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  )}
                  {propriedade.telefone_contato && !propriedade.whatsapp_contato && (
                    <Button className="flex-1" variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      {propriedade.telefone_contato}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        {propriedades.length >= 6 && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Não encontrou o que procurava? Entre em contato conosco!
            </p>
            <Button size="lg" variant="outline">
              Ver Todas as Propriedades
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
