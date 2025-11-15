import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

const AdminPacotes = () => {
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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacotes</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os pacotes de pescaria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">Em desenvolvimento</p>
            <p className="text-sm">
              A listagem e gerenciamento de pacotes será implementada na Fase 5
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPacotes;
