import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogForm, BlogFormData } from '@/components/admin/blog/BlogForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';

const BlogNovo = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('blog_posts').insert({
        titulo: data.titulo,
        slug: data.slug,
        categoria: data.categoria || null,
        tags: data.tags || null,
        resumo: data.resumo || null,
        conteudo: data.conteudo,
        imagem_destaque: data.imagem_destaque || null,
        publicado: data.publicado,
        data_publicacao: data.data_publicacao?.toISOString() || null,
        redes_sociais: data.redes_sociais || {},
        banner_midia_paga: data.banner_midia_paga || null,
      });

      if (error) throw error;

      toast.success(data.publicado ? 'Post publicado com sucesso!' : 'Post salvo como rascunho!');
      navigate('/admin/blog');
    } catch (error) {
      console.error('Erro ao criar post:', error);
      toast.error('Erro ao criar post. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/blog');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Novo Post</h1>
        <p className="text-muted-foreground mt-1">
          Crie um novo artigo para o blog
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Post</CardTitle>
          <CardDescription>
            Preencha os dados do novo post do blog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BlogForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogNovo;
