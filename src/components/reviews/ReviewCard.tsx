import { Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReviewCardProps {
  nome_usuario: string;
  nota: number;
  comentario: string;
  resposta_admin?: string;
  created_at: string;
  verificado: boolean;
}

export const ReviewCard = ({ 
  nome_usuario, 
  nota, 
  comentario, 
  resposta_admin,
  created_at,
  verificado 
}: ReviewCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold">{nome_usuario}</h4>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(created_at), { 
                addSuffix: true,
                locale: ptBR 
              })}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < nota ? "fill-yellow-400 text-yellow-400" : "text-muted"
                }`}
              />
            ))}
          </div>
        </div>
        {!verificado && (
          <Badge variant="secondary" className="w-fit">
            Aguardando verificação
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">{comentario}</p>
        {resposta_admin && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs font-semibold text-muted-foreground mb-1">
              Resposta do Rancho
            </p>
            <p className="text-sm">{resposta_admin}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
