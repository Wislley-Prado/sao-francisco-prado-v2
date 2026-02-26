
-- Step 1: Add column to table
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS favicon_url text;

-- Step 2: Drop existing view  
DROP VIEW IF EXISTS public.site_settings_public;

-- Step 3: Recreate view with exact original order + new column
CREATE VIEW public.site_settings_public AS
SELECT 
  id, created_at, updated_at,
  whatsapp_numero,
  whatsapp_titulo,
  whatsapp_mensagem_padrao,
  whatsapp_saudacao,
  whatsapp_instrucao,
  whatsapp_horario,
  whatsapp_opcoes,
  facebook_url,
  instagram_url,
  youtube_url,
  tiktok_url,
  twitter_url,
  telefone_contato,
  email_contato,
  copyright_text,
  reserva_button_link,
  reserva_button_text,
  youtube_live_url,
  youtube_video_url,
  youtube_institucional_url,
  autor_avatar_url,
  favicon_url
FROM public.site_settings;

-- Step 4: Create storage bucket for favicons
INSERT INTO storage.buckets (id, name, public)
VALUES ('favicons', 'favicons', true)
ON CONFLICT (id) DO NOTHING;

-- Step 5: Storage policies for favicons
CREATE POLICY "Public read favicons" ON storage.objects
  FOR SELECT USING (bucket_id = 'favicons');

CREATE POLICY "Admins upload favicons" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'favicons' AND
    public.has_role(auth.uid(), 'admin'::public.app_role)
  );

CREATE POLICY "Admins delete favicons" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'favicons' AND
    public.has_role(auth.uid(), 'admin'::public.app_role)
  );
