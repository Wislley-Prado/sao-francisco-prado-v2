import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { RanchoForm } from '@/components/admin/rancho/RanchoForm';
import { toast } from 'sonner';

const RanchoNovo = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    toast.success('Rancho criado com sucesso!');
    navigate('/admin/ranchos');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/ranchos')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Novo Rancho</h1>
          <p className="text-muted-foreground mt-1">
            Cadastre uma nova propriedade para hospedagem
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Rancho</CardTitle>
          <CardDescription>
            Preencha todos os campos obrigatórios para cadastrar o rancho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RanchoForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
};

export default RanchoNovo;
