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
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[150px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
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
