import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDepoimentos } from "@/hooks/useOptimizedData";
import { invalidateCache } from "@/lib/cacheService";

export const TestimonialsSection = () => {
  const { data: depoimentos, isLoading, refetch } = useDepoimentos();

  // Se não tiver dados e não estiver carregando, tenta invalidar cache e recarregar
  useEffect(() => {
    if (!isLoading && (!depoimentos || depoimentos.length === 0)) {
      // Limpa cache antigo e tenta novamente
      invalidateCache('depoimentos_active');
      refetch();
    }
  }, [isLoading, depoimentos, refetch]);

  if (isLoading) {
    return null;
  }

  if (!depoimentos || depoimentos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">O Que Nossos Clientes Dizem</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Confira os depoimentos de quem já viveu experiências incríveis em nossos pacotes de pesca
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {depoimentos.map((depoimento) => (
              <CarouselItem key={depoimento.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex flex-col h-full">
                      <Quote className="h-8 w-8 text-primary mb-4 opacity-50" />
                      
                      <p className="text-sm text-muted-foreground mb-4 flex-grow">
                        {depoimento.depoimento}
                      </p>

                      <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: depoimento.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t">
                        <Avatar>
                          <AvatarImage src={depoimento.foto_url || undefined} />
                          <AvatarFallback>
                            {depoimento.nome.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{depoimento.nome}</p>
                          {depoimento.cargo && (
                            <p className="text-xs text-muted-foreground">{depoimento.cargo}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};
