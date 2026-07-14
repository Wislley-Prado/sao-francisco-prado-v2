import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RichTextEditor } from '../RichTextEditor';
import { BlogImageUploader } from '../BlogImageUploader';
import { TagsInput } from './TagsInput';
import { PublicationSettings } from './PublicationSettings';
import { FormSection } from './FormSection';
import { SocialMediaLinks } from './SocialMediaLinks';
import { PaidMediaBanner } from './PaidMediaBanner';

const blogFormSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  titulo_en: z.string().optional().nullable(),
  slug: z.string().min(1, 'Slug é obrigatório'),
  categoria: z.string().optional(),
  categoria_en: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  resumo: z.string().optional(),
  resumo_en: z.string().optional().nullable(),
  conteudo: z.string().min(1, 'Conteúdo é obrigatório'),
  conteudo_en: z.string().optional().nullable(),
  imagem_destaque: z.string().optional(),
  publicado: z.boolean().default(false),
  data_publicacao: z.date().optional(),
  redes_sociais: z.any().optional(),
  banner_midia_paga: z.any().optional(),
});

export type BlogFormData = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  initialData?: Partial<BlogFormData>;
  onSubmit: (data: BlogFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const BlogForm = ({ initialData, onSubmit, onCancel, isSubmitting }: BlogFormProps) => {
  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      titulo: initialData?.titulo || '',
      titulo_en: initialData?.titulo_en || '',
      slug: initialData?.slug || '',
      categoria: initialData?.categoria || '',
      categoria_en: initialData?.categoria_en || '',
      tags: initialData?.tags || [],
      resumo: initialData?.resumo || '',
      resumo_en: initialData?.resumo_en || '',
      conteudo: initialData?.conteudo || '',
      conteudo_en: initialData?.conteudo_en || '',
      imagem_destaque: initialData?.imagem_destaque || '',
      publicado: initialData?.publicado || false,
      data_publicacao: initialData?.data_publicacao || undefined,
      redes_sociais: initialData?.redes_sociais || {},
      banner_midia_paga: initialData?.banner_midia_paga || null,
    },
  });

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'titulo' && value.titulo && !initialData?.slug) {
        form.setValue('slug', generateSlug(value.titulo));
      }
    });
    return () => subscription.unsubscribe();
  }, [form, initialData?.slug]);

  useEffect(() => {
    if (form.watch('publicado') && !form.watch('data_publicacao')) {
      form.setValue('data_publicacao', new Date());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch('publicado')]);

  const handleAddTag = (tag: string) => {
    const currentTags = form.getValues('tags');
    if (!currentTags.includes(tag)) {
      form.setValue('tags', [...currentTags, tag]);
    }
  };

  const handleRemoveTag = (index: number) => {
    const currentTags = form.getValues('tags');
    form.setValue('tags', currentTags.filter((_, i) => i !== index));
  };

  const handleSaveDraft = () => {
    form.setValue('publicado', false);
    form.handleSubmit(onSubmit)();
  };

  const handlePublish = () => {
    form.setValue('publicado', true);
    if (!form.getValues('data_publicacao')) {
      form.setValue('data_publicacao', new Date());
    }
    form.handleSubmit(onSubmit)();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormSection title="Informações Básicas">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título (Português)</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o título do post" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="titulo_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título (Inglês) - Opcional</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title in English" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="slug-do-post" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria (Português)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Barcos">Barcos</SelectItem>
                      <SelectItem value="Cachoeiras">Cachoeiras</SelectItem>
                      <SelectItem value="Camping">Camping</SelectItem>
                      <SelectItem value="Ecoturismo">Ecoturismo</SelectItem>
                      <SelectItem value="Eventos">Eventos</SelectItem>
                      <SelectItem value="Fauna">Fauna</SelectItem>
                      <SelectItem value="Flora">Flora</SelectItem>
                      <SelectItem value="Guias">Guias</SelectItem>
                      <SelectItem value="História">História</SelectItem>
                      <SelectItem value="Hotéis">Hotéis</SelectItem>
                      <SelectItem value="Lanchas">Lanchas</SelectItem>
                      <SelectItem value="Mapas">Mapas</SelectItem>
                      <SelectItem value="Marinas">Marinas</SelectItem>
                      <SelectItem value="Notícias">Notícias</SelectItem>
                      <SelectItem value="Passeios">Passeios</SelectItem>
                      <SelectItem value="Pesca Esportiva">Pesca Esportiva</SelectItem>
                      <SelectItem value="Pousadas">Pousadas</SelectItem>
                      <SelectItem value="Praias">Praias</SelectItem>
                      <SelectItem value="Ranchos">Ranchos</SelectItem>
                      <SelectItem value="Represa de Três Marias">Represa de Três Marias</SelectItem>
                      <SelectItem value="Restaurantes">Restaurantes</SelectItem>
                      <SelectItem value="Rio São Francisco">Rio São Francisco</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoria_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria (Inglês) - Opcional</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Boats">Boats</SelectItem>
                      <SelectItem value="Waterfalls">Waterfalls</SelectItem>
                      <SelectItem value="Camping">Camping</SelectItem>
                      <SelectItem value="Ecotourism">Ecotourism</SelectItem>
                      <SelectItem value="Events">Events</SelectItem>
                      <SelectItem value="Fauna">Fauna</SelectItem>
                      <SelectItem value="Flora">Flora</SelectItem>
                      <SelectItem value="Guides">Guides</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Hotels">Hotels</SelectItem>
                      <SelectItem value="Speedboats">Speedboats</SelectItem>
                      <SelectItem value="Maps">Maps</SelectItem>
                      <SelectItem value="Marinas">Marinas</SelectItem>
                      <SelectItem value="News">News</SelectItem>
                      <SelectItem value="Tours">Tours</SelectItem>
                      <SelectItem value="Sport Fishing">Sport Fishing</SelectItem>
                      <SelectItem value="Guesthouses">Guesthouses</SelectItem>
                      <SelectItem value="Beaches">Beaches</SelectItem>
                      <SelectItem value="Ranches">Ranches</SelectItem>
                      <SelectItem value="Três Marias Dam">Três Marias Dam</SelectItem>
                      <SelectItem value="Restaurants">Restaurants</SelectItem>
                      <SelectItem value="São Francisco River">São Francisco River</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagsInput
                    tags={field.value}
                    onAddTag={handleAddTag}
                    onRemoveTag={handleRemoveTag}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Conteúdo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="resumo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumo (Português)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite um resumo do post"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resumo_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumo (Inglês) - Opcional</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter post excerpt in English"
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 mt-6">
            <FormField
              control={form.control}
              name="conteudo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo (Português)</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Escreva o conteúdo completo do post..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="conteudo_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo (Inglês) - Opcional</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Write the full post content in English..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Imagem de Destaque">
          <FormField
            control={form.control}
            name="imagem_destaque"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <BlogImageUploader
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title="Redes Sociais"
          description="Links para compartilhamento nas redes sociais"
        >
          <FormField
            control={form.control}
            name="redes_sociais"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SocialMediaLinks
                    value={field.value || {}}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title="Mídia Paga"
          description="Banner publicitário com link para o anunciante"
        >
          <FormField
            control={form.control}
            name="banner_midia_paga"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PaidMediaBanner
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Publicação">
          <PublicationSettings
            publicado={form.watch('publicado')}
            dataPublicacao={form.watch('data_publicacao')}
            onPublicadoChange={(value) => form.setValue('publicado', value)}
            onDataPublicacaoChange={(date) => form.setValue('data_publicacao', date)}
          />
        </FormSection>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            Salvar Rascunho
          </Button>
          <Button type="button" onClick={handlePublish} disabled={isSubmitting}>
            Publicar
          </Button>
        </div>
      </form>
    </Form>
  );
};
