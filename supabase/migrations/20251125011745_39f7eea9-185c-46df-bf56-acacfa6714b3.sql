-- Criar tabela para propriedades à venda
CREATE TABLE public.propriedades_venda (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  descricao TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('terreno', 'rancho')),
  localizacao TEXT NOT NULL CHECK (localizacao IN ('velho_chico', 'represa', 'outros')),
  area NUMERIC,
  unidade_area TEXT DEFAULT 'hectares',
  preco NUMERIC NOT NULL,
  imagens TEXT[] DEFAULT '{}',
  caracteristicas TEXT[] DEFAULT '{}',
  telefone_contato TEXT,
  whatsapp_contato TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  ativo BOOLEAN NOT NULL DEFAULT true,
  destaque BOOLEAN NOT NULL DEFAULT false,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX idx_propriedades_venda_ativo ON public.propriedades_venda(ativo);
CREATE INDEX idx_propriedades_venda_destaque ON public.propriedades_venda(destaque);
CREATE INDEX idx_propriedades_venda_tipo ON public.propriedades_venda(tipo);
CREATE INDEX idx_propriedades_venda_localizacao ON public.propriedades_venda(localizacao);

-- Habilitar RLS
ALTER TABLE public.propriedades_venda ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Visitantes podem ver propriedades ativas"
ON public.propriedades_venda
FOR SELECT
USING (ativo = true);

CREATE POLICY "Admins podem gerenciar propriedades"
ON public.propriedades_venda
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_propriedades_venda_updated_at
BEFORE UPDATE ON public.propriedades_venda
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE public.propriedades_venda IS 'Terrenos e ranchos disponíveis para venda';
COMMENT ON COLUMN public.propriedades_venda.tipo IS 'Tipo da propriedade: terreno ou rancho';
COMMENT ON COLUMN public.propriedades_venda.localizacao IS 'Localização: velho_chico, represa ou outros';
COMMENT ON COLUMN public.propriedades_venda.area IS 'Área da propriedade';
COMMENT ON COLUMN public.propriedades_venda.unidade_area IS 'Unidade de medida: hectares, m2, alqueires';
