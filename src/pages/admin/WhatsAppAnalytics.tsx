import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, MousePointer, TrendingUp, BarChart3, Download, Calendar as CalendarIcon } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  const [analyticsComparacao, setAnalyticsComparacao] = useState<Analytics | null>(null);
  const [eventosTempo, setEventosTempo] = useState<EventoTemporal[]>([]);
  const [mensagensPopulares, setMensagensPopulares] = useState<MensagemPopular[]>([]);
  const [periodo, setPeriodo] = useState<7 | 30 | "custom">(7);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [compararPeriodos, setCompararPeriodos] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAnalytics();
  }, [periodo, dateRange, compararPeriodos]);

  const carregarAnalytics = async () => {
    setLoading(true);
    try {
      let dataInicio: string;
      let dataFim: string;
      
      if (periodo === "custom" && dateRange?.from) {
        dataInicio = startOfDay(dateRange.from).toISOString();
        dataFim = dateRange.to ? endOfDay(dateRange.to).toISOString() : endOfDay(new Date()).toISOString();
      } else if (typeof periodo === "number") {
        dataInicio = subDays(new Date(), periodo).toISOString();
        dataFim = new Date().toISOString();
      } else {
        return;
      }

      // Totais gerais
      const { data: eventos } = await supabase
        .from("whatsapp_analytics")
        .select("evento")
        .gte("created_at", dataInicio)
        .lte("created_at", dataFim);

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

      // Comparação de períodos
      if (compararPeriodos && typeof periodo === "number") {
        const periodoAnteriorInicio = subDays(new Date(dataInicio), periodo).toISOString();
        const periodoAnteriorFim = dataInicio;
        
        const { data: eventosAnteriores } = await supabase
          .from("whatsapp_analytics")
          .select("evento")
          .gte("created_at", periodoAnteriorInicio)
          .lte("created_at", periodoAnteriorFim);

        const widgetAbertoAnterior = eventosAnteriores?.filter(e => e.evento === "widget_aberto").length || 0;
        const mensagemRapidaAnterior = eventosAnteriores?.filter(e => e.evento === "mensagem_rapida").length || 0;
        const botaoWhatsappAnterior = eventosAnteriores?.filter(e => e.evento === "botao_whatsapp").length || 0;

        setAnalyticsComparacao({
          total_widget_aberto: widgetAbertoAnterior,
          total_mensagem_rapida: mensagemRapidaAnterior,
          total_botao_whatsapp: botaoWhatsappAnterior,
          taxa_conversao: widgetAbertoAnterior > 0 ? ((mensagemRapidaAnterior + botaoWhatsappAnterior) / widgetAbertoAnterior) * 100 : 0,
        });
      } else {
        setAnalyticsComparacao(null);
      }

      // Eventos ao longo do tempo
      const { data: eventosCompletos } = await supabase
        .from("whatsapp_analytics")
        .select("evento, created_at")
        .gte("created_at", dataInicio)
        .lte("created_at", dataFim)
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
        .lte("created_at", dataFim)
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

  const exportarCSV = () => {
    // Cabeçalhos
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Métrica,Valor\n";
    csvContent += `Widget Aberto,${analytics.total_widget_aberto}\n`;
    csvContent += `Mensagens Rápidas,${analytics.total_mensagem_rapida}\n`;
    csvContent += `Botão WhatsApp,${analytics.total_botao_whatsapp}\n`;
    csvContent += `Taxa de Conversão,${analytics.taxa_conversao.toFixed(1)}%\n\n`;
    
    csvContent += "Eventos ao Longo do Tempo\n";
    csvContent += "Data,Widget Aberto,Mensagem Rápida,Botão WhatsApp\n";
    eventosTempo.forEach(evento => {
      csvContent += `${evento.data},${evento.widget_aberto},${evento.mensagem_rapida},${evento.botao_whatsapp}\n`;
    });
    
    csvContent += "\nMensagens Mais Clicadas\n";
    csvContent += "Mensagem,Total de Cliques\n";
    mensagensPopulares.forEach(msg => {
      csvContent += `${msg.mensagem_tipo},${msg.total}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `whatsapp-analytics-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text("Analytics WhatsApp", 14, 20);
    doc.setFontSize(11);
    doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}`, 14, 28);
    
    // Resumo de métricas
    autoTable(doc, {
      startY: 35,
      head: [["Métrica", "Valor"]],
      body: [
        ["Widget Aberto", analytics.total_widget_aberto.toString()],
        ["Mensagens Rápidas", analytics.total_mensagem_rapida.toString()],
        ["Botão WhatsApp", analytics.total_botao_whatsapp.toString()],
        ["Taxa de Conversão", `${analytics.taxa_conversao.toFixed(1)}%`],
      ],
    });
    
    // Eventos ao longo do tempo
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [["Data", "Widget Aberto", "Mensagem Rápida", "Botão WhatsApp"]],
      body: eventosTempo.map(e => [
        e.data,
        e.widget_aberto.toString(),
        e.mensagem_rapida.toString(),
        e.botao_whatsapp.toString()
      ]),
    });
    
    // Mensagens mais clicadas
    if (mensagensPopulares.length > 0) {
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [["Mensagem", "Total de Cliques"]],
        body: mensagensPopulares.map(m => [m.mensagem_tipo, m.total.toString()]),
      });
    }
    
    doc.save(`whatsapp-analytics-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  const calcularVariacao = (atual: number, anterior: number) => {
    if (anterior === 0) return atual > 0 ? 100 : 0;
    return ((atual - anterior) / anterior) * 100;
  };

  return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics WhatsApp</h1>
              <p className="text-muted-foreground">
                Acompanhe o desempenho do widget de WhatsApp
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportarCSV}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={exportarPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <Tabs value={periodo.toString()} onValueChange={(v) => setPeriodo(v === "custom" ? "custom" : Number(v) as 7 | 30)}>
              <TabsList>
                <TabsTrigger value="7">7 dias</TabsTrigger>
                <TabsTrigger value="30">30 dias</TabsTrigger>
                <TabsTrigger value="custom">Personalizado</TabsTrigger>
              </TabsList>
            </Tabs>

            {periodo === "custom" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Selecionar período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            )}

            {typeof periodo === "number" && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="comparar"
                  checked={compararPeriodos}
                  onCheckedChange={setCompararPeriodos}
                />
                <Label htmlFor="comparar">Comparar com período anterior</Label>
              </div>
            )}
          </div>
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
              {analyticsComparacao && (
                <p className={cn(
                  "text-xs font-medium mt-1",
                  calcularVariacao(analytics.total_widget_aberto, analyticsComparacao.total_widget_aberto) >= 0 
                    ? "text-green-600" 
                    : "text-red-600"
                )}>
                  {calcularVariacao(analytics.total_widget_aberto, analyticsComparacao.total_widget_aberto) >= 0 ? "+" : ""}
                  {calcularVariacao(analytics.total_widget_aberto, analyticsComparacao.total_widget_aberto).toFixed(1)}% vs período anterior
                </p>
              )}
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
              {analyticsComparacao && (
                <p className={cn(
                  "text-xs font-medium mt-1",
                  calcularVariacao(analytics.total_mensagem_rapida, analyticsComparacao.total_mensagem_rapida) >= 0 
                    ? "text-green-600" 
                    : "text-red-600"
                )}>
                  {calcularVariacao(analytics.total_mensagem_rapida, analyticsComparacao.total_mensagem_rapida) >= 0 ? "+" : ""}
                  {calcularVariacao(analytics.total_mensagem_rapida, analyticsComparacao.total_mensagem_rapida).toFixed(1)}% vs período anterior
                </p>
              )}
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
              {analyticsComparacao && (
                <p className={cn(
                  "text-xs font-medium mt-1",
                  calcularVariacao(analytics.total_botao_whatsapp, analyticsComparacao.total_botao_whatsapp) >= 0 
                    ? "text-green-600" 
                    : "text-red-600"
                )}>
                  {calcularVariacao(analytics.total_botao_whatsapp, analyticsComparacao.total_botao_whatsapp) >= 0 ? "+" : ""}
                  {calcularVariacao(analytics.total_botao_whatsapp, analyticsComparacao.total_botao_whatsapp).toFixed(1)}% vs período anterior
                </p>
              )}
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
              {analyticsComparacao && (
                <p className={cn(
                  "text-xs font-medium mt-1",
                  calcularVariacao(analytics.taxa_conversao, analyticsComparacao.taxa_conversao) >= 0 
                    ? "text-green-600" 
                    : "text-red-600"
                )}>
                  {calcularVariacao(analytics.taxa_conversao, analyticsComparacao.taxa_conversao) >= 0 ? "+" : ""}
                  {calcularVariacao(analytics.taxa_conversao, analyticsComparacao.taxa_conversao).toFixed(1)}% vs período anterior
                </p>
              )}
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
