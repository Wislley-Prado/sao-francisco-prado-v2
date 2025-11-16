import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, TrendingUp, MessageSquare, ThumbsUp, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function EstatisticasAvaliacoes() {
  const { data: avaliacoes, isLoading } = useQuery({
    queryKey: ["avaliacoes-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("avaliacoes")
        .select("*, ranchos!inner(nome)")
        .eq("verificado", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Calcular estatísticas gerais
  const totalAvaliacoes = avaliacoes?.length || 0;
  const mediaGeral = avaliacoes?.length
    ? (avaliacoes.reduce((acc, av) => acc + av.nota, 0) / avaliacoes.length).toFixed(1)
    : "0.0";
  
  const avaliacoesPositivas = avaliacoes?.filter(av => av.nota >= 4).length || 0;
  const taxaPositiva = totalAvaliacoes > 0 
    ? ((avaliacoesPositivas / totalAvaliacoes) * 100).toFixed(1) 
    : "0";

  // Estatísticas por rancho
  const estatisticasPorRancho = avaliacoes?.reduce((acc: any[], av: any) => {
    const ranchoNome = av.ranchos?.nome || "Desconhecido";
    const existing = acc.find(item => item.rancho === ranchoNome);
    
    if (existing) {
      existing.total += 1;
      existing.somaNotas += av.nota;
      existing.media = (existing.somaNotas / existing.total).toFixed(1);
    } else {
      acc.push({
        rancho: ranchoNome,
        total: 1,
        somaNotas: av.nota,
        media: av.nota.toFixed(1),
      });
    }
    
    return acc;
  }, []) || [];

  // Distribuição de notas
  const distribuicaoNotas = [1, 2, 3, 4, 5].map(nota => ({
    nota: `${nota} ⭐`,
    quantidade: avaliacoes?.filter(av => av.nota === nota).length || 0,
  }));

  // Tendência nos últimos 30 dias
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 29 - i));
    return {
      data: format(date, "dd/MM", { locale: ptBR }),
      quantidade: 0,
      mediaNotas: 0,
    };
  });

  avaliacoes?.forEach(av => {
    const avDate = startOfDay(new Date(av.created_at));
    const daysDiff = Math.floor((new Date().getTime() - avDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 30) {
      const index = 29 - daysDiff;
      last30Days[index].quantidade += 1;
      last30Days[index].mediaNotas += av.nota;
    }
  });

  // Calcular média de notas por dia
  last30Days.forEach(day => {
    if (day.quantidade > 0) {
      day.mediaNotas = Number((day.mediaNotas / day.quantidade).toFixed(1));
    }
  });

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Estatísticas de Avaliações</h1>
            <p className="text-muted-foreground mt-1">
              Análise detalhada das avaliações dos ranchos
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Estatísticas de Avaliações</h1>
          <p className="text-muted-foreground mt-1">
            Análise detalhada das avaliações dos ranchos
          </p>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Avaliações</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAvaliacoes}</div>
            <p className="text-xs text-muted-foreground">
              Avaliações verificadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaGeral} ⭐</div>
            <p className="text-xs text-muted-foreground">
              De 5.0 estrelas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Positiva</CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taxaPositiva}%</div>
            <p className="text-xs text-muted-foreground">
              4+ estrelas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ranchos Avaliados</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticasPorRancho.length}</div>
            <p className="text-xs text-muted-foreground">
              Com pelo menos 1 avaliação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tendência de Avaliações */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Avaliações (30 dias)</CardTitle>
            <CardDescription>
              Quantidade de avaliações recebidas nos últimos 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last30Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="data" 
                  tick={{ fontSize: 12 }}
                  interval={4}
                />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="quantidade" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Avaliações"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Notas */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Notas</CardTitle>
            <CardDescription>
              Como as avaliações estão distribuídas por nota
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribuicaoNotas}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nota, quantidade }) => `${nota}: ${quantidade}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                >
                  {distribuicaoNotas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Avaliações por Rancho */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Avaliações por Rancho</CardTitle>
            <CardDescription>
              Comparação de quantidade e média de notas por rancho
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={estatisticasPorRancho}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="rancho" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="total" 
                  fill="hsl(var(--primary))" 
                  name="Total de Avaliações"
                />
                <Bar 
                  yAxisId="right"
                  dataKey="media" 
                  fill="#22c55e" 
                  name="Média de Notas"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Média de Notas ao Longo do Tempo */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Evolução da Média de Notas (30 dias)</CardTitle>
            <CardDescription>
              Como a média de satisfação dos clientes evoluiu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last30Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="data" 
                  tick={{ fontSize: 12 }}
                  interval={4}
                />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="mediaNotas" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Média de Notas"
                  dot={{ fill: '#22c55e' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Detalhes por Rancho */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes por Rancho</CardTitle>
          <CardDescription>
            Estatísticas detalhadas de cada rancho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">Rancho</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Total</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Média</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Avaliação</th>
                </tr>
              </thead>
              <tbody>
                {estatisticasPorRancho.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      Nenhuma avaliação encontrada
                    </td>
                  </tr>
                ) : (
                  estatisticasPorRancho
                    .sort((a, b) => Number(b.media) - Number(a.media))
                    .map((stat, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-3 font-medium">{stat.rancho}</td>
                        <td className="px-4 py-3 text-center">{stat.total}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1">
                            {stat.media}
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.round(Number(stat.media))
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
