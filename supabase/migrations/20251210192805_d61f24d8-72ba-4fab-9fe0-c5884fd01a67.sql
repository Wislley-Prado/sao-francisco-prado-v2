-- Adicionar campos de parcelamento e vagas na tabela pacotes
ALTER TABLE public.pacotes 
ADD COLUMN IF NOT EXISTS parcelas_quantidade integer DEFAULT 10,
ADD COLUMN IF NOT EXISTS parcela_valor numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS desconto_avista numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS vagas_disponiveis integer DEFAULT NULL;