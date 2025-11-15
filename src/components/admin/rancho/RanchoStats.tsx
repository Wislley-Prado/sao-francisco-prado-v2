import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Home, CheckCircle, Star, TrendingUp } from 'lucide-react';

interface Rancho {
  disponivel: boolean;
  destaque: boolean;
  rating: number;
}

interface RanchoStatsProps {
  ranchos: Rancho[];
  isLoading: boolean;
}

export const RanchoStats = ({ ranchos, isLoading }: RanchoStatsProps) => {
  const total = ranchos.length;
  const disponiveis = ranchos.filter(r => r.disponivel).length;
  const destaques = ranchos.filter(r => r.destaque).length;
  const ratingMedio = ranchos.length > 0
    ? (ranchos.reduce((acc, r) => acc + Number(r.rating), 0) / ranchos.length).toFixed(1)
    : '0.0';

  const stats = [
    {
      title: 'Total de Ranchos',
      value: total,
      icon: Home,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Disponíveis',
      value: disponiveis,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Em Destaque',
      value: destaques,
      icon: TrendingUp,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Rating Médio',
      value: ratingMedio,
      icon: Star,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
