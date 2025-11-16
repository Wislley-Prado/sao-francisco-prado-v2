import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BlogStats } from '@/components/admin/blog/BlogStats';
import { BlogFilters } from '@/components/admin/blog/BlogFilters';
import { BlogTable } from '@/components/admin/blog/BlogTable';

const AdminBlog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoriaFilter, setCategoriaFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at_desc');

  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ['admin-blog-posts', searchTerm, statusFilter, categoriaFilter, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*');

      // Filtro de busca
      if (searchTerm) {
        query = query.or(`titulo.ilike.%${searchTerm}%,conteudo.ilike.%${searchTerm}%`);
      }

      // Filtro de status
      if (statusFilter === 'published') {
        query = query.eq('publicado', true);
      } else if (statusFilter === 'draft') {
        query = query.eq('publicado', false);
      }

      // Filtro de categoria
      if (categoriaFilter !== 'all') {
        query = query.eq('categoria', categoriaFilter);
      }

      // Ordenação
      const [field, direction] = sortBy.split('_');
      if (field === 'created' || field === 'titulo' || field === 'visualizacoes') {
        const orderField = field === 'created' ? 'created_at' : field;
        query = query.order(orderField, { ascending: direction === 'asc' });
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    }
  });

  // Calcular estatísticas com useMemo
  const stats = useMemo(() => ({
    totalPosts: posts?.length || 0,
    publicados: posts?.filter(p => p.publicado).length || 0,
    rascunhos: posts?.filter(p => !p.publicado).length || 0,
    totalVisualizacoes: posts?.reduce((acc, p) => acc + p.visualizacoes, 0) || 0,
  }), [posts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os posts do blog e artigos publicados
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/blog/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Post
          </Link>
        </Button>
      </div>

        <BlogStats
          totalPosts={stats.totalPosts}
          publicados={stats.publicados}
          rascunhos={stats.rascunhos}
          totalVisualizacoes={stats.totalVisualizacoes}
          isLoading={isLoading}
        />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Posts</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os artigos do blog
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <BlogFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            categoriaFilter={categoriaFilter}
            onCategoriaFilterChange={setCategoriaFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />
          <BlogTable
            posts={posts || []}
            isLoading={isLoading}
            onDelete={refetch}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlog;
