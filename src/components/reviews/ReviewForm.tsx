import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const reviewSchema = z.object({
  nome_usuario: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  nota: z.number().min(1, "Selecione uma nota").max(5),
  comentario: z.string().trim().min(10, "Comentário deve ter pelo menos 10 caracteres").max(1000),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  ranchoId: string;
  onSuccess?: () => void;
}

export const ReviewForm = ({ ranchoId, onSuccess }: ReviewFormProps) => {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      nome_usuario: "",
      email: "",
      nota: 0,
      comentario: "",
    },
  });

  const onSubmit = async (values: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("avaliacoes").insert([{
        rancho_id: ranchoId,
        nome_usuario: values.nome_usuario,
        email: values.email,
        nota: values.nota,
        comentario: values.comentario,
      }]);

      if (error) throw error;

      toast.success("Avaliação enviada com sucesso! Será publicada após verificação.");
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      toast.error("Erro ao enviar avaliação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nota = form.watch("nota");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deixe sua avaliação</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome_usuario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="nota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sua nota</FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const starValue = i + 1;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => field.onChange(starValue)}
                            onMouseEnter={() => setHoveredStar(starValue)}
                            onMouseLeave={() => setHoveredStar(0)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                starValue <= (hoveredStar || nota)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comentario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu comentário</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Conte sobre sua experiência..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Enviando..." : "Enviar avaliação"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
