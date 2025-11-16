import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface RanchoPerformanceChartProps {
  data: {
    nome: string;
    visualizacoes: number;
    cliques: number;
  }[];
}

export const RanchoPerformanceChart = ({ data }: RanchoPerformanceChartProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Desempenho por Rancho</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nome" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="visualizacoes" fill="hsl(var(--primary))" name="Visualizações" />
            <Bar dataKey="cliques" fill="hsl(var(--chart-2))" name="Cliques" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
