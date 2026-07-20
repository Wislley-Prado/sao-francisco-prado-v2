import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useSiteSettings } from '@/hooks/useOptimizedData';
import { Skeleton } from '@/components/ui/skeleton';
import DOMPurify from 'dompurify';
import { SocialShareButtons } from '@/components/blog/SocialShareButtons';
import { AutoShareButtons } from '@/components/blog/AutoShareButtons';
import { PaidMediaBannerDisplay } from '@/components/blog/PaidMediaBannerDisplay';
import RelatedPosts from '@/components/blog/RelatedPosts';
import { SITE_CONFIG } from '@/lib/constants';
import { useTranslation } from 'react-i18next';

const BlogPost = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const { slug } = useParams<{ slug: string }>();
  const { data: siteSettings } = useSiteSettings();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, titulo, titulo_en, slug, resumo, resumo_en, conteudo, conteudo_en, categoria, categoria_en, tags, imagem_destaque, publicado, data_publicacao, visualizacoes, tempo_leitura, redes_sociais, banner_midia_paga, created_at, updated_at')
        .eq('slug', slug)
        .eq('publicado', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const postTitle = (isEn && post?.titulo_en) ? post.titulo_en : post?.titulo || '';
  const postExcerpt = (isEn && post?.resumo_en) ? post.resumo_en : post?.resumo || '';
  const postContent = (isEn && post?.conteudo_en) ? post.conteudo_en : post?.conteudo || '';
  const postCategory = (isEn && post?.categoria_en) ? post.categoria_en : post?.categoria || '';

  // Sanitize HTML content
  const sanitizedContent = React.useMemo(() => {
    if (!postContent) return '';
    return DOMPurify.sanitize(postContent, {
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'class', 'style'],
      ALLOW_DATA_ATTR: true,
    });
  }, [postContent]);

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
            <h1 className="text-4xl font-bold mb-4">{t('labels.postNotFound')}</h1>
            <p className="text-muted-foreground mb-8">{t('labels.postNotFoundSub')}</p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('buttons.backToBlog')}
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Always use production domain for sharing URLs
  const pageUrl = `${SITE_CONFIG.PRODUCTION_DOMAIN}/blog/${post.slug}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{isEn ? `${postTitle} | PradoAqui Blog` : `${postTitle} | Blog PradoAqui`}</title>
        <meta name="description" content={postExcerpt || postTitle} />
        <meta property="og:title" content={postTitle} />
        <meta property="og:description" content={postExcerpt || postTitle} />
        <meta property="og:image" content={post.imagem_destaque || '/og-image.png'} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={postTitle} />
        <meta name="twitter:description" content={postExcerpt || postTitle} />
        <meta name="twitter:image" content={post.imagem_destaque || '/og-image.png'} />
        <link rel="canonical" href={pageUrl} />
      </Helmet>

      <Header />

      <main className="flex-1 bg-background">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Button variant="ghost" asChild>
            <Link to="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('buttons.backToBlog')}
            </Link>
          </Button>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Badge */}
          {postCategory && (
            <Badge className="mb-4">{postCategory}</Badge>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {postTitle}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time>
                {new Date(post.data_publicacao || post.created_at).toLocaleDateString(isEn ? 'en-US' : 'pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={siteSettings?.autor_avatar_url || undefined} alt="PradoAqui" />
                <AvatarFallback className="text-xs">PA</AvatarFallback>
              </Avatar>
              <span>PradoAqui</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.imagem_destaque && (
            <div className="aspect-video mb-8 rounded-lg overflow-hidden">
              <img
                src={post.imagem_destaque}
                alt={postTitle}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Excerpt */}
          {postExcerpt && (
            <div className="bg-muted/50 border-l-4 border-primary p-6 rounded-r-lg mb-8">
              <p className="text-lg leading-relaxed">{postExcerpt}</p>
            </div>
          )}

          <Separator className="my-8" />

          {/* Content */}
          <div
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          {/* Paid Media Banner */}
          <PaidMediaBannerDisplay
            postId={post.id}
            banner_midia_paga={post.banner_midia_paga as { imagem_url: string; link_url: string; data_inicio: string; data_fim: string } | undefined}
          />

          {/* Auto Share Buttons - Always visible */}
          <AutoShareButtons
            postId={post.id}
            titulo={postTitle}
            url={pageUrl}
            resumo={postExcerpt || undefined}
          />

          {/* Manual Social Media Links - Only if configured */}
          {post.redes_sociais && (
            <SocialShareButtons
              postId={post.id}
              redes_sociais={post.redes_sociais as Record<string, string>}
            />
          )}

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

        </article>

        {/* Related Posts Section */}
        <RelatedPosts
          currentPostId={post.id}
          categoria={post.categoria}
          tags={post.tags}
        />
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
