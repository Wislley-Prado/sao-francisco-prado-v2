-- Adicionar campos de WhatsApp e localização na tabela pacotes
ALTER TABLE pacotes 
ADD COLUMN IF NOT EXISTS telefone_whatsapp TEXT,
ADD COLUMN IF NOT EXISTS latitude NUMERIC,
ADD COLUMN IF NOT EXISTS longitude NUMERIC,
ADD COLUMN IF NOT EXISTS endereco_completo TEXT;

COMMENT ON COLUMN pacotes.telefone_whatsapp IS 'Número de WhatsApp específico do pacote para contato direto';
COMMENT ON COLUMN pacotes.latitude IS 'Latitude do local da pescaria';
COMMENT ON COLUMN pacotes.longitude IS 'Longitude do local da pescaria';
COMMENT ON COLUMN pacotes.endereco_completo IS 'Endereço completo do local da pescaria';