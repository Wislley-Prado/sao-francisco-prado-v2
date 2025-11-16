import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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

interface FAQ {
  id: string;
  pergunta: string;
  resposta: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  pacote_id?: string | null;
  rancho_id?: string | null;
  pacotes?: { nome: string } | null;
  ranchos?: { nome: string } | null;
  votos_stats?: {
    total_votos: number;
    votos_uteis: number;
    votos_nao_uteis: number;
    taxa_utilidade: number;
  };
}

interface FAQTableProps {
  faqs: FAQ[];
  onUpdate: () => void;
}

export const FAQTable = ({ faqs, onUpdate }: FAQTableProps) => {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("faqs")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast.success("FAQ excluído com sucesso!");
      onUpdate();
    } catch (error) {
      console.error("Erro ao excluir FAQ:", error);
      toast.error("Erro ao excluir FAQ");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Ordem</TableHead>
              <TableHead>Pergunta</TableHead>
              <TableHead className="w-[150px]">Exibir em</TableHead>
              <TableHead className="w-[150px]">Avaliações</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[150px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhum FAQ encontrado
                </TableCell>
              </TableRow>
            ) : (
              faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-medium">{faq.ordem}</TableCell>
                  <TableCell>
                    <div className="max-w-lg">
                      <p className="font-medium truncate">{faq.pergunta}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {faq.resposta.substring(0, 100)}...
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {faq.pacote_id && faq.pacotes ? (
                      <Badge variant="outline">📦 {faq.pacotes.nome}</Badge>
                    ) : faq.rancho_id && faq.ranchos ? (
                      <Badge variant="outline">🏡 {faq.ranchos.nome}</Badge>
                    ) : (
                      <Badge>🌍 Global</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {faq.votos_stats && faq.votos_stats.total_votos > 0 ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={faq.votos_stats.taxa_utilidade >= 70 ? "default" : "outline"}
                            className={faq.votos_stats.taxa_utilidade >= 70 ? "bg-green-500" : ""}
                          >
                            {faq.votos_stats.taxa_utilidade.toFixed(0)}% útil
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {faq.votos_stats.votos_uteis} 👍 / {faq.votos_stats.votos_nao_uteis} 👎
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Sem votos</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={faq.ativo ? "default" : "secondary"}>
                      {faq.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/faqs/editar/${faq.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(faq.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este FAQ? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
