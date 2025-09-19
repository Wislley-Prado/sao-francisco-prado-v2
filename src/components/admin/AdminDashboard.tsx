import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Package, ShoppingBag, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
  const { data: ranchosCount } = useQuery({
    queryKey: ['admin-ranchos-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('ranchos')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: pacotesCount } = useQuery({
    queryKey: ['admin-pacotes-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('pacotes')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: produtosCount } = useQuery({
    queryKey: ['admin-produtos-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('produtos')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: categoriasCount } = useQuery({
    queryKey: ['admin-categorias-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('categorias')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const statsCards = [
    {
      title: 'Ranchos',
      value: ranchosCount || '0',
      description: 'Total de ranchos cadastrados',
      icon: Home,
      color: 'text-blue-600',
    },
    {
      title: 'Pacotes',
      value: pacotesCount || '0',
      description: 'Pacotes de pesca disponíveis',
      icon: Package,
      color: 'text-green-600',
    },
    {
      title: 'Produtos',
      value: produtosCount || '0',
      description: 'Produtos na loja',
      icon: ShoppingBag,
      color: 'text-purple-600',
    },
    {
      title: 'Categorias',
      value: categoriasCount || '0',
      description: 'Categorias da loja',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do sistema de gestão do Rancho Prado Aqui
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo ao Painel Administrativo</CardTitle>
            <CardDescription>
              Sistema de gestão completo para o Rancho Prado Aqui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Funcionalidades Disponíveis:</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Gerenciar ranchos e suas imagens</li>
                  <li>• Administrar pacotes de pesca</li>
                  <li>• Controlar produtos da loja online</li>
                  <li>• Configurar informações do site</li>
                  <li>• Upload e organização de imagens</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
            <CardDescription>
              Configure seu sistema para começar a usar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Recomendações:</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Adicione imagens aos ranchos existentes</li>
                  <li>• Configure os preços dos pacotes</li>
                  <li>• Crie produtos para a loja</li>
                  <li>• Ajuste as configurações gerais</li>
                  <li>• Teste as funcionalidades do site</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};