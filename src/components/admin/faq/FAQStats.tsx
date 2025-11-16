import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, TrendingUp, AlertCircle } from "lucide-react";

interface FAQStatsProps {
  stats: {
    totalFaqs: number;
    totalVotos: number;
    taxaUtilidade: number;
    maisUteis: Array<{ pergunta: string; taxa_utilidade: number; total_votos: number }>;
    menosUteis: Array<{ pergunta: string; taxa_utilidade: number; total_votos: number }>;
  };
}

export const FAQStats = ({ stats }: FAQStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de FAQs</CardTitle>
          <Badge variant="outline">{stats.totalFaqs}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalFaqs}</div>
          <p className="text-xs text-muted-foreground">
            Perguntas cadastradas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Avaliações</CardTitle>
          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalVotos}</div>
          <p className="text-xs text-muted-foreground">
            Votos recebidos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Utilidade</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.taxaUtilidade.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Média geral de satisfação
          </p>
        </CardContent>
      </Card>

      {stats.maisUteis.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-green-500" />
              FAQs Mais Úteis
            </CardTitle>
            <CardDescription>
              Perguntas com melhor avaliação dos visitantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.maisUteis.map((faq, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{faq.pergunta}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {faq.total_votos} {faq.total_votos === 1 ? 'voto' : 'votos'}
                    </p>
                  </div>
                  <Badge variant="default" className="bg-green-500">
                    {faq.taxa_utilidade.toFixed(0)}% útil
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {stats.menosUteis.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              FAQs para Melhorar
            </CardTitle>
            <CardDescription>
              Perguntas com avaliações baixas que precisam de atenção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.menosUteis.map((faq, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-orange-200">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{faq.pergunta}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {faq.total_votos} {faq.total_votos === 1 ? 'voto' : 'votos'}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-orange-500 text-orange-500">
                    {faq.taxa_utilidade.toFixed(0)}% útil
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
