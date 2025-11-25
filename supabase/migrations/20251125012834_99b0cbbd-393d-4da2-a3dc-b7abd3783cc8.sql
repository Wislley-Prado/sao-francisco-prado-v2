-- Criar tabela para anúncios/banners
CREATE TABLE public.anuncios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  descricao TEXT,
  imagem_url TEXT NOT NULL,
  link_url TEXT,
  texto_botao TEXT DEFAULT 'Saiba Mais',
  tipo TEXT NOT NULL CHECK (tipo IN ('banner_principal', 'card_secundario', 'full_width')),
  posicao TEXT NOT NULL CHECK (posicao IN ('topo', 'meio', 'rodape', 'sidebar')),
  ativo BOOLEAN NOT NULL DEFAULT true,
  destaque BOOLEAN NOT NULL DEFAULT false,
  ordem INTEGER NOT NULL DEFAULT 0,
  data_inicio TIMESTAMP WITH TIME ZONE,
  data_fim TIMESTAMP WITH TIME ZONE,
  cliques INTEGER NOT NULL DEFAULT 0,
  visualizacoes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_anuncios_ativo ON public.anuncios(ativo);
CREATE INDEX idx_anuncios_posicao ON public.anuncios(posicao);
CREATE INDEX idx_anuncios_tipo ON public.anuncios(tipo);
CREATE INDEX idx_anuncios_destaque ON public.anuncios(destaque);

-- Habilitar RLS
ALTER TABLE public.anuncios ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Visitantes podem ver anúncios ativos"
ON public.anuncios
FOR SELECT
USING (
  ativo = true 
  AND (data_inicio IS NULL OR data_inicio <= now())
  AND (data_fim IS NULL OR data_fim >= now())
);

CREATE POLICY "Admins podem gerenciar anúncios"
ON public.anuncios
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_anuncios_updated_at
BEFORE UPDATE ON public.anuncios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Comentários
COMMENT ON TABLE public.anuncios IS 'Anúncios e banners exibidos no site';
COMMENT ON COLUMN public.anuncios.tipo IS 'Tipo de layout: banner_principal (hero), card_secundario (card), full_width (largura total)';
COMMENT ON COLUMN public.anuncios.posicao IS 'Onde exibir: topo, meio, rodape, sidebar';
COMMENT ON COLUMN public.anuncios.data_inicio IS 'Data de início da exibição (opcional)';
COMMENT ON COLUMN public.anuncios.data_fim IS 'Data de fim da exibição (opcional)';
