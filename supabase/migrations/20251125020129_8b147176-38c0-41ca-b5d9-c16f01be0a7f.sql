-- Adicionar campos específicos para anúncios de imóveis
ALTER TABLE anuncios
ADD COLUMN imovel_area NUMERIC,
ADD COLUMN imovel_unidade_area TEXT CHECK (imovel_unidade_area IN ('m2', 'hectares', 'alqueires')),
ADD COLUMN imovel_preco NUMERIC,
ADD COLUMN imovel_localizacao TEXT;

-- Adicionar comentários para documentação
COMMENT ON COLUMN anuncios.imovel_area IS 'Área do imóvel (usado quando tipo=imovel)';
COMMENT ON COLUMN anuncios.imovel_unidade_area IS 'Unidade de medida da área (m2, hectares, alqueires)';
COMMENT ON COLUMN anuncios.imovel_preco IS 'Preço do imóvel (usado quando tipo=imovel)';
COMMENT ON COLUMN anuncios.imovel_localizacao IS 'Localização do imóvel (usado quando tipo=imovel)';