import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, Star } from "lucide-react";
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

interface Depoimento {
  id: string;
  nome: string;
  cargo: string | null;
  foto_url: string | null;
  depoimento: string;
  rating: number;
  ordem: number;
  ativo: boolean;
  created_at: string;
}

interface DepoimentoTableProps {
  depoimentos: Depoimento[];
  onUpdate: () => void;
}

export const DepoimentoTable = ({ depoimentos, onUpdate }: DepoimentoTableProps) => {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("depoimentos")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast.success("Depoimento excluído com sucesso!");
      onUpdate();
    } catch (error) {
      console.error("Erro ao excluir depoimento:", error);
      toast.error("Erro ao excluir depoimento");
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
              <TableHead>Cliente</TableHead>
              <TableHead>Depoimento</TableHead>
              <TableHead className="w-[120px]">Avaliação</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[150px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {depoimentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhum depoimento encontrado
                </TableCell>
              </TableRow>
            ) : (
              depoimentos.map((depoimento) => (
                <TableRow key={depoimento.id}>
                  <TableCell className="font-medium">{depoimento.ordem}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={depoimento.foto_url || undefined} />
                        <AvatarFallback>
                          {depoimento.nome.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{depoimento.nome}</p>
                        {depoimento.cargo && (
                          <p className="text-sm text-muted-foreground">{depoimento.cargo}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-md truncate text-sm">
                      {depoimento.depoimento}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: depoimento.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={depoimento.ativo ? "default" : "secondary"}>
                      {depoimento.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/depoimentos/editar/${depoimento.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(depoimento.id)}
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
              Tem certeza que deseja excluir este depoimento? Esta ação não pode ser desfeita.
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
