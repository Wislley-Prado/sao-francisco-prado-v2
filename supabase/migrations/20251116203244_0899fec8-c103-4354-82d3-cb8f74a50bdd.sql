-- Add WhatsApp widget configuration to site_settings
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS whatsapp_numero VARCHAR(20) DEFAULT '5531999999999',
ADD COLUMN IF NOT EXISTS whatsapp_titulo VARCHAR(100) DEFAULT 'PradoAqui - Atendimento',
ADD COLUMN IF NOT EXISTS whatsapp_mensagem_padrao TEXT DEFAULT 'Olá! Gostaria de saber mais sobre os pacotes de pesca no PradoAqui.',
ADD COLUMN IF NOT EXISTS whatsapp_saudacao TEXT DEFAULT '👋 Olá! Como podemos ajudar você hoje?',
ADD COLUMN IF NOT EXISTS whatsapp_instrucao TEXT DEFAULT 'Escolha uma opção abaixo ou digite sua mensagem:',
ADD COLUMN IF NOT EXISTS whatsapp_opcoes JSONB DEFAULT '[
  {"text": "Quero fazer uma reserva", "message": "Olá! Gostaria de fazer uma reserva para pesca no Rio São Francisco."},
  {"text": "Consultar disponibilidade", "message": "Oi! Podem me informar a disponibilidade para os próximos finais de semana?"},
  {"text": "Informações sobre pacotes", "message": "Olá! Gostaria de saber mais detalhes sobre os pacotes de pesca disponíveis."},
  {"text": "Condições atuais do rio", "message": "Oi! Como estão as condições de pesca no rio hoje?"}
]'::jsonb,
ADD COLUMN IF NOT EXISTS whatsapp_horario VARCHAR(50) DEFAULT 'Seg-Dom: 6h às 22h';