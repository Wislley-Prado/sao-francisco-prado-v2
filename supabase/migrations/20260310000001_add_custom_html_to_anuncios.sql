
-- Adicionar coluna custom_html à tabela anuncios
ALTER TABLE public.anuncios ADD COLUMN IF NOT EXISTS custom_html TEXT;

-- Comentário explicativo
COMMENT ON COLUMN public.anuncios.custom_html IS 'Código HTML/Script customizado para o anúncio (Ex: Google AdSense)';
