-- Adicionar campos para URLs de vídeos do YouTube na tabela site_settings
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS youtube_live_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_video_url TEXT;

COMMENT ON COLUMN site_settings.youtube_live_url IS 'URL da transmissão ao vivo do YouTube do Rio São Francisco';
COMMENT ON COLUMN site_settings.youtube_video_url IS 'URL do vídeo gravado do YouTube do Rio São Francisco';