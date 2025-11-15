-- Criar tabela de posts do blog
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  resumo TEXT,
  conteudo TEXT NOT NULL,
  imagem_destaque TEXT,
  autor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  categoria TEXT,
  tags TEXT[],
  publicado BOOLEAN NOT NULL DEFAULT false,
  data_publicacao TIMESTAMP WITH TIME ZONE,
  visualizacoes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_publicado ON public.blog_posts(publicado);
CREATE INDEX idx_blog_posts_data_publicacao ON public.blog_posts(data_publicacao DESC);
CREATE INDEX idx_blog_posts_autor_id ON public.blog_posts(autor_id);
CREATE INDEX idx_blog_posts_categoria ON public.blog_posts(categoria);

-- Habilitar RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Política: Visitantes podem ver posts publicados
CREATE POLICY "Visitantes podem ver posts publicados"
ON public.blog_posts
FOR SELECT
USING (publicado = true);

-- Política: Admins podem gerenciar todos os posts
CREATE POLICY "Admins podem gerenciar posts"
ON public.blog_posts
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Política: Autores podem ver seus próprios rascunhos
CREATE POLICY "Autores podem ver seus rascunhos"
ON public.blog_posts
FOR SELECT
USING (auth.uid() = autor_id);

-- Política: Autores podem editar seus próprios posts
CREATE POLICY "Autores podem editar seus posts"
ON public.blog_posts
FOR UPDATE
USING (auth.uid() = autor_id)
WITH CHECK (auth.uid() = autor_id);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar bucket de storage para imagens do blog
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog', 'blog', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage: Imagens são publicamente acessíveis
CREATE POLICY "Imagens do blog são publicamente acessíveis"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog');

-- Políticas de storage: Admins podem fazer upload
CREATE POLICY "Admins podem fazer upload de imagens do blog"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'blog' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Políticas de storage: Admins podem atualizar imagens
CREATE POLICY "Admins podem atualizar imagens do blog"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'blog' AND
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  bucket_id = 'blog' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Políticas de storage: Admins podem deletar imagens
CREATE POLICY "Admins podem deletar imagens do blog"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'blog' AND
  has_role(auth.uid(), 'admin'::app_role)
);