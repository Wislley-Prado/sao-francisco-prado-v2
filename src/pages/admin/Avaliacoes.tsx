import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Star, Check, X, MessageSquare, Trash2, Image, Filter } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Avaliacoes() {
  const queryClient = useQueryClient();
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [showResponseForm, setShowResponseForm] = useState<Record<string, boolean>>({});
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; avaliacao: any | null }>({
    open: false,
    avaliacao: null,
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Filtros
  const [filtroRancho, setFiltroRancho] = useState<string>("todos");
  const [filtroNota, setFiltroNota] = useState<string>("todas");

  const { data: avaliacoes, isLoading } = useQuery({
    queryKey: ["admin-avaliacoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("avaliacoes")
        .select(`
          *,
          ranchos!inner (id, nome)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as any[];
    },
  });

  // Lista de ranchos únicos para o filtro
  const ranchosUnicos = useMemo(() => {
    if (!avaliacoes) return [];
    const ranchosMap = new Map();
    avaliacoes.forEach((av) => {
      if (av.ranchos && !ranchosMap.has(av.ranchos.id)) {
        ranchosMap.set(av.ranchos.id, av.ranchos.nome);
      }
    });
    return Array.from(ranchosMap.entries()).map(([id, nome]) => ({ id, nome }));
  }, [avaliacoes]);

  // Avaliações filtradas
  const avaliacoesFiltradas = useMemo(() => {
    if (!avaliacoes) return [];
    return avaliacoes.filter((av) => {
      const matchRancho = filtroRancho === "todos" || av.ranchos?.id === filtroRancho;
      const matchNota = filtroNota === "todas" || av.nota === parseInt(filtroNota);
      return matchRancho && matchNota;
    });
  }, [avaliacoes, filtroRancho, filtroNota]);
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("avaliacoes")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-avaliacoes"] });
      toast.success("Avaliação excluída com sucesso!");
      setDeleteDialog({ open: false, avaliacao: null });
    },
    onError: () => {
      toast.error("Erro ao excluir avaliação");
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

  const handleDelete = () => {
    if (deleteDialog.avaliacao) {
      deleteMutation.mutate(deleteDialog.avaliacao.id);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const pendentes = avaliacoesFiltradas.filter((a) => !a.verificado);
  const verificadas = avaliacoesFiltradas.filter((a) => a.verificado);

  const totalPendentes = avaliacoes?.filter((a) => !a.verificado).length || 0;
  const totalVerificadas = avaliacoes?.filter((a) => a.verificado).length || 0;

  const ImageGallery = ({ images }: { images: string[] }) => {
    if (!images || images.length === 0) return null;
    
    return (
      <div className="flex gap-2 flex-wrap mt-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(img)}
            className="relative h-14 w-14 rounded-lg overflow-hidden hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <img
              src={img}
              alt={`Foto ${i + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
        <Badge variant="outline" className="self-center">
          <Image className="h-3 w-3 mr-1" />
          {images.length} foto(s)
        </Badge>
      </div>
    );
  };

  const limparFiltros = () => {
    setFiltroRancho("todos");
    setFiltroNota("todas");
  };

  const temFiltrosAtivos = filtroRancho !== "todos" || filtroNota !== "todas";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Avaliações</h1>
          <p className="text-muted-foreground">
            Gerencie as avaliações dos ranchos
            <span className="ml-2">
              ({totalPendentes} pendente{totalPendentes !== 1 ? "s" : ""}, {totalVerificadas} aprovada{totalVerificadas !== 1 ? "s" : ""})
            </span>
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filtros
            </div>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Rancho</label>
                <Select value={filtroRancho} onValueChange={setFiltroRancho}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os ranchos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os ranchos</SelectItem>
                    {ranchosUnicos.map((rancho) => (
                      <SelectItem key={rancho.id} value={rancho.id}>
                        {rancho.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Nota</label>
                <Select value={filtroNota} onValueChange={setFiltroNota}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as notas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as notas</SelectItem>
                    {[5, 4, 3, 2, 1].map((nota) => (
                      <SelectItem key={nota} value={nota.toString()}>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < nota ? "fill-yellow-400 text-yellow-400" : "text-muted"
                              }`}
                            />
                          ))}
                          <span className="ml-1">({nota})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {temFiltrosAtivos && (
              <Button variant="ghost" size="sm" onClick={limparFiltros}>
                Limpar filtros
              </Button>
            )}
          </div>

          {temFiltrosAtivos && (
            <p className="text-sm text-muted-foreground mt-3">
              Mostrando {avaliacoesFiltradas.length} de {avaliacoes?.length || 0} avaliações
            </p>
          )}
        </CardContent>
      </Card>

      {pendentes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Pendentes de aprovação
            <Badge variant="secondary" className="ml-2">{pendentes.length}</Badge>
          </h2>
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
                        className={`h-4 w-4 ${
                          i < avaliacao.nota
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
                <ImageGallery images={avaliacao.imagens} />
                <p className="text-xs text-muted-foreground">Email: {avaliacao.email}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleVerificar(avaliacao.id)}
                    disabled={updateMutation.isPending || deleteMutation.isPending}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRejeitar(avaliacao.id)}
                    disabled={updateMutation.isPending || deleteMutation.isPending}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Rejeitar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteDialog({ open: true, avaliacao })}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Avaliações aprovadas
          <Badge variant="secondary" className="ml-2">{verificadas.length}</Badge>
        </h2>
        {verificadas.length === 0 ? (
          <p className="text-muted-foreground">
            {temFiltrosAtivos 
              ? "Nenhuma avaliação encontrada com os filtros selecionados." 
              : "Nenhuma avaliação aprovada ainda."}
          </p>
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
                        className={`h-4 w-4 ${
                          i < avaliacao.nota
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
                <ImageGallery images={avaliacao.imagens} />

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
                      <div className="flex gap-2">
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteDialog({ open: true, avaliacao })}
                          disabled={deleteMutation.isPending}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
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

                {/* Botão excluir para avaliações com resposta */}
                {avaliacao.resposta_admin && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteDialog({ open: true, avaliacao })}
                    disabled={deleteMutation.isPending}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir avaliação
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, avaliacao: open ? deleteDialog.avaliacao : null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir avaliação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a avaliação de{" "}
              <strong>{deleteDialog.avaliacao?.nome_usuario}</strong> sobre o rancho{" "}
              <strong>{deleteDialog.avaliacao?.ranchos?.nome}</strong>?
              <br />
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal para visualização de imagem */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Foto da avaliação"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
