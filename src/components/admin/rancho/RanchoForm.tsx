import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ImageUploader, ImageFile } from './ImageUploader';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const COMODIDADES_PADRAO = [
  'WiFi',
  'Ar Condicionado',
  'Cozinha Completa',
  'Churrasqueira',
  'Barco',
  'Equipamentos de Pesca',
  'Piscina',
  'Área de Lazer',
  'Isca Viva',
  'Guia de Pesca',
];

const ranchoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  slug: z.string().min(3, 'Slug deve ter no mínimo 3 caracteres'),
  descricao: z.string().optional(),
  localizacao: z.string().min(3, 'Localização é obrigatória'),
  capacidade: z.number().min(1, 'Capacidade mínima é 1'),
  quartos: z.number().min(0, 'Número de quartos inválido'),
  banheiros: z.number().min(0, 'Número de banheiros inválido'),
  area: z.number().optional(),
  preco: z.number().min(0.01, 'Preço deve ser maior que zero'),
  rating: z.number().min(0).max(5),
  disponivel: z.boolean(),
  destaque: z.boolean(),
  comodidades: z.array(z.string()),
  comodidadeCustom: z.string().optional(),
  telefone_whatsapp: z.string().regex(/^\d+$/, 'Apenas números').min(10, 'Mínimo 10 dígitos').optional().or(z.literal('')),
  video_youtube: z.string().url('URL inválida do YouTube').optional().or(z.literal('')),
  latitude: z.string().optional().or(z.literal('')),
  longitude: z.string().optional().or(z.literal('')),
  endereco_completo: z.string().optional(),
});

type RanchoFormData = z.infer<typeof ranchoSchema>;

interface RanchoFormProps {
  rancho?: any;
  onSuccess: () => void;
}

