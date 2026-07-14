import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

const POSTS_PER_PAGE = 9;

const Blog = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [heroImage, setHeroImage] = useState('');

  // Fetch blog hero image from site mappings
  const { data: heroData } = useQuery({
    queryKey: ['blog-hero'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings_public')
        .select('reserva_button_text')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .single();
      
      if (error) return null;
      if (data?.reserva_button_text) {
        const url = data.reserva_button_text.split('|')[1];
        if (url) return url;
      }
      return null;
    }
  });

  React.useEffect(() => {
    if (heroData) {
      setHeroImage(heroData);
    }
  }, [heroData]);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts', searchTerm, categoryFilter, isEn],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('publicado', true)
        .order('data_publicacao', { ascending: false });

      if (searchTerm) {
        if (isEn) {
          query = query.or(`titulo_en.ilike.%${searchTerm}%,resumo_en.ilike.%${searchTerm}%`);
        } else {
          query = query.or(`titulo.ilike.%${searchTerm}%,resumo.ilike.%${searchTerm}%`);
        }
      }

      if (categoryFilter && categoryFilter !== 'all') {
        if (isEn) {
          query = query.eq('categoria_en', categoryFilter);
        } else {
          query = query.eq('categoria', categoryFilter);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch all unique categories from published posts
  const { data: allCategoriesData } = useQuery({
    queryKey: ['blog-categories-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('categoria, categoria_en')
        .eq('publicado', true);
      
      if (error) throw error;
      return data;
    }
  });

  // Get unique categories list sorted
  const categories = React.useMemo(() => {
    if (!allCategoriesData) return [];
    const cats = new Set(allCategoriesData.map(p => (isEn && p.categoria_en) ? p.categoria_en : p.categoria).filter(Boolean));
    return Array.from(cats).sort();
  }, [allCategoriesData, isEn]);

  // Pagination
  const totalPages = Math.ceil((posts?.length || 0) / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts?.slice(startIndex, endIndex) || [];

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{t('labels.blogHelmetTitle', 'Blog PradoAqui | Dicas de Pesca no Rio São Francisco')}</title>
        <meta name="description" content={t('labels.blogHelmetDesc', 'Dicas, novidades e informações sobre pesca no Rio São Francisco. Aprenda técnicas, conheça os melhores pontos e fique por dentro das novidades.')} />
        <meta property="og:title" content={t('labels.blogHelmetTitle', 'Blog PradoAqui | Dicas de Pesca')} />
        <meta property="og:description" content={t('labels.blogHeroSub', 'Dicas, novidades e informações sobre pesca no Rio São Francisco')} />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://pradoaqui.com/blog" />
        <meta name="twitter:title" content={t('labels.blogHelmetTitle', 'Blog PradoAqui | Dicas de Pesca')} />
        <meta name="twitter:image" content="/og-image.png" />
      </Helmet>

      <Header />

      <main className="flex-1 bg-gradient-to-br from-background to-muted/20">
        {/* Hero Section */}
        <section 
          className="relative bg-cover bg-center text-primary-foreground py-16" 
          style={heroImage ? { backgroundImage: `url('${heroImage}')` } : {}}
        >
          {heroImage ? (
            <>
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent bottom-[-1px]"></div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"></div>
          )}
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 drop-shadow-lg">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('labels.blogHeroTitle', 'Blog PradoAqui')}</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl">
              {t('labels.blogHeroSub', 'Dicas, novidades e informações sobre pesca no Rio São Francisco')}
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('labels.searchPlaceholder', 'Buscar posts...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder={t('labels.categorySelectPlaceholder', 'Categoria')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('labels.allCategories', 'Todas Categorias')}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : currentPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                {t('labels.noPostsFound', 'Nenhum post encontrado com os filtros selecionados.')}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentPosts.map((post) => {
                  const postTitle = (isEn && post.titulo_en) ? post.titulo_en : post.titulo;
                  const postExcerpt = (isEn && post.resumo_en) ? post.resumo_en : (post.resumo || '');
                  const postCategory = (isEn && post.categoria_en) ? post.categoria_en : (post.categoria || 'Geral');
                  return (
                    <Link key={post.id} to={`/blog/${post.slug}`}>
                      <BlogCard
                        post={{
                          id: post.id,
                          title: postTitle,
                          excerpt: postExcerpt,
                          author: t('labels.authorBy', 'Por PradoAqui'),
                          date: new Date(post.data_publicacao || post.created_at).toLocaleDateString(isEn ? 'en-US' : 'pt-BR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }),
                          image: post.imagem_destaque || '/placeholder.svg',
                          category: postCategory
                        }}
                      />
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                        className="min-w-[40px]"
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
