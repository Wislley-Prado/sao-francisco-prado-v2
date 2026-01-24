-- Add copyright text and reservation button link fields
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS copyright_text TEXT DEFAULT '© 2025 PradoAqui. Todos os direitos reservados',
ADD COLUMN IF NOT EXISTS reserva_button_link TEXT DEFAULT 'https://wa.me/5538988320108';

-- Update the public view to include new fields
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
  youtube_url,
  facebook_url,
  instagram_url,
  tiktok_url,
  twitter_url,
  telefone_contato,
  email_contato,
  copyright_text,
  reserva_button_link
FROM public.site_settings;