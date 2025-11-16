-- Add new columns to ranchos table for location, video and contact
ALTER TABLE ranchos 
ADD COLUMN telefone_whatsapp text,
ADD COLUMN video_youtube text,
ADD COLUMN latitude numeric,
ADD COLUMN longitude numeric,
ADD COLUMN endereco_completo text;