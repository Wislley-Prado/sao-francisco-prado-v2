import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogForm, BlogFormData } from '@/components/admin/blog/BlogForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';

const BlogEditar = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id!)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleSubmit = async (data: BlogFormData) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          titulo: data.titulo,
          slug: data.slug,
          categoria: data.categoria || null,
          tags: data.tags || null,
          resumo: data.resumo || null,
          conteudo: data.conteudo,
          imagem_destaque: data.imagem_destaque || null,
          publicado: data.publicado,
          data_publicacao: data.data_publicacao?.toISOString() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Post atualizado com sucesso!');
      navigate('/admin/blog');
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      toast.error('Erro ao atualizar post. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/blog');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse bg-muted rounded" />
        <Card>
          <CardHeader>
            <div className="h-6 w-48 animate-pulse bg-muted rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 animate-pulse bg-muted rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Post não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Editar Post</h1>
        <p className="text-muted-foreground mt-1">
          Atualize as informações do post
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Post</CardTitle>
          <CardDescription>
            Edite os dados do post do blog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BlogForm
            initialData={{
              titulo: post.titulo,
              slug: post.slug,
              categoria: post.categoria || undefined,
              tags: post.tags || undefined,
              resumo: post.resumo || undefined,
              conteudo: post.conteudo,
              imagem_destaque: post.imagem_destaque || null,
              publicado: post.publicado,
              data_publicacao: post.data_publicacao ? new Date(post.data_publicacao) : null,
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogEditar;
