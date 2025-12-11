-- Criar tabela para armazenar dados da represa
CREATE TABLE public.dam_data (
  id INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Habilitar RLS
ALTER TABLE public.dam_data ENABLE ROW LEVEL SECURITY;

-- Policy para leitura pública
CREATE POLICY "Visitantes podem ver dados da represa"
ON public.dam_data
FOR SELECT
USING (true);

-- Policy para atualização via service role (edge function)
CREATE POLICY "Service role pode atualizar dados"
ON public.dam_data
FOR ALL
USING (true)
WITH CHECK (true);

-- Inserir registro inicial vazio
INSERT INTO public.dam_data (id, data) VALUES (1, '{}'::jsonb);

-- Habilitar extensões necessárias para cron
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;