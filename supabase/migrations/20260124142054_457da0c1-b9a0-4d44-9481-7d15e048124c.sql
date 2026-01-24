-- Adicionar campo para avatar do autor nas configurações
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS autor_avatar_url TEXT;