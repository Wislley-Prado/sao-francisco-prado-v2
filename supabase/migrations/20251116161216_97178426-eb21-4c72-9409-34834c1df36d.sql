-- Criar tabela para analytics de blog posts
CREATE TABLE IF NOT EXISTS blog_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  evento text NOT NULL CHECK (evento IN ('click_social', 'click_banner')),
  tipo text,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar índices para melhorar performance das queries
CREATE INDEX idx_blog_analytics_post_id ON blog_analytics(post_id);
CREATE INDEX idx_blog_analytics_evento ON blog_analytics(evento);
CREATE INDEX idx_blog_analytics_created_at ON blog_analytics(created_at);
CREATE INDEX idx_blog_analytics_tipo ON blog_analytics(tipo);

-- Habilitar RLS
ALTER TABLE blog_analytics ENABLE ROW LEVEL SECURITY;

-- Permitir que visitantes registrem eventos
CREATE POLICY "Visitantes podem registrar eventos" ON blog_analytics
  FOR INSERT
  WITH CHECK (true);

-- Apenas admins podem ver analytics
CREATE POLICY "Admins podem ver analytics" ON blog_analytics
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Comentários
COMMENT ON TABLE blog_analytics IS 'Registra eventos de cliques nos posts do blog';
COMMENT ON COLUMN blog_analytics.evento IS 'Tipo de evento: click_social ou click_banner';
COMMENT ON COLUMN blog_analytics.tipo IS 'Para click_social: facebook, instagram, twitter, linkedin. Para click_banner: nome do anunciante';