export const RanchoForm = ({ rancho, onSuccess }: RanchoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<ImageFile[]>(
    rancho?.rancho_imagens?.map((img: any, index: number) => ({
      id: img.id,
      url: img.url,
      principal: img.principal,
      alt_text: img.alt_text || '',
      ordem: img.ordem || index,
    })) || []
  );

  const form = useForm<RanchoFormData>({
    resolver: zodResolver(ranchoSchema),
    defaultValues: {
      nome: rancho?.nome || '',
      slug: rancho?.slug || '',
      descricao: rancho?.descricao || '',
      localizacao: rancho?.localizacao || '',
      capacidade: rancho?.capacidade || 2,
      quartos: rancho?.quartos || 0,
      banheiros: rancho?.banheiros || 0,
      area: rancho?.area || undefined,
      preco: rancho?.preco ? Number(rancho.preco) : 0,
      rating: rancho?.rating ? Number(rancho.rating) : 5.0,
      disponivel: rancho?.disponivel ?? true,
      destaque: rancho?.destaque ?? false,
      comodidades: rancho?.comodidades || [],
      comodidadeCustom: '',
      telefone_whatsapp: rancho?.telefone_whatsapp || '',
      video_youtube: rancho?.video_youtube || '',
      latitude: rancho?.latitude?.toString() || '',
      longitude: rancho?.longitude?.toString() || '',
      endereco_completo: rancho?.endereco_completo || '',
    },
  });

  const generateSlug = (nome: string) => {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const onSubmit = async (data: RanchoFormData) => {
    if (images.length === 0) {
      toast.error('Adicione pelo menos uma imagem');
      return;
    }

    setIsSubmitting(true);

    try {
      // Adicionar comodidade customizada se existir
      const comodidadesFinal = [...data.comodidades];
      if (data.comodidadeCustom?.trim()) {
        comodidadesFinal.push(data.comodidadeCustom.trim());
      }

      const ranchoData = {
        nome: data.nome,
        slug: data.slug,
        descricao: data.descricao || null,
        localizacao: data.localizacao,
        capacidade: data.capacidade,
        quartos: data.quartos,
        banheiros: data.banheiros,
        area: data.area || null,
        preco: data.preco,
        rating: data.rating,
        disponivel: data.disponivel,
        destaque: data.destaque,
        comodidades: comodidadesFinal,
        telefone_whatsapp: data.telefone_whatsapp || null,
        video_youtube: data.video_youtube || null,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        endereco_completo: data.endereco_completo || null,
      };

      let ranchoId = rancho?.id;

      if (rancho) {
        // Update
        const { error } = await supabase
          .from('ranchos')
          .update(ranchoData)
          .eq('id', rancho.id);

        if (error) throw error;
      } else {
        // Create
        const { data: newRancho, error } = await supabase
          .from('ranchos')
          .insert(ranchoData)
          .select()
          .single();

        if (error) throw error;
        ranchoId = newRancho.id;
      }

      // Handle images
      const imagesToUpload = images.filter((img) => img.file);
      const existingImages = images.filter((img) => !img.file);

      // Upload new images
      for (const image of imagesToUpload) {
        const fileExt = image.file!.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${ranchoId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('ranchos')
          .upload(filePath, image.file!);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('ranchos')
          .getPublicUrl(filePath);

        const { error: insertError } = await supabase
          .from('rancho_imagens')
          .insert({
            rancho_id: ranchoId,
            url: publicUrl,
            principal: image.principal,
            alt_text: image.alt_text || null,
            ordem: image.ordem,
          });

        if (insertError) throw insertError;
      }

      // Update existing images
      for (const image of existingImages) {
        const { error: updateError } = await supabase
          .from('rancho_imagens')
          .update({
            principal: image.principal,
            alt_text: image.alt_text || null,
            ordem: image.ordem,
          })
          .eq('id', image.id);

        if (updateError) throw updateError;
      }

      // Delete removed images
      if (rancho) {
        const existingImageIds = existingImages.map((img) => img.id);
        const originalImageIds = rancho.rancho_imagens?.map((img: any) => img.id) || [];
        const deletedImageIds = originalImageIds.filter(
          (id: string) => !existingImageIds.includes(id)
        );

        if (deletedImageIds.length > 0) {
          const imagesToDelete = rancho.rancho_imagens.filter((img: any) =>
            deletedImageIds.includes(img.id)
          );

          for (const img of imagesToDelete) {
            const urlParts = img.url.split('/');
            const path = `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1]}`;
            await supabase.storage.from('ranchos').remove([path]);
          }

          await supabase
            .from('rancho_imagens')
            .delete()
            .in('id', deletedImageIds);
        }
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving rancho:', error);
      toast.error('Erro ao salvar rancho');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basico" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basico">Básico</TabsTrigger>
            <TabsTrigger value="estrutura">Estrutura</TabsTrigger>
            <TabsTrigger value="comodidades">Comodidades</TabsTrigger>
            <TabsTrigger value="midia">Mídia e Contato</TabsTrigger>
            <TabsTrigger value="imagens">Imagens</TabsTrigger>
          </TabsList>

          <TabsContent value="basico" className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (!rancho) {
                          form.setValue('slug', generateSlug(e.target.value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>URL amigável (gerado automaticamente)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="localizacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localização *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Prado, MG" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="estrutura" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidade (pessoas) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quartos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quartos *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="banheiros"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banheiros *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área (m²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço por Diária (R$) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                    <FormLabel>Rating (0-5)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-6 pt-4">
              <FormField
                control={form.control}
                name="disponivel"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Disponível</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destaque"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Destaque</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="comodidades" className="space-y-4">
            <FormField
              control={form.control}
              name="comodidades"
              render={() => (
                <FormItem>
                  <FormLabel>Comodidades Disponíveis</FormLabel>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {COMODIDADES_PADRAO.map((comodidade) => (
                      <FormField
                        key={comodidade}
                        control={form.control}
                        name="comodidades"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(comodidade)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  field.onChange(
                                    checked
                                      ? [...current, comodidade]
                                      : current.filter((val) => val !== comodidade)
                                  );
                                }}
                              />
                            </FormControl>
                            <Label className="!mt-0 font-normal cursor-pointer">
                              {comodidade}
                            </Label>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comodidadeCustom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comodidade Personalizada</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Freezer para iscas" />
                  </FormControl>
                  <FormDescription>Adicione uma comodidade não listada acima</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="midia" className="space-y-4">
            <FormField
              control={form.control}
              name="telefone_whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone WhatsApp</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="5531999999999" />
                  </FormControl>
                  <FormDescription>
                    Apenas números, com DDI e DDD (Ex: 5531999999999)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="video_youtube"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vídeo YouTube (Shorts)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://youtube.com/shorts/..." />
                  </FormControl>
                  <FormDescription>
                    Cole o link completo do YouTube Shorts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="-16.12345" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="-45.67890" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="endereco_completo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço Completo</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="Endereço completo para exibição" />
                  </FormControl>
                  <FormDescription>
                    Obtenha as coordenadas em: <a href="https://www.google.com.br/maps" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Maps</a> (clique com botão direito no mapa)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="imagens" className="space-y-4">
            <ImageUploader images={images} onChange={setImages} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {rancho ? 'Atualizar Rancho' : 'Criar Rancho'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
