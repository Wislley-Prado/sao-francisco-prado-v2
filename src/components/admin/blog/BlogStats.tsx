import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, FileEdit, Eye } from 'lucide-react';

interface BlogStatsProps {
  totalPosts: number;
  publicados: number;
  rascunhos: number;
  totalVisualizacoes: number;
  isLoading?: boolean;
}

export const BlogStats = ({ 
  totalPosts, 
  publicados, 
  rascunhos, 
  totalVisualizacoes,
  isLoading 
}: BlogStatsProps) => {
  const stats = [
    {
      title: 'Total de Posts',
      value: totalPosts,
      icon: FileText,
      description: 'Posts no sistema'
    },
    {
      title: 'Publicados',
      value: publicados,
      icon: CheckCircle,
      description: 'Visíveis no site'
    },
    {
      title: 'Rascunhos',
      value: rascunhos,
      icon: FileEdit,
      description: 'Aguardando publicação'
    },
    {
      title: 'Visualizações',
      value: totalVisualizacoes,
      icon: Eye,
      description: 'Total de acessos'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 animate-pulse bg-muted rounded" />
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
