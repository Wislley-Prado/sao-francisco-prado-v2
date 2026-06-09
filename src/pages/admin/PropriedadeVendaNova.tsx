import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PropriedadeVendaForm } from '@/components/admin/propriedade/PropriedadeVendaForm';

const PropriedadeVendaNova = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/vendas');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/vendas')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nova Oportunidade à Venda</h1>
          <p className="text-muted-foreground mt-1">
            Cadastre um novo lote, terreno ou rancho para venda
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Propriedade</CardTitle>
          <CardDescription>
            Preencha os dados e anexe fotos do imóvel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PropriedadeVendaForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PropriedadeVendaNova;
