import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, MousePointer, TrendingUp, BarChart3 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Analytics {
  total_widget_aberto: number;
  total_mensagem_rapida: number;
  total_botao_whatsapp: number;
  taxa_conversao: number;
}

interface EventoTemporal {
  data: string;
  widget_aberto: number;
  mensagem_rapida: number;
  botao_whatsapp: number;
}

interface MensagemPopular {
  mensagem_tipo: string;
  total: number;
}

const WhatsAppAnalytics = () => {
  const [analytics, setAnalytics] = useState<Analytics>({
    total_widget_aberto: 0,
    total_mensagem_rapida: 0,
    total_botao_whatsapp: 0,
    taxa_conversao: 0,
  });
  const [eventosTempo, setEventosTempo] = useState<EventoTemporal[]>([]);
  const [mensagensPopulares, setMensagensPopulares] = useState<MensagemPopular[]>([]);
  const [periodo, setPeriodo] = useState<7 | 30>(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAnalytics();
  }, [periodo]);

  const carregarAnalytics = async () => {
    setLoading(true);
    try {
      const dataInicio = subDays(new Date(), periodo).toISOString();

      // Totais gerais
      const { data: eventos } = await supabase
        .from("whatsapp_analytics")
        .select("evento")
        .gte("created_at", dataInicio);

      const widgetAberto = eventos?.filter(e => e.evento === "widget_aberto").length || 0;
      const mensagemRapida = eventos?.filter(e => e.evento === "mensagem_rapida").length || 0;
      const botaoWhatsapp = eventos?.filter(e => e.evento === "botao_whatsapp").length || 0;

      const taxaConversao = widgetAberto > 0 
        ? ((mensagemRapida + botaoWhatsapp) / widgetAberto) * 100 
        : 0;

      setAnalytics({
        total_widget_aberto: widgetAberto,
        total_mensagem_rapida: mensagemRapida,
        total_botao_whatsapp: botaoWhatsapp,
        taxa_conversao: taxaConversao,
      });

      // Eventos ao longo do tempo
      const { data: eventosCompletos } = await supabase
        .from("whatsapp_analytics")
        .select("evento, created_at")
        .gte("created_at", dataInicio)
        .order("created_at", { ascending: true });

      const eventosPorDia: { [key: string]: EventoTemporal } = {};
      
      eventosCompletos?.forEach((evento) => {
        const data = format(new Date(evento.created_at), "dd/MM", { locale: ptBR });
        
        if (!eventosPorDia[data]) {
          eventosPorDia[data] = {
            data,
            widget_aberto: 0,
            mensagem_rapida: 0,
            botao_whatsapp: 0,
          };
        }
        
        if (evento.evento === "widget_aberto") eventosPorDia[data].widget_aberto++;
        if (evento.evento === "mensagem_rapida") eventosPorDia[data].mensagem_rapida++;
        if (evento.evento === "botao_whatsapp") eventosPorDia[data].botao_whatsapp++;
      });

      setEventosTempo(Object.values(eventosPorDia));

      // Mensagens mais populares
      const { data: mensagens } = await supabase
        .from("whatsapp_analytics")
        .select("mensagem_tipo")
        .eq("evento", "mensagem_rapida")
        .gte("created_at", dataInicio)
        .not("mensagem_tipo", "is", null);

      const contagemMensagens: { [key: string]: number } = {};
      mensagens?.forEach((m) => {
        if (m.mensagem_tipo) {
          contagemMensagens[m.mensagem_tipo] = (contagemMensagens[m.mensagem_tipo] || 0) + 1;
        }
      });

      const mensagensArray = Object.entries(contagemMensagens)
        .map(([mensagem_tipo, total]) => ({ mensagem_tipo, total }))
        .sort((a, b) => b.total - a.total);

      setMensagensPopulares(mensagensArray);
    } catch (error) {
      console.error("Erro ao carregar analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics WhatsApp</h1>
            <p className="text-muted-foreground">
              Acompanhe o desempenho do widget de WhatsApp
            </p>
          </div>
          
          <Tabs value={periodo.toString()} onValueChange={(v) => setPeriodo(Number(v) as 7 | 30)}>
            <TabsList>
              <TabsTrigger value="7">7 dias</TabsTrigger>
              <TabsTrigger value="30">30 dias</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Widget Aberto</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.total_widget_aberto}</div>
              <p className="text-xs text-muted-foreground">
                Visualizações do widget
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensagens Rápidas</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.total_mensagem_rapida}</div>
              <p className="text-xs text-muted-foreground">
                Cliques em mensagens pré-definidas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Botão WhatsApp</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.total_botao_whatsapp}</div>
              <p className="text-xs text-muted-foreground">
                Cliques diretos no botão
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.taxa_conversao.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Ações / Visualizações
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Eventos ao Longo do Tempo */}
        <Card>
          <CardHeader>
            <CardTitle>Eventos ao Longo do Tempo</CardTitle>
            <CardDescription>
              Visualização diária das interações com o widget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={eventosTempo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="widget_aberto" 
                  stroke="hsl(var(--primary))" 
                  name="Widget Aberto"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="mensagem_rapida" 
                  stroke="hsl(var(--chart-2))" 
                  name="Mensagem Rápida"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="botao_whatsapp" 
                  stroke="hsl(var(--chart-3))" 
                  name="Botão WhatsApp"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mensagens Mais Clicadas */}
        <Card>
          <CardHeader>
            <CardTitle>Mensagens Mais Clicadas</CardTitle>
            <CardDescription>
              Ranking das mensagens rápidas mais populares
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mensagensPopulares.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mensagensPopulares}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mensagem_tipo" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="hsl(var(--primary))" name="Cliques" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Nenhuma mensagem rápida clicada ainda
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
};

export default WhatsAppAnalytics;
