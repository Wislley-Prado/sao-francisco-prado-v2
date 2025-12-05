import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { RanchoStats } from '@/components/admin/rancho/RanchoStats';
import { RanchoTable } from '@/components/admin/rancho/RanchoTable';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const AdminRanchos = () => {
  const { data: ranchos, isLoading, refetch } = useQuery({
    queryKey: ['admin-ranchos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ranchos')
        .select(`
          *,
          rancho_imagens!rancho_imagens_rancho_id_fkey(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ranchos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as propriedades disponíveis para hospedagem
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/ranchos/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Rancho
          </Link>
        </Button>
      </div>

      <RanchoStats ranchos={ranchos || []} isLoading={isLoading} />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ranchos</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as propriedades cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RanchoTable
            ranchos={ranchos || []}
            isLoading={isLoading}
            onUpdate={refetch}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRanchos;
