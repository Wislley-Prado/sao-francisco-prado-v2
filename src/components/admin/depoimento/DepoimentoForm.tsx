import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ImageUploader } from "./ImageUploader";
import { useState } from "react";

const formSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  cargo: z.string().optional(),
  foto_url: z.string().optional(),
  depoimento: z.string().min(20, "O depoimento deve ter pelo menos 20 caracteres"),
  rating: z.number().min(1).max(5),
  ordem: z.number().min(0, "A ordem deve ser um número positivo"),
  ativo: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

interface DepoimentoFormProps {
  initialData?: {
    id: string;
    nome: string;
    cargo: string | null;
    foto_url: string | null;
    depoimento: string;
    rating: number;
    ordem: number;
    ativo: boolean;
  };
}

export const DepoimentoForm = ({ initialData }: DepoimentoFormProps) => {
  const navigate = useNavigate();
  const isEditing = !!initialData;
  const [uploading, setUploading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nome: "",
      cargo: "",
      foto_url: "",
      depoimento: "",
      rating: 5,
      ordem: 0,
      ativo: true,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const depoimentoData = {
        nome: data.nome,
        cargo: data.cargo || null,
        foto_url: data.foto_url || null,
        depoimento: data.depoimento,
        rating: data.rating,
        ordem: data.ordem,
        ativo: data.ativo,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("depoimentos")
          .update(depoimentoData)
          .eq("id", initialData.id);

        if (error) throw error;
        toast.success("Depoimento atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from("depoimentos")
          .insert([depoimentoData]);

        if (error) throw error;
        toast.success("Depoimento criado com sucesso!");
      }

      navigate("/admin/depoimentos");
    } catch (error) {
      console.error("Erro ao salvar depoimento:", error);
      toast.error("Erro ao salvar depoimento");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="foto_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto do Cliente</FormLabel>
              <FormControl>
                <ImageUploader
                  value={field.value}
                  onChange={field.onChange}
                  onUploadStart={() => setUploading(true)}
                  onUploadEnd={() => setUploading(false)}
                />
              </FormControl>
              <FormDescription>
                Foto opcional do cliente que deu o depoimento
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nome completo do cliente" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cargo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo/Descrição (Opcional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="Ex: Pescador Esportivo - São Paulo"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="depoimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Depoimento</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Digite o depoimento do cliente"
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avaliação (1-5 estrelas)</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                value={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "estrela" : "estrelas"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ordem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ordem de Exibição</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Ordem em que o depoimento aparecerá (menor = primeiro)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Ativo</FormLabel>
                <FormDescription>
                  Depoimento visível para os visitantes do site
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={uploading}>
            {isEditing ? "Atualizar" : "Criar"} Depoimento
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/depoimentos")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
};
