-- Adicionar campos para vincular depoimentos a pacotes
ALTER TABLE depoimentos 
ADD COLUMN pacote_id UUID REFERENCES pacotes(id) ON DELETE SET NULL,
ADD COLUMN tipo_pacote TEXT CHECK (tipo_pacote IN ('pescaria', 'completo', 'personalizado'));

-- Criar índice para melhorar performance de consultas
CREATE INDEX idx_depoimentos_pacote_id ON depoimentos(pacote_id);
CREATE INDEX idx_depoimentos_tipo_pacote ON depoimentos(tipo_pacote);

-- Comentários para documentação
COMMENT ON COLUMN depoimentos.pacote_id IS 'Vincula o depoimento a um pacote específico. NULL = depoimento geral';
COMMENT ON COLUMN depoimentos.tipo_pacote IS 'Tipo de pacote associado: pescaria, completo ou personalizado. Útil para filtrar depoimentos por categoria';