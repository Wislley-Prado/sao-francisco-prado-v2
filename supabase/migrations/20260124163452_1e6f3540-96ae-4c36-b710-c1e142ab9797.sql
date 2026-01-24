-- Adicionar colunas de redes sociais e contato na tabela site_settings
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_url TEXT,
ADD COLUMN IF NOT EXISTS tiktok_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_url TEXT,
ADD COLUMN IF NOT EXISTS telefone_contato TEXT DEFAULT '(38) 98832-0108',
ADD COLUMN IF NOT EXISTS email_contato TEXT DEFAULT 'contato@pradoaqui.com.br';

-- Recriar a view pública para incluir os novos campos
DROP VIEW IF EXISTS public.site_settings_public;

CREATE VIEW public.site_settings_public AS
SELECT 
  id, 
  created_at, 
  updated_at,
  whatsapp_numero, 
  whatsapp_titulo, 
  whatsapp_saudacao,
  whatsapp_instrucao, 
  whatsapp_horario, 
  whatsapp_opcoes,
  whatsapp_mensagem_padrao, 
  autor_avatar_url,
  youtube_live_url, 
  youtube_video_url, 
  youtube_institucional_url,
  facebook_url, 
  instagram_url, 
  youtube_url, 
  tiktok_url, 
  twitter_url,
  telefone_contato, 
  email_contato
FROM public.site_settings;