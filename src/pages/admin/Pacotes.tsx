import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PacoteTable } from '@/components/admin/pacote/PacoteTable';
import { PacoteStats } from '@/components/admin/pacote/PacoteStats';
import { PacoteFilters } from '@/components/admin/pacote/PacoteFilters';

const AdminPacotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [orderBy, setOrderBy] = useState('nome');

  const { data: pacotes = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-pacotes', searchTerm, tipoFilter, statusFilter, orderBy],
    queryFn: async () => {
      let query = supabase
        .from('pacotes')
        .select('*, pacote_imagens(*)');

      // Search filter
      if (searchTerm) {
        query = query.or(`nome.ilike.%${searchTerm}%,slug.ilike.%${searchTerm}%`);
      }

      // Tipo filter
      if (tipoFilter !== 'todos') {
        query = query.eq('tipo', tipoFilter);
      }

      // Status filter
      if (statusFilter === 'ativo') {
        query = query.eq('ativo', true);
      } else if (statusFilter === 'inativo') {
        query = query.eq('ativo', false);
      } else if (statusFilter === 'popular') {
        query = query.eq('popular', true);
      } else if (statusFilter === 'destaque') {
        query = query.eq('destaque', true);
      }

      // Order by
      if (orderBy === 'preco_asc') {
        query = query.order('preco', { ascending: true });
      } else if (orderBy === 'preco_desc') {
        query = query.order('preco', { ascending: false });
      } else if (orderBy === 'rating') {
        query = query.order('rating', { ascending: false });
      } else if (orderBy === 'created_at') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('nome', { ascending: true });
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });

  const stats = {
    total: pacotes.length,
    ativos: pacotes.filter((p: any) => p.ativo).length,
    inativos: pacotes.filter((p: any) => !p.ativo).length,
    populares: pacotes.filter((p: any) => p.popular).length,
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
        <Button asChild>
          <Link to="/admin/pacotes/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Pacote
          </Link>
        </Button>
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
            pacotes={pacotes}
            isLoading={isLoading}
            onUpdate={refetch}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPacotes;
