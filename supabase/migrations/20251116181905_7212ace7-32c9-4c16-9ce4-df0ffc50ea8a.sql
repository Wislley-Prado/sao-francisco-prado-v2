-- Criar tabela para votos de FAQs
CREATE TABLE public.faq_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faq_id UUID NOT NULL REFERENCES public.faqs(id) ON DELETE CASCADE,
  voto BOOLEAN NOT NULL, -- true = útil (👍), false = não útil (👎)
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_faq_votes_faq_id ON public.faq_votes(faq_id);
CREATE INDEX idx_faq_votes_created_at ON public.faq_votes(created_at);

-- Enable RLS
ALTER TABLE public.faq_votes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Visitantes podem registrar votos"
ON public.faq_votes FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins podem ver todos os votos"
ON public.faq_votes FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- View para estatísticas de FAQs
CREATE OR REPLACE VIEW public.faq_estatisticas AS
SELECT 
  f.id,
  f.pergunta,
  f.ordem,
  f.ativo,
  f.pacote_id,
  f.rancho_id,
  COALESCE(COUNT(v.id), 0) as total_votos,
  COALESCE(SUM(CASE WHEN v.voto = true THEN 1 ELSE 0 END), 0) as votos_uteis,
  COALESCE(SUM(CASE WHEN v.voto = false THEN 1 ELSE 0 END), 0) as votos_nao_uteis,
  CASE 
    WHEN COUNT(v.id) > 0 THEN 
      ROUND((SUM(CASE WHEN v.voto = true THEN 1 ELSE 0 END)::numeric / COUNT(v.id)::numeric) * 100, 1)
    ELSE 0 
  END as taxa_utilidade
FROM public.faqs f
LEFT JOIN public.faq_votes v ON f.id = v.faq_id
GROUP BY f.id, f.pergunta, f.ordem, f.ativo, f.pacote_id, f.rancho_id;

-- Comentários
COMMENT ON TABLE public.faq_votes IS 'Votos de utilidade dos FAQs (útil/não útil)';
COMMENT ON COLUMN public.faq_votes.voto IS 'true = útil (👍), false = não útil (👎)';
COMMENT ON VIEW public.faq_estatisticas IS 'View com estatísticas agregadas dos votos de FAQs';