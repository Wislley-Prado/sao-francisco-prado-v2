import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RelatedPostsProps {
  currentPostId: string;
  categoria?: string | null;
  tags?: string[] | null;
}

const RelatedPosts = ({ currentPostId, categoria, tags }: RelatedPostsProps) => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['related-posts', currentPostId, categoria, tags],
    queryFn: async () => {
      // 1. Fetch posts of the same category (excluding current post)
      let query = supabase
        .from('blog_posts')
        .select('id, titulo, slug, resumo, imagem_destaque, categoria, data_publicacao, created_at, visualizacoes, tags')
        .eq('publicado', true)
        .neq('id', currentPostId)
        .order('data_publicacao', { ascending: false })
        .limit(10); // Fetch a slightly larger pool to sort

      if (categoria) {
        query = query.eq('categoria', categoria);
      }

      const { data, error } = await query;
      if (error) throw error;

      let finalPosts = data || [];

      // Sort by tag relevance if there are tags
      if (finalPosts.length > 0 && tags && tags.length > 0) {
        finalPosts = [...finalPosts].sort((a, b) => {
          const aMatchingTags = a.tags?.filter((tag: string) => tags.includes(tag)).length || 0;
          const bMatchingTags = b.tags?.filter((tag: string) => tags.includes(tag)).length || 0;
          return bMatchingTags - aMatchingTags;
        });
      }

      // Slice to maximum of 3 items initially
      finalPosts = finalPosts.slice(0, 3);

      // 2. If we have less than 3 posts, fill the list with latest general posts from other categories
      if (finalPosts.length < 3) {
        const excludeIds = [currentPostId, ...finalPosts.map(p => p.id)];
        
        let fallbackQuery = supabase
          .from('blog_posts')
          .select('id, titulo, slug, resumo, imagem_destaque, categoria, data_publicacao, created_at, visualizacoes, tags')
          .eq('publicado', true)
          .order('data_publicacao', { ascending: false })
          .limit(3 - finalPosts.length);

        if (excludeIds.length > 0) {
          fallbackQuery = fallbackQuery.not('id', 'in', `(${excludeIds.join(',')})`);
        }

        const { data: fallbackPosts, error: fallbackError } = await fallbackQuery;
        if (fallbackError) throw fallbackError;

        if (fallbackPosts) {
          finalPosts = [...finalPosts, ...fallbackPosts];
        }
      }

      return finalPosts.slice(0, 3);
    },
  });

  if (isLoading) {
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3">Continue Lendo</h2>
        <p className="text-muted-foreground text-lg">
          Artigos relacionados que você também pode gostar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="group"
          >
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {post.imagem_destaque && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.imagem_destaque}
                    alt={post.titulo}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <CardContent className="p-4">
                {post.categoria && (
                  <Badge className="mb-2">{post.categoria}</Badge>
                )}
                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.titulo}
                </h3>
                {post.resumo && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {post.resumo}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <time>
                      {new Date(post.data_publicacao || post.created_at).toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </time>
                  </div>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
