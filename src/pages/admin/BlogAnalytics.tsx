import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, MousePointer, Share2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BlogAnalytics = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['blog-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_analytics')
        .select(`
          *,
          blog_posts (
            id,
            titulo,
            slug
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Calcular estatísticas
  const stats = {
    totalClicks: analytics?.length || 0,
    socialClicks: analytics?.filter(a => a.evento === 'click_social').length || 0,
    bannerClicks: analytics?.filter(a => a.evento === 'click_banner').length || 0,
  };

  // Agrupar por tipo de rede social
  const socialBreakdown = analytics
    ?.filter(a => a.evento === 'click_social')
    .reduce((acc: Record<string, number>, curr) => {
      const tipo = curr.tipo || 'unknown';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

  // Agrupar por post
  const postBreakdown = analytics?.reduce((acc: any[], curr: any) => {
    const existingPost = acc.find(p => p.post_id === curr.post_id);
    if (existingPost) {
      existingPost.clicks++;
    } else {
      acc.push({
        post_id: curr.post_id,
        titulo: curr.blog_posts?.titulo,
        slug: curr.blog_posts?.slug,
        clicks: 1,
      });
    }
    return acc;
  }, []);

  const topPosts = postBreakdown?.sort((a, b) => b.clicks - a.clicks).slice(0, 10);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics do Blog</h1>
          <p className="text-muted-foreground mt-1">
            Métricas de engajamento dos posts
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics do Blog</h1>
          <p className="text-muted-foreground mt-1">
            Métricas de engajamento dos posts
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/blog">
            Voltar aos Posts
          </Link>
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              Todos os eventos rastreados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques em Redes Sociais</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.socialClicks}</div>
            <p className="text-xs text-muted-foreground">
              Facebook, Instagram, Twitter, LinkedIn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques em Banners</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bannerClicks}</div>
            <p className="text-xs text-muted-foreground">
              Mídia paga e anúncios
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown por Rede Social */}
      {socialBreakdown && Object.keys(socialBreakdown).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Rede Social</CardTitle>
            <CardDescription>Cliques em cada plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(socialBreakdown).map(([tipo, count]) => (
                <div key={tipo} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize font-medium">{tipo}</span>
                  </div>
                  <span className="text-sm font-semibold">{count} cliques</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Posts */}
      {topPosts && topPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Posts com Mais Engajamento</CardTitle>
            <CardDescription>Top 10 posts por total de cliques</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPosts.map((post, index) => (
                <div key={post.post_id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg font-bold text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium truncate">{post.titulo}</p>
                      {post.slug && (
                        <Button
                          asChild
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                        >
                          <Link to={`/blog/${post.slug}`} target="_blank">
                            Ver post
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{post.clicks}</div>
                    <div className="text-xs text-muted-foreground">cliques</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(!analytics || analytics.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Nenhum dado disponível</p>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Os dados de analytics aparecerão aqui assim que os visitantes começarem a interagir com os posts do blog
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlogAnalytics;
