ALTER TABLE public.propriedades_venda ADD COLUMN IF NOT EXISTS texto_botao_whatsapp TEXT;
ALTER TABLE public.propriedades_venda ADD COLUMN IF NOT EXISTS mensagem_whatsapp TEXT;
COMMENT ON COLUMN public.propriedades_venda.texto_botao_whatsapp IS 'Texto personalizado para o botão do WhatsApp';
COMMENT ON COLUMN public.propriedades_venda.mensagem_whatsapp IS 'Mensagem padrão personalizada ao clicar no botão do WhatsApp';
