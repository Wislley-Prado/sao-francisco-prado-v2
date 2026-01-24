import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, TrendingUp, RefreshCw } from 'lucide-react';
import { PacoteTable } from '@/components/admin/pacote/PacoteTable';
import { PacoteStats } from '@/components/admin/pacote/PacoteStats';
import { PacoteFilters } from '@/components/admin/pacote/PacoteFilters';
import { useAdminPacotes, useInvalidateCache } from '@/hooks/useOptimizedData';
import { toast } from 'sonner';

const AdminPacotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [orderBy, setOrderBy] = useState('nome');

  const { data: pacotes = [], isLoading, refetch } = useAdminPacotes();
  const { invalidateAdminPacotes } = useInvalidateCache();

  // Filtrar e ordenar pacotes no frontend
  const filteredPacotes = useMemo(() => {
    let filtered = [...pacotes];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nome.toLowerCase().includes(search) ||
          p.slug.toLowerCase().includes(search)
      );
    }

    // Tipo filter
    if (tipoFilter !== 'todos') {
      filtered = filtered.filter((p) => p.tipo === tipoFilter);
    }

    // Status filter
    if (statusFilter === 'ativo') {
      filtered = filtered.filter((p) => p.ativo);
    } else if (statusFilter === 'inativo') {
      filtered = filtered.filter((p) => !p.ativo);
    } else if (statusFilter === 'popular') {
      filtered = filtered.filter((p) => p.popular);
    } else if (statusFilter === 'destaque') {
      filtered = filtered.filter((p) => p.destaque);
    }

    // Order by
    filtered.sort((a, b) => {
      if (orderBy === 'preco_asc') {
        return a.preco - b.preco;
      } else if (orderBy === 'preco_desc') {
        return b.preco - a.preco;
      } else if (orderBy === 'rating') {
        return b.rating - a.rating;
      } else if (orderBy === 'created_at') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return a.nome.localeCompare(b.nome);
      }
    });

    return filtered;
  }, [pacotes, searchTerm, tipoFilter, statusFilter, orderBy]);

  const stats = useMemo(() => ({
    total: pacotes.length,
    ativos: pacotes.filter((p) => p.ativo).length,
    inativos: pacotes.filter((p) => !p.ativo).length,
    populares: pacotes.filter((p) => p.popular).length,
  }), [pacotes]);

  const handleRefresh = () => {
    invalidateAdminPacotes();
    refetch();
    toast.success("Dados atualizados!");
  };

  const handleUpdate = () => {
    invalidateAdminPacotes();
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pacotes</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os pacotes de pescaria oferecidos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/pacotes/analytics">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin/pacotes/novo">
              <Plus className="w-4 h-4 mr-2" />
              Novo Pacote
            </Link>
          </Button>
        </div>
      </div>

      <PacoteStats {...stats} />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacotes</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os pacotes de pescaria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PacoteFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            tipoFilter={tipoFilter}
            onTipoChange={setTipoFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            orderBy={orderBy}
            onOrderByChange={setOrderBy}
          />
          <PacoteTable
            pacotes={filteredPacotes}
            isLoading={isLoading}
            onUpdate={handleUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPacotes;
