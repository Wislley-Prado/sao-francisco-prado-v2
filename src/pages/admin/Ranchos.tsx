import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

const AdminRanchos = () => {
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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ranchos</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as propriedades cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">Em desenvolvimento</p>
            <p className="text-sm">
              A listagem e gerenciamento de ranchos será implementada na Fase 4
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRanchos;
