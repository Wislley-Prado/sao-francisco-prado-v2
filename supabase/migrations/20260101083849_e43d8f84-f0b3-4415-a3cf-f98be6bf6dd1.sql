-- Adicionar coluna para mensagem personalizada do WhatsApp
ALTER TABLE ranchos 
ADD COLUMN mensagem_whatsapp text;

COMMENT ON COLUMN ranchos.mensagem_whatsapp IS 'Mensagem personalizada para o botão WhatsApp. Use {nome} e {localizacao} como variáveis dinâmicas.';