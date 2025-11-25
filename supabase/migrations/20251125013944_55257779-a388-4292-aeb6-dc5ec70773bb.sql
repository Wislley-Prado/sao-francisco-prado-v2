-- Adicionar coluna de duração de exibição em segundos
ALTER TABLE anuncios 
ADD COLUMN duracao_exibicao integer DEFAULT 8 NOT NULL;

COMMENT ON COLUMN anuncios.duracao_exibicao IS 'Tempo de exibição do anúncio em segundos (padrão: 8 segundos)';