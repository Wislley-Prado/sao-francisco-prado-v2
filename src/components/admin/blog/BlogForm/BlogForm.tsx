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
  slug: z.string().min(1, 'Slug é obrigatório'),
  categoria: z.string().optional(),
  tags: z.array(z.string()).default([]),
  resumo: z.string().optional(),
  conteudo: z.string().min(1, 'Conteúdo é obrigatório'),
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
      slug: initialData?.slug || '',
      categoria: initialData?.categoria || '',
      tags: initialData?.tags || [],
      resumo: initialData?.resumo || '',
      conteudo: initialData?.conteudo || '',
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
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o título do post" {...field} />
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
                  <FormLabel>Slug (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="slug-do-post" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="dicas">Dicas de Pesca</SelectItem>
                    <SelectItem value="noticias">Notícias</SelectItem>
                    <SelectItem value="equipamentos">Equipamentos</SelectItem>
                    <SelectItem value="destinos">Destinos</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
          <FormField
            control={form.control}
            name="resumo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resumo</FormLabel>
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
            name="conteudo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conteúdo</FormLabel>
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
