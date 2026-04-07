import { useState } from "react";
import { Trash2, AlertTriangle, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WhatsAppDataCleanupProps {
  dataInicio?: Date;
  dataFim?: Date;
  onCleanupComplete: () => void;
  onExport: () => void;
}

export const WhatsAppDataCleanup = ({
  dataInicio,
  dataFim,
  onCleanupComplete,
  onExport
}: WhatsAppDataCleanupProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tipo, setTipo] = useState<"periodo" | "antigos" | "tudo">("periodo");
  const [diasAntigos, setDiasAntigos] = useState("30");
  const [confirmado, setConfirmado] = useState(false);
  const [loading, setLoading] = useState(false);

  const getMensagemConfirmacao = () => {
    switch (tipo) {
      case "periodo":
        return `Serão excluídos todos os registros do período selecionado (${dataInicio?.toLocaleDateString()} - ${dataFim?.toLocaleDateString()}).`;
      case "antigos":
        return `Serão excluídos todos os registros com mais de ${diasAntigos} dias.`;
      case "tudo":
        return "⚠️ ATENÇÃO: Todos os dados serão excluídos permanentemente!";
    }
  };

  const handleLimpar = async () => {
    if (!confirmado) {
      toast({
        title: "Confirmação necessária",
        description: "Por favor, marque a caixa de confirmação",
        variant: "destructive",
      });
      return;
    }

    setDialogOpen(false);
    setConfirmOpen(true);
  };

  const executarLimpeza = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Sessão não encontrada");
      }

      const payload: Record<string, unknown> = { tipo };

      if (tipo === "periodo" && dataInicio && dataFim) {
        payload.dataInicio = dataInicio.toISOString();
        payload.dataFim = dataFim.toISOString();
      } else if (tipo === "antigos") {
        payload.diasAntigos = parseInt(diasAntigos);
      }

      const { data, error } = await supabase.functions.invoke('limpar-whatsapp-analytics', {
        body: payload,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Limpeza concluída!",
        description: data.mensagem || "Dados excluídos com sucesso",
      });

      setConfirmOpen(false);
      setConfirmado(false);
      onCleanupComplete();
    } catch (error) {
      const isError = error instanceof Error;
      console.error("Erro ao limpar dados:", error);
      toast({
        title: "Erro ao limpar dados",
        description: isError ? error.message : "Ocorreu um erro ao tentar limpar os dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportAntes = () => {
    onExport();
    toast({
      title: "Exportando dados",
      description: "Aguarde enquanto geramos o arquivo...",
    });
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" />
            Limpar Dados
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Limpar Dados de Analytics</DialogTitle>
            <DialogDescription>
              Escolha o tipo de limpeza que deseja realizar. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-500 mb-1">Recomendamos exportar antes</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportAntes}
                  className="mt-2"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV Agora
                </Button>
              </div>
            </div>

            <RadioGroup value={tipo} onValueChange={(v) => setTipo(v as "periodo" | "antigos" | "tudo")}>
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="periodo" id="periodo" />
                <Label htmlFor="periodo" className="flex-1 cursor-pointer">
                  <div className="font-medium">Limpar Período Atual</div>
                  <div className="text-sm text-muted-foreground">
                    Remove dados do período sendo visualizado
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="antigos" id="antigos" />
                <Label htmlFor="antigos" className="flex-1 cursor-pointer">
                  <div className="font-medium">Limpar Dados Antigos</div>
                  <div className="text-sm text-muted-foreground">
                    Remove apenas dados mais antigos que:
                  </div>
                </Label>
              </div>

              {tipo === "antigos" && (
                <div className="ml-6 mt-2">
                  <Select value={diasAntigos} onValueChange={setDiasAntigos}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 dias</SelectItem>
                      <SelectItem value="60">60 dias</SelectItem>
                      <SelectItem value="90">90 dias</SelectItem>
                      <SelectItem value="180">180 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center space-x-2 border border-red-500/30 rounded-lg p-3 bg-red-500/5">
                <RadioGroupItem value="tudo" id="tudo" />
                <Label htmlFor="tudo" className="flex-1 cursor-pointer">
                  <div className="font-medium text-red-500">Limpar Tudo</div>
                  <div className="text-sm text-muted-foreground">
                    ⚠️ Remove TODOS os dados permanentemente
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="border-t pt-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="confirmar"
                  checked={confirmado}
                  onCheckedChange={(checked) => setConfirmado(checked as boolean)}
                />
                <Label
                  htmlFor="confirmar"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Confirmo que desejo excluir esses dados permanentemente
                </Label>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {getMensagemConfirmacao()}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleLimpar}
              disabled={!confirmado}
            >
              Limpar Dados
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Os dados serão excluídos permanentemente.
              {tipo === "tudo" && (
                <span className="block mt-2 text-red-500 font-semibold">
                  ⚠️ TODOS OS DADOS DE ANALYTICS SERÃO PERDIDOS!
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={executarLimpeza}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Limpando..." : "Sim, Limpar Dados"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
