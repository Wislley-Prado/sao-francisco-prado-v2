import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Eye, MousePointerClick, ShoppingCart, TrendingUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface PacoteAnalyticsData {
  id: string;
  nome: string;
  slug: string;
  total_visualizacoes: number;
  total_cliques_reserva: number;
  total_cliques_whatsapp: number;
  total_conversoes: number;
  visualizacoes_7_dias: number;
  visualizacoes_30_dias: number;
  taxa_conversao: number;
}

const PacoteAnalytics = () => {
  const { data: analyticsData = [], isLoading } = useQuery({
    queryKey: ['pacote-analytics'],
    queryFn: async () => {
      // Buscar todos os pacotes
      const { data: pacotes, error: pacotesError } = await supabase
        .from('pacotes')
        .select('id, nome, slug')
        .eq('ativo', true);

      if (pacotesError) throw pacotesError;

      // Buscar analytics para cada pacote
      const analyticsPromises = pacotes?.map(async (pacote) => {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Total de visualizações
        const { count: totalVisualizacoes } = await supabase
          .from('pacote_analytics')
          .select('*', { count: 'exact', head: true })
          .eq('pacote_id', pacote.id)
          .eq('evento', 'visualizacao');

        // Total de cliques em reserva
        const { count: totalCliquesReserva } = await supabase
          .from('pacote_analytics')
          .select('*', { count: 'exact', head: true })
          .eq('pacote_id', pacote.id)
          .eq('evento', 'clique_reserva');

        // Total de cliques no WhatsApp
        const { count: totalCliquesWhatsapp } = await supabase
          .from('pacote_analytics')
          .select('*', { count: 'exact', head: true })
          .eq('pacote_id', pacote.id)
          .eq('evento', 'clique_whatsapp');

        // Total de conversões
        const { count: totalConversoes } = await supabase
          .from('pacote_analytics')
          .select('*', { count: 'exact', head: true })
          .eq('pacote_id', pacote.id)
          .eq('evento', 'conversao');

        // Visualizações últimos 7 dias
        const { count: visualizacoes7Dias } = await supabase
          .from('pacote_analytics')
          .select('*', { count: 'exact', head: true })
          .eq('pacote_id', pacote.id)
          .eq('evento', 'visualizacao')
          .gte('created_at', sevenDaysAgo.toISOString());

        // Visualizações últimos 30 dias
        const { count: visualizacoes30Dias } = await supabase
          .from('pacote_analytics')
          .select('*', { count: 'exact', head: true })
          .eq('pacote_id', pacote.id)
          .eq('evento', 'visualizacao')
          .gte('created_at', thirtyDaysAgo.toISOString());

        const taxaConversao = totalVisualizacoes 
          ? ((totalConversoes || 0) / totalVisualizacoes) * 100 
          : 0;

        return {
          id: pacote.id,
          nome: pacote.nome,
          slug: pacote.slug,
          total_visualizacoes: totalVisualizacoes || 0,
          total_cliques_reserva: totalCliquesReserva || 0,
          total_cliques_whatsapp: totalCliquesWhatsapp || 0,
          total_conversoes: totalConversoes || 0,
          visualizacoes_7_dias: visualizacoes7Dias || 0,
          visualizacoes_30_dias: visualizacoes30Dias || 0,
          taxa_conversao: taxaConversao,
        };
      }) || [];

      const analytics = await Promise.all(analyticsPromises);
      return analytics.sort((a, b) => b.total_visualizacoes - a.total_visualizacoes);
    },
  });

  const totais = analyticsData.reduce(
    (acc, item) => ({
      visualizacoes: acc.visualizacoes + item.total_visualizacoes,
      cliquesReserva: acc.cliquesReserva + item.total_cliques_reserva,
      cliquesWhatsapp: acc.cliquesWhatsapp + item.total_cliques_whatsapp,
      conversoes: acc.conversoes + item.total_conversoes,
    }),
    { visualizacoes: 0, cliquesReserva: 0, cliquesWhatsapp: 0, conversoes: 0 }
  );

  const taxaConversaoGeral = totais.visualizacoes 
    ? (totais.conversoes / totais.visualizacoes) * 100 
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics de Pacotes</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe o desempenho e conversões dos seus pacotes
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totais.visualizacoes}</div>
            <p className="text-xs text-muted-foreground">Total de visualizações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques em Reserva</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totais.cliquesReserva}</div>
            <p className="text-xs text-muted-foreground">Interesse em reservar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totais.conversoes}</div>
            <p className="text-xs text-muted-foreground">Conversões confirmadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taxaConversaoGeral.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Taxa geral</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Pacote</CardTitle>
          <CardDescription>
            Análise detalhada de cada pacote de pescaria
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analyticsData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">Nenhum dado disponível</p>
              <p className="text-sm">
                Os dados de analytics aparecerão aqui quando houver visualizações
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pacote</TableHead>
                    <TableHead className="text-center">Visualizações</TableHead>
                    <TableHead className="text-center">7 Dias</TableHead>
                    <TableHead className="text-center">30 Dias</TableHead>
                    <TableHead className="text-center">Cliques Reserva</TableHead>
                    <TableHead className="text-center">WhatsApp</TableHead>
                    <TableHead className="text-center">Conversões</TableHead>
                    <TableHead className="text-center">Taxa Conv.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell className="text-center">
                        {item.total_visualizacoes}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.visualizacoes_7_dias}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.visualizacoes_30_dias}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.total_cliques_reserva}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.total_cliques_whatsapp}
                      </TableCell>
                      <TableCell className="text-center text-green-600 font-semibold">
                        {item.total_conversoes}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={item.taxa_conversao > 5 ? 'default' : 'secondary'}>
                          {item.taxa_conversao.toFixed(2)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como usar o Analytics</CardTitle>
          <CardDescription>
            Guia para rastrear conversões e otimizar seus pacotes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">1. Eventos Rastreados Automaticamente:</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li><strong>Visualização:</strong> Quando alguém abre a página do pacote</li>
              <li><strong>Clique Reserva:</strong> Quando clica no botão de reservar</li>
              <li><strong>Clique WhatsApp:</strong> Quando clica para falar no WhatsApp</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">2. Como Registrar Conversões:</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Para rastrear conversões (vendas confirmadas), você precisa chamar manualmente a função quando confirmar uma venda:
            </p>
            <div className="bg-muted p-3 rounded-md font-mono text-xs">
              import {'{'} registrarEventoPacote {'}'} from '@/hooks/usePacoteAnalytics';
              <br /><br />
              registrarEventoPacote(pacoteId, 'conversao');
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">3. Códigos de Tracking Personalizados:</h4>
            <p className="text-sm text-muted-foreground">
              Configure códigos de tracking específicos (Facebook Pixel, Google Analytics, etc.) na aba "Tracking" ao editar cada pacote. Estes códigos serão disparados automaticamente em eventos importantes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PacoteAnalytics;
