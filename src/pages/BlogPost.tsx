import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, ArrowLeft, Eye, Tag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import DOMPurify from 'dompurify';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('publicado', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Increment view count
  useEffect(() => {
    if (post?.id) {
      supabase
        .from('blog_posts')
        .update({ visualizacoes: (post.visualizacoes || 0) + 1 })
        .eq('id', post.id)
        .then();
    }
  }, [post?.id]);

  // Sanitize HTML content
  const sanitizedContent = React.useMemo(() => {
    if (!post?.conteudo) return '';
    return DOMPurify.sanitize(post.conteudo);
  }, [post?.conteudo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-background">
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-96 w-full mb-8 rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </article>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Post não encontrado</h1>
            <p className="text-muted-foreground mb-8">O post que você está procurando não existe.</p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Blog
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Button variant="ghost" asChild>
            <Link to="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Blog
            </Link>
          </Button>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Badge */}
          {post.categoria && (
            <Badge className="mb-4">{post.categoria}</Badge>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.titulo}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time>
                {new Date(post.data_publicacao || post.created_at).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </time>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>PradoAqui</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{post.visualizacoes || 0} visualizações</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.imagem_destaque && (
            <div className="aspect-video mb-8 rounded-lg overflow-hidden">
              <img
                src={post.imagem_destaque}
                alt={post.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Excerpt */}
          {post.resumo && (
            <div className="bg-muted/50 border-l-4 border-primary p-6 rounded-r-lg mb-8">
              <p className="text-lg leading-relaxed">{post.resumo}</p>
            </div>
          )}

          <Separator className="my-8" />

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <>
              <Separator className="my-8" />
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </>
          )}

          {/* Footer CTA */}
          <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <h3 className="text-xl font-bold mb-2">Gostou deste conteúdo?</h3>
            <p className="text-muted-foreground mb-4">
              Explore mais artigos sobre pesca no Rio São Francisco
            </p>
            <Button asChild>
              <Link to="/blog">Ver todos os posts</Link>
            </Button>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
