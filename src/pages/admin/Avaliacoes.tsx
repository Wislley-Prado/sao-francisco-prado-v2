import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Star, Check, X, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Avaliacoes() {
  const queryClient = useQueryClient();
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [showResponseForm, setShowResponseForm] = useState<Record<string, boolean>>({});

  const { data: avaliacoes, isLoading } = useQuery({
    queryKey: ["admin-avaliacoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("avaliacoes")
        .select(`
          *,
          ranchos!inner (nome)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Array<{ id: string; nome_usuario: string; nota: number; comentario: string; resposta_admin: string | null; created_at: string; verificado: boolean; email: string; ranchos: { nome: string } }>;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, unknown> }) => {
      const { error } = await supabase
        .from("avaliacoes")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-avaliacoes"] });
      toast.success("Avaliação atualizada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar avaliação");
    },
  });

  const handleVerificar = (id: string) => {
    updateMutation.mutate({ id, updates: { verificado: true } });
  };

  const handleRejeitar = (id: string) => {
    if (confirm("Deseja realmente rejeitar esta avaliação?")) {
      updateMutation.mutate({ id, updates: { verificado: false } });
    }
  };

  const handleResponder = (id: string) => {
    const resposta = respostas[id];
    if (!resposta?.trim()) {
      toast.error("Digite uma resposta");
      return;
    }

    updateMutation.mutate(
      { id, updates: { resposta_admin: resposta } },
      {
        onSuccess: () => {
          setRespostas((prev) => ({ ...prev, [id]: "" }));
          setShowResponseForm((prev) => ({ ...prev, [id]: false }));
        },
      }
    );
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const pendentes = avaliacoes?.filter((a) => !a.verificado) || [];
  const verificadas = avaliacoes?.filter((a) => a.verificado) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Avaliações</h1>
        <p className="text-muted-foreground">Gerencie as avaliações dos ranchos</p>
      </div>

      {pendentes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pendentes de aprovação</h2>
          {pendentes.map((avaliacao) => (
            <Card key={avaliacao.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{avaliacao.nome_usuario}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {avaliacao.ranchos?.nome}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(avaliacao.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < avaliacao.nota
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{avaliacao.comentario}</p>
                <p className="text-xs text-muted-foreground">Email: {avaliacao.email}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleVerificar(avaliacao.id)}
                    disabled={updateMutation.isPending}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRejeitar(avaliacao.id)}
                    disabled={updateMutation.isPending}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Rejeitar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Avaliações aprovadas</h2>
        {verificadas.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma avaliação aprovada ainda.</p>
        ) : (
          verificadas.map((avaliacao) => (
            <Card key={avaliacao.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{avaliacao.nome_usuario}</CardTitle>
                      <Badge variant="secondary">Aprovada</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {avaliacao.ranchos?.nome}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(avaliacao.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < avaliacao.nota
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{avaliacao.comentario}</p>

                {avaliacao.resposta_admin ? (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      Sua resposta
                    </p>
                    <p className="text-sm">{avaliacao.resposta_admin}</p>
                  </div>
                ) : (
                  <>
                    {!showResponseForm[avaliacao.id] ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setShowResponseForm((prev) => ({ ...prev, [avaliacao.id]: true }))
                        }
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Responder
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Digite sua resposta..."
                          value={respostas[avaliacao.id] || ""}
                          onChange={(e) =>
                            setRespostas((prev) => ({
                              ...prev,
                              [avaliacao.id]: e.target.value,
                            }))
                          }
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleResponder(avaliacao.id)}
                            disabled={updateMutation.isPending}
                          >
                            Enviar resposta
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setShowResponseForm((prev) => ({
                                ...prev,
                                [avaliacao.id]: false,
                              }))
                            }
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
