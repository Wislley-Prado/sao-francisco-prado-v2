import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Star, Upload, X, ImagePlus } from "lucide-react";
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

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      nome_usuario: "",
      email: "",
      nota: 0,
      comentario: "",
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = MAX_IMAGES - images.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToAdd) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`Formato não suportado: ${file.name}. Use JPG, PNG ou WEBP.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Arquivo muito grande: ${file.name}. Máximo 2MB.`);
        continue;
      }

      const preview = URL.createObjectURL(file);
      setImages(prev => [...prev, { file, preview }]);
    }

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const { file } of images) {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const ext = file.name.split(".").pop();
      const filePath = `reviews/${timestamp}-${random}.${ext}`;

      const { error } = await supabase.storage
        .from("avaliacoes")
        .upload(filePath, file);

      if (error) {
        console.error("Erro ao fazer upload:", error);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("avaliacoes")
        .getPublicUrl(filePath);

      uploadedUrls.push(urlData.publicUrl);
    }

    return uploadedUrls;
  };

  const onSubmit = async (values: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      let imageUrls: string[] = [];

      if (images.length > 0) {
        setUploadingImages(true);
        imageUrls = await uploadImages();
        setUploadingImages(false);
      }

      const { error } = await supabase.from("avaliacoes").insert([{
        rancho_id: ranchoId,
        nome_usuario: values.nome_usuario,
        email: values.email,
        nota: values.nota,
        comentario: values.comentario,
        imagens: imageUrls,
      }]);

      if (error) throw error;

      toast.success("Avaliação enviada com sucesso! Será publicada após verificação.");
      form.reset();
      images.forEach(img => URL.revokeObjectURL(img.preview));
      setImages([]);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      toast.error("Erro ao enviar avaliação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
      setUploadingImages(false);
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

            {/* Image Upload Section */}
            <div className="space-y-2">
              <FormLabel>Suas fotos (opcional, máx. {MAX_IMAGES})</FormLabel>
              <div className="flex flex-wrap gap-3">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {images.length < MAX_IMAGES && (
                  <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                    <ImagePlus className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">Adicionar</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                JPG, PNG ou WEBP. Máximo 2MB por imagem.
              </p>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {uploadingImages ? "Enviando fotos..." : isSubmitting ? "Enviando..." : "Enviar avaliação"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
