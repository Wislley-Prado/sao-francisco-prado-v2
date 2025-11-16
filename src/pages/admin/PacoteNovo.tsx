import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { PacoteForm } from '@/components/admin/pacote/PacoteForm';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const PacoteNovo = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/pacotes');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/pacotes')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/pacotes">Pacotes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Novo Pacote</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold text-foreground mt-2">Novo Pacote</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Pacote</CardTitle>
          <CardDescription>
            Preencha os dados do novo pacote de pescaria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PacoteForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PacoteNovo;
