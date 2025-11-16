import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Calendar, Eye, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentPostsCarouselProps {
  currentPostId: string;
}

const RecentPostsCarousel = ({ currentPostId }: RecentPostsCarouselProps) => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['recent-posts-carousel', currentPostId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, titulo, slug, resumo, imagem_destaque, categoria, data_publicacao, created_at, visualizacoes')
        .eq('publicado', true)
        .neq('id', currentPostId)
        .order('data_publicacao', { ascending: false })
        .limit(8);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="bg-muted/30 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <Skeleton className="h-10 w-80 mx-auto" />
            <div className="flex gap-6 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-96 w-80 flex-shrink-0" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-muted/30 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Últimas do Blog</h2>
          <p className="text-muted-foreground text-lg mb-6">
            Fique por dentro das novidades sobre pesca no Rio São Francisco
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {posts.map((post) => (
              <CarouselItem key={post.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Link to={`/blog/${post.slug}`} className="group block h-full">
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                    {post.imagem_destaque && (
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img
                          src={post.imagem_destaque}
                          alt={post.titulo}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        {post.categoria && (
                          <Badge variant="secondary">{post.categoria}</Badge>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span>{post.visualizacoes || 0}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.titulo}
                      </h3>
                      
                      {post.resumo && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {post.resumo}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <time>
                            {new Date(post.data_publicacao || post.created_at).toLocaleDateString('pt-BR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </time>
                        </div>
                        <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-12" />
            <CarouselNext className="-right-12" />
          </div>
        </Carousel>

        <div className="text-center mt-10">
          <Button asChild size="lg" className="group">
            <Link to="/blog">
              Ver Todos os Posts
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RecentPostsCarousel;
