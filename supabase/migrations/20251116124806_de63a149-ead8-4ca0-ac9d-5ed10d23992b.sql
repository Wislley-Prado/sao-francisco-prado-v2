-- Criar tabela para configurações globais de tracking
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facebook_pixel text,
  google_analytics text,
  google_tag_manager text,
  custom_head_scripts text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policy para admins gerenciarem configurações
CREATE POLICY "Admins podem gerenciar configurações do site"
ON public.site_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policy para visitantes visualizarem (necessário para injetar scripts)
CREATE POLICY "Visitantes podem ver configurações públicas do site"
ON public.site_settings
FOR SELECT
USING (true);

-- Adicionar coluna tracking_code na tabela ranchos
ALTER TABLE public.ranchos
ADD COLUMN IF NOT EXISTS tracking_code text;

-- Inserir registro inicial de configurações (apenas um registro será usado)
INSERT INTO public.site_settings (id) 
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();