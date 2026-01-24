import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Home, FileText, Plus, TrendingUp, Star, RefreshCw } from 'lucide-react';
import { useDashboardStats, useInvalidateCache } from '@/hooks/useOptimizedData';

const AdminDashboard = () => {
  const { data: stats, isLoading, refetch } = useDashboardStats();
  const { invalidateDashboard } = useInvalidateCache();

  const handleRefresh = () => {
    invalidateDashboard();
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do sistema de gerenciamento
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ranchos</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalRanchos || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-3 w-24 mt-1" />
              ) : (
                `${stats?.ranchosDisponiveis || 0} disponíveis`
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pacotes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalPacotes || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-3 w-24 mt-1" />
              ) : (
                `${stats?.pacotesAtivos || 0} ativos`
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts do Blog</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalBlogPosts || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-3 w-24 mt-1" />
              ) : (
                `${stats?.postsPublicados || 0} publicados`
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Depoimentos</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalDepoimentos || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-3 w-24 mt-1" />
              ) : (
                `${stats?.depoimentosAtivos || 0} ativos`
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesso rápido às principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Button asChild className="h-24 flex-col gap-2">
            <Link to="/admin/ranchos/novo">
              <Plus className="w-6 h-6" />
              Novo Rancho
            </Link>
          </Button>
          <Button asChild className="h-24 flex-col gap-2">
            <Link to="/admin/pacotes/novo">
              <Plus className="w-6 h-6" />
              Novo Pacote
            </Link>
          </Button>
          <Button asChild className="h-24 flex-col gap-2">
            <Link to="/admin/blog/novo">
              <Plus className="w-6 h-6" />
              Novo Post
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Sistema de Gerenciamento
          </CardTitle>
          <CardDescription>
            Funcionalidades disponíveis no painel administrativo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Home className="w-4 h-4 text-primary" />
                Ranchos
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Criar e editar propriedades</li>
                <li>• Upload de múltiplas imagens</li>
                <li>• Gerenciar disponibilidade</li>
                <li>• Definir comodidades</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Pacotes
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Criar pacotes de pescaria</li>
                <li>• Upload de imagens</li>
                <li>• Definir o que está incluso</li>
                <li>• Marcar como popular/destaque</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Blog
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Criar e editar posts</li>
                <li>• Editor de texto rico</li>
                <li>• Upload de imagem destaque</li>
                <li>• Publicar/despublicar</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              🚀 Navegue pelas seções usando o menu lateral para começar a gerenciar o conteúdo do site.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
