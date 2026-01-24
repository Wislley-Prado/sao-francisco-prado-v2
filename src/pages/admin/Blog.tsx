import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, BarChart3, RefreshCw } from 'lucide-react';
import { BlogStats } from '@/components/admin/blog/BlogStats';
import { BlogFilters } from '@/components/admin/blog/BlogFilters';
import { BlogTable } from '@/components/admin/blog/BlogTable';
import { useAdminBlogPosts, useInvalidateCache } from '@/hooks/useOptimizedData';
import { toast } from 'sonner';

const AdminBlog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoriaFilter, setCategoriaFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at_desc');

  const { data: posts = [], isLoading, refetch } = useAdminBlogPosts();
  const { invalidateAdminBlog } = useInvalidateCache();

  // Filtrar e ordenar posts no frontend
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // Filtro de busca
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.titulo.toLowerCase().includes(search) ||
          p.conteudo.toLowerCase().includes(search)
      );
    }

    // Filtro de status
    if (statusFilter === 'published') {
      filtered = filtered.filter((p) => p.publicado);
    } else if (statusFilter === 'draft') {
      filtered = filtered.filter((p) => !p.publicado);
    }

    // Filtro de categoria
    if (categoriaFilter !== 'all') {
      filtered = filtered.filter((p) => p.categoria === categoriaFilter);
    }

    // Ordenação
    const [field, direction] = sortBy.split('_');
    filtered.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      if (field === 'created') {
        aVal = new Date(a.created_at).getTime();
        bVal = new Date(b.created_at).getTime();
      } else if (field === 'titulo') {
        aVal = a.titulo.toLowerCase();
        bVal = b.titulo.toLowerCase();
      } else if (field === 'visualizacoes') {
        aVal = a.visualizacoes;
        bVal = b.visualizacoes;
      } else {
        aVal = new Date(a.created_at).getTime();
        bVal = new Date(b.created_at).getTime();
      }

      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    return filtered;
  }, [posts, searchTerm, statusFilter, categoriaFilter, sortBy]);

  // Calcular estatísticas
  const stats = useMemo(() => ({
    totalPosts: posts.length,
    publicados: posts.filter(p => p.publicado).length,
    rascunhos: posts.filter(p => !p.publicado).length,
    totalVisualizacoes: posts.reduce((acc, p) => acc + p.visualizacoes, 0),
  }), [posts]);

  const handleRefresh = () => {
    invalidateAdminBlog();
    refetch();
    toast.success("Dados atualizados!");
  };

  const handleDelete = () => {
    invalidateAdminBlog();
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os posts do blog e artigos publicados
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/blog/analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin/blog/novo">
              <Plus className="w-4 h-4 mr-2" />
              Novo Post
            </Link>
          </Button>
        </div>
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
            posts={filteredPosts}
            isLoading={isLoading}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlog;
