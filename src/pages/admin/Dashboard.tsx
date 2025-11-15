import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Home, FileText, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Ranchos
              </CardTitle>
              <CardDescription>Gerenciar propriedades</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">-</p>
              <p className="text-sm text-muted-foreground mt-2">Em breve</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Pacotes
              </CardTitle>
              <CardDescription>Gerenciar ofertas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">-</p>
              <p className="text-sm text-muted-foreground mt-2">Em breve</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Blog
              </CardTitle>
              <CardDescription>Gerenciar posts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">-</p>
              <p className="text-sm text-muted-foreground mt-2">Em breve</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo ao Painel Administrativo</CardTitle>
            <CardDescription>
              Sistema de gerenciamento do Rancho Prado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Aqui você poderá gerenciar todos os aspectos do site:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Criar, editar e excluir ranchos com upload de imagens</li>
              <li>Gerenciar pacotes de pescaria com todas as informações</li>
              <li>Publicar e editar posts no blog com editor de texto rico</li>
              <li>Upload de múltiplas imagens para cada item</li>
            </ul>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                🎣 As funcionalidades de gerenciamento serão implementadas nas próximas fases.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
