-- Criar tabela para analytics do WhatsApp
CREATE TABLE whatsapp_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  evento TEXT NOT NULL, -- 'widget_aberto', 'mensagem_rapida', 'botao_whatsapp'
  mensagem_tipo TEXT, -- tipo da mensagem rápida clicada
  user_agent TEXT,
  ip_address TEXT
);

-- Habilitar RLS
ALTER TABLE whatsapp_analytics ENABLE ROW LEVEL SECURITY;

-- Permitir inserção pública
CREATE POLICY "Visitantes podem registrar eventos do WhatsApp"
ON whatsapp_analytics
FOR INSERT
WITH CHECK (true);

-- Admins podem ver analytics
CREATE POLICY "Admins podem ver analytics do WhatsApp"
ON whatsapp_analytics
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Criar índices para melhor performance
CREATE INDEX idx_whatsapp_analytics_evento ON whatsapp_analytics(evento);
CREATE INDEX idx_whatsapp_analytics_created_at ON whatsapp_analytics(created_at DESC);