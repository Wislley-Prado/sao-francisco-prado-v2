import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface PackageTestimonialsProps {
  pacoteId?: string;
  tipoPacote?: 'pescaria' | 'completo' | 'personalizado';
  maxItems?: number;
}

const TestimonialCard = ({ depoimento, index }: { depoimento: any; index: number }) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Card 
        className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 h-full hover:scale-[1.02]"
      >
        <CardContent className="pt-6">
          <Quote className="absolute top-4 right-4 w-12 h-12 text-primary/10" />
          
          {/* Rating */}
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 transition-all ${
                  i < depoimento.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          {/* Depoimento */}
          <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-4 text-base">
            "{depoimento.depoimento}"
          </p>

          {/* Autor */}
          <div className="flex items-center gap-3">
            {depoimento.foto_url ? (
              <img
                src={depoimento.foto_url}
                alt={depoimento.nome}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 shadow-md"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shadow-md">
                <span className="text-primary font-bold text-xl">
                  {depoimento.nome.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="font-bold text-foreground">{depoimento.nome}</p>
              {depoimento.cargo && (
                <p className="text-sm text-muted-foreground">{depoimento.cargo}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const PackageTestimonials = ({ 
  pacoteId, 
  tipoPacote,
  maxItems = 4 
}: PackageTestimonialsProps) => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal({ threshold: 0.5 });
  
  const { data: depoimentos, isLoading } = useQuery({
    queryKey: ['depoimentos-pacote', pacoteId, tipoPacote],
    queryFn: async () => {
      let query = supabase
        .from('depoimentos')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true })
        .order('created_at', { ascending: false });

      if (pacoteId) {
        query = query.or(`pacote_id.eq.${pacoteId},pacote_id.is.null`);
      } else if (tipoPacote) {
        query = query.or(`tipo_pacote.eq.${tipoPacote},tipo_pacote.is.null`);
      } else {
        query = query.is('pacote_id', null).is('tipo_pacote', null);
      }

      const { data, error } = await query.limit(maxItems);
      
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].slice(0, maxItems).map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!depoimentos || depoimentos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4">
        <div
          ref={titleRef}
          className={`text-center mb-12 transition-all duration-700 ${
            titleVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            O que dizem nossos clientes
          </h2>
          <p className="text-muted-foreground text-lg">
            Experiências reais de quem já viveu essa aventura
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {depoimentos.map((depoimento, index) => (
            <TestimonialCard
              key={depoimento.id}
              depoimento={depoimento}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
