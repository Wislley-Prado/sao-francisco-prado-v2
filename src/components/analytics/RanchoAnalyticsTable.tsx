import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, MousePointer } from "lucide-react";

interface RanchoStats {
  id: string;
  nome: string;
  slug: string;
  total_visualizacoes: number;
  total_cliques_whatsapp: number;
  total_cliques_reserva: number;
  taxa_conversao: number;
  visualizacoes_7_dias: number;
  visualizacoes_30_dias: number;
}

interface RanchoAnalyticsTableProps {
  data: RanchoStats[];
}

export const RanchoAnalyticsTable = ({ data }: RanchoAnalyticsTableProps) => {
  const sortedData = [...data].sort((a, b) => b.total_visualizacoes - a.total_visualizacoes);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas Detalhadas por Rancho</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rancho</TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Eye className="h-4 w-4" />
                  Total
                </div>
              </TableHead>
              <TableHead className="text-center">7 dias</TableHead>
              <TableHead className="text-center">30 dias</TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <MousePointer className="h-4 w-4" />
                  Cliques
                </div>
              </TableHead>
              <TableHead className="text-center">Taxa Conv.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((rancho) => (
              <TableRow key={rancho.id}>
                <TableCell className="font-medium">{rancho.nome}</TableCell>
                <TableCell className="text-center">{rancho.total_visualizacoes}</TableCell>
                <TableCell className="text-center">{rancho.visualizacoes_7_dias}</TableCell>
                <TableCell className="text-center">{rancho.visualizacoes_30_dias}</TableCell>
                <TableCell className="text-center">
                  {rancho.total_cliques_whatsapp + rancho.total_cliques_reserva}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={rancho.taxa_conversao > 5 ? "default" : "secondary"}>
                    {rancho.taxa_conversao}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
