import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AnalyticsCard } from "@/components/analytics/AnalyticsCard";
import { RanchoPerformanceChart } from "@/components/analytics/RanchoPerformanceChart";
import { RanchoAnalyticsTable } from "@/components/analytics/RanchoAnalyticsTable";
import { Eye, MousePointer, TrendingUp, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Analytics() {
  const { data: estatisticas, isLoading } = useQuery({
    queryKey: ["rancho-estatisticas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rancho_estatisticas")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const totalVisualizacoes = estatisticas?.reduce(
    (acc, r) => acc + Number(r.total_visualizacoes),
    0
  ) || 0;

  const totalCliques = estatisticas?.reduce(
    (acc, r) => acc + Number(r.total_cliques_whatsapp) + Number(r.total_cliques_reserva),
    0
  ) || 0;

  const taxaConversaoGeral = totalVisualizacoes > 0
    ? ((totalCliques / totalVisualizacoes) * 100).toFixed(2)
    : "0.00";

  const visualizacoes7Dias = estatisticas?.reduce(
    (acc, r) => acc + Number(r.visualizacoes_7_dias),
    0
  ) || 0;

  const chartData = estatisticas?.map((r) => ({
    nome: r.nome.length > 15 ? r.nome.substring(0, 15) + "..." : r.nome,
    visualizacoes: Number(r.total_visualizacoes),
    cliques: Number(r.total_cliques_whatsapp) + Number(r.total_cliques_reserva),
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Acompanhe o desempenho dos seus ranchos
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="Total de Visualizações"
          value={totalVisualizacoes.toLocaleString()}
          description="Todas as páginas de ranchos"
          icon={Eye}
        />
        <AnalyticsCard
          title="Últimos 7 dias"
          value={visualizacoes7Dias.toLocaleString()}
          description="Visualizações recentes"
          icon={TrendingUp}
        />
        <AnalyticsCard
          title="Total de Cliques"
          value={totalCliques.toLocaleString()}
          description="WhatsApp + Reservas"
          icon={MousePointer}
        />
        <AnalyticsCard
          title="Taxa de Conversão"
          value={`${taxaConversaoGeral}%`}
          description="Cliques / Visualizações"
          icon={BarChart3}
        />
      </div>

      {/* Gráfico de Performance */}
      <RanchoPerformanceChart data={chartData} />

      {/* Tabela Detalhada */}
      <RanchoAnalyticsTable data={estatisticas || []} />
    </div>
  );
}
