-- Adicionar campo para vídeo institucional na tabela site_settings
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS youtube_institucional_url TEXT;

COMMENT ON COLUMN site_settings.youtube_institucional_url IS 'URL do vídeo institucional/apresentação do Rancho Prado no YouTube';