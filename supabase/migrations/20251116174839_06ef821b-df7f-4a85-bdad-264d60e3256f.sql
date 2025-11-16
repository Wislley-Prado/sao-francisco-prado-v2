-- Adicionar campo tracking_code na tabela pacotes
ALTER TABLE pacotes ADD COLUMN IF NOT EXISTS tracking_code TEXT;

-- Criar tabela de analytics de pacotes
CREATE TABLE IF NOT EXISTS pacote_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pacote_id UUID NOT NULL REFERENCES pacotes(id) ON DELETE CASCADE,
  evento TEXT NOT NULL,
  tipo TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pacote_analytics_pacote_id ON pacote_analytics(pacote_id);
CREATE INDEX IF NOT EXISTS idx_pacote_analytics_evento ON pacote_analytics(evento);
CREATE INDEX IF NOT EXISTS idx_pacote_analytics_created_at ON pacote_analytics(created_at DESC);

-- Habilitar RLS
ALTER TABLE pacote_analytics ENABLE ROW LEVEL SECURITY;

-- Política para visitantes registrarem eventos
CREATE POLICY "Visitantes podem registrar eventos" 
ON pacote_analytics 
FOR INSERT 
WITH CHECK (true);

-- Política para admins verem analytics
CREATE POLICY "Admins podem ver analytics" 
ON pacote_analytics 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Comentários
COMMENT ON TABLE pacote_analytics IS 'Tabela para rastreamento de eventos de analytics dos pacotes';
COMMENT ON COLUMN pacotes.tracking_code IS 'Código de tracking (ex: Facebook Pixel, Google Analytics) para o pacote';