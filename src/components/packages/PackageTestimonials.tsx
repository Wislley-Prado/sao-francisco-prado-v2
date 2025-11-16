import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PackageTestimonialsProps {
  pacoteId?: string;
  tipoPacote?: 'pescaria' | 'completo' | 'personalizado';
  maxItems?: number;
}

export const PackageTestimonials = ({ 
  pacoteId, 
  tipoPacote,
  maxItems = 4 
}: PackageTestimonialsProps) => {
  const { data: depoimentos, isLoading } = useQuery({
    queryKey: ['depoimentos-pacote', pacoteId, tipoPacote],
    queryFn: async () => {
      let query = supabase
        .from('depoimentos')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true })
        .order('created_at', { ascending: false });

      // Filtrar por pacote específico ou tipo de pacote
      if (pacoteId) {
        query = query.or(`pacote_id.eq.${pacoteId},pacote_id.is.null`);
      } else if (tipoPacote) {
        query = query.or(`tipo_pacote.eq.${tipoPacote},tipo_pacote.is.null`);
      } else {
        // Apenas depoimentos gerais
        query = query.is('pacote_id', null).is('tipo_pacote', null);
      }

      const { data, error } = await query.limit(maxItems);
      
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].slice(0, maxItems).map((i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (!depoimentos || depoimentos.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {depoimentos.map((depoimento) => (
        <Card 
          key={depoimento.id}
          className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
        >
          <CardContent className="pt-6">
            <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />
            
            {/* Rating */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < depoimento.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>

            {/* Depoimento */}
            <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-4">
              "{depoimento.depoimento}"
            </p>

            {/* Autor */}
            <div className="flex items-center gap-3">
              {depoimento.foto_url ? (
                <img
                  src={depoimento.foto_url}
                  alt={depoimento.nome}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-lg">
                    {depoimento.nome.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-foreground">{depoimento.nome}</p>
                {depoimento.cargo && (
                  <p className="text-sm text-muted-foreground">{depoimento.cargo}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
