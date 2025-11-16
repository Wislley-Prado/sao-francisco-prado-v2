-- Criar tabela de avaliações
CREATE TABLE public.avaliacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rancho_id UUID NOT NULL REFERENCES public.ranchos(id) ON DELETE CASCADE,
  nome_usuario TEXT NOT NULL,
  email TEXT NOT NULL,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT NOT NULL,
  verificado BOOLEAN NOT NULL DEFAULT false,
  resposta_admin TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Visitantes podem ver avaliações verificadas"
ON public.avaliacoes
FOR SELECT
USING (verificado = true);

CREATE POLICY "Admins podem gerenciar todas as avaliações"
ON public.avaliacoes
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_avaliacoes_updated_at
BEFORE UPDATE ON public.avaliacoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar índice para melhor performance
CREATE INDEX idx_avaliacoes_rancho_id ON public.avaliacoes(rancho_id);
CREATE INDEX idx_avaliacoes_verificado ON public.avaliacoes(verificado);