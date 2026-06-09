ALTER TABLE public.propriedades_venda ADD COLUMN IF NOT EXISTS video_youtube TEXT;
COMMENT ON COLUMN public.propriedades_venda.video_youtube IS 'URL do vídeo do YouTube (Shorts) da propriedade à venda';
