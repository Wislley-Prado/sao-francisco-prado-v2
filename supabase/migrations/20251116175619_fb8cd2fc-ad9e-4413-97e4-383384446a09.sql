-- Adicionar campo video_youtube na tabela pacotes
ALTER TABLE pacotes ADD COLUMN IF NOT EXISTS video_youtube TEXT;

COMMENT ON COLUMN pacotes.video_youtube IS 'URL do vídeo do YouTube (aceita vídeos normais, Shorts e youtu.be)';