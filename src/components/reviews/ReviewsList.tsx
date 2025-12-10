import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReviewCard } from "./ReviewCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

interface ReviewsListProps {
  ranchoId: string;
}

export const ReviewsList = ({ ranchoId }: ReviewsListProps) => {
  const { data: avaliacoes, isLoading } = useQuery({
    queryKey: ["avaliacoes", ranchoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("avaliacoes")
        .select("id, nome_usuario, nota, comentario, resposta_admin, created_at, verificado, imagens")
        .eq("rancho_id", ranchoId)
        .eq("verificado", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const mediaNotas = avaliacoes?.length
    ? (avaliacoes.reduce((acc, av) => acc + av.nota, 0) / avaliacoes.length).toFixed(1)
    : "0.0";

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (!avaliacoes || avaliacoes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Ainda não há avaliações para este rancho.</p>
        <p className="text-sm mt-2">Seja o primeiro a avaliar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold">{mediaNotas}</div>
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(Number(mediaNotas))
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {avaliacoes.length} {avaliacoes.length === 1 ? "avaliação" : "avaliações"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {avaliacoes.map((avaliacao) => (
          <ReviewCard key={avaliacao.id} {...avaliacao} />
        ))}
      </div>
    </div>
  );
};
