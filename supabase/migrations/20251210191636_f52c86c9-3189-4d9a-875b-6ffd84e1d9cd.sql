-- Adicionar coluna para URL do webhook da represa
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS dam_webhook_url text DEFAULT 'https://webhook.v1.vendopro.com.br/webhook/v1.represa.online';

-- Atualizar o registro existente com o valor padrão
UPDATE public.site_settings 
SET dam_webhook_url = 'https://webhook.v1.vendopro.com.br/webhook/v1.represa.online'
WHERE dam_webhook_url IS NULL;