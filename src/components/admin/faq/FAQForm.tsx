import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  pergunta: z.string().min(10, "A pergunta deve ter pelo menos 10 caracteres"),
  resposta: z.string().min(20, "A resposta deve ter pelo menos 20 caracteres"),
  ordem: z.number().min(0, "A ordem deve ser um número positivo"),
  ativo: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

interface FAQFormProps {
  initialData?: {
    id: string;
    pergunta: string;
    resposta: string;
    ordem: number;
    ativo: boolean;
  };
}

export const FAQForm = ({ initialData }: FAQFormProps) => {
  const navigate = useNavigate();
  const isEditing = !!initialData;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      pergunta: "",
      resposta: "",
      ordem: 0,
      ativo: true,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const faqData = {
        pergunta: data.pergunta,
        resposta: data.resposta,
        ordem: data.ordem,
        ativo: data.ativo,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("faqs")
          .update(faqData)
          .eq("id", initialData.id);

        if (error) throw error;
        toast.success("FAQ atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from("faqs")
          .insert([faqData]);

        if (error) throw error;
        toast.success("FAQ criado com sucesso!");
      }

      navigate("/admin/faqs");
    } catch (error) {
      console.error("Erro ao salvar FAQ:", error);
      toast.error("Erro ao salvar FAQ");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="pergunta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pergunta</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite a pergunta frequente" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resposta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resposta</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Digite a resposta detalhada"
                  rows={5}
                />
              </FormControl>
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
                Ordem em que a pergunta aparecerá na lista (menor = primeiro)
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
                  FAQ visível para os visitantes do site
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
          <Button type="submit">
            {isEditing ? "Atualizar" : "Criar"} FAQ
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/faqs")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
};
