import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { BlogImageUploader } from './BlogImageUploader';
import { RichTextEditor } from './RichTextEditor';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const blogFormSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  slug: z.string().min(3, 'Slug deve ter no mínimo 3 caracteres'),
  categoria: z.string().optional(),
  tags: z.array(z.string()).optional(),
  resumo: z.string().max(200, 'Resumo deve ter no máximo 200 caracteres').optional(),
  conteudo: z.string().min(10, 'Conteúdo deve ter no mínimo 10 caracteres'),
  imagem_destaque: z.string().nullable().optional(),
  publicado: z.boolean().default(false),
  data_publicacao: z.date().nullable().optional(),
});

export type BlogFormData = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  initialData?: Partial<BlogFormData>;
  onSubmit: (data: BlogFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
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
      imagem_destaque: initialData?.imagem_destaque || null,
      publicado: initialData?.publicado || false,
      data_publicacao: initialData?.data_publicacao || null,
    },
  });

  const titulo = form.watch('titulo');
  const publicado = form.watch('publicado');
  const tags = form.watch('tags') || [];

  // Auto-gerar slug a partir do título
  useEffect(() => {
    if (titulo && !initialData?.slug) {
      const slug = titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      form.setValue('slug', slug);
    }
  }, [titulo, form, initialData?.slug]);

  // Auto-definir data de publicação quando publicar
  useEffect(() => {
    if (publicado && !form.getValues('data_publicacao')) {
      form.setValue('data_publicacao', new Date());
    }
  }, [publicado, form]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.currentTarget;
      const tag = input.value.trim();
      if (tag && !tags.includes(tag)) {
        form.setValue('tags', [...tags, tag]);
        input.value = '';
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título *</FormLabel>
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
                <FormLabel>Slug *</FormLabel>
                <FormControl>
                  <Input placeholder="url-do-post" {...field} />
                </FormControl>
                <FormDescription>
                  URL amigável (gerada automaticamente)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="dicas">Dicas de Pesca</SelectItem>
                    <SelectItem value="noticias">Notícias</SelectItem>
                    <SelectItem value="especies">Espécies</SelectItem>
                    <SelectItem value="equipamentos">Equipamentos</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={() => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite uma tag e pressione Enter"
                    onKeyDown={handleAddTag}
                  />
                </FormControl>
                <FormDescription>
                  Pressione Enter para adicionar cada tag
                </FormDescription>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="resumo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resumo</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Breve descrição do post (máx. 200 caracteres)"
                  className="resize-none"
                  maxLength={200}
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                {field.value?.length || 0}/200 caracteres
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="conteudo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo *</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Escreva o conteúdo completo do post..."
                />
              </FormControl>
              <FormDescription>
                Use a barra de ferramentas para formatar o conteúdo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imagem_destaque"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagem Destaque</FormLabel>
              <FormControl>
                <BlogImageUploader
                  value={field.value || null}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="publicado"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Publicar Post</FormLabel>
                  <FormDescription>
                    Post ficará visível no site
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

          <FormField
            control={form.control}
            name="data_publicacao"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-center">
                <FormLabel>Data de Publicação</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'dd/MM/yyyy')
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn('p-3 pointer-events-auto')}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Data em que o post foi/será publicado
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="secondary"
            disabled={isSubmitting}
            onClick={() => form.setValue('publicado', false)}
          >
            Salvar Rascunho
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={() => form.setValue('publicado', true)}
          >
            {isSubmitting ? 'Salvando...' : 'Publicar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
