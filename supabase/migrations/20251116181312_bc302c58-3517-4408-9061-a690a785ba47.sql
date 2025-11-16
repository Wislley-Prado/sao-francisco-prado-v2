-- Adicionar campos para vincular FAQs a pacotes e ranchos
ALTER TABLE public.faqs
ADD COLUMN pacote_id UUID REFERENCES public.pacotes(id) ON DELETE CASCADE,
ADD COLUMN rancho_id UUID REFERENCES public.ranchos(id) ON DELETE CASCADE;

-- Adicionar índices para melhor performance
CREATE INDEX idx_faqs_pacote_id ON public.faqs(pacote_id) WHERE pacote_id IS NOT NULL;
CREATE INDEX idx_faqs_rancho_id ON public.faqs(rancho_id) WHERE rancho_id IS NOT NULL;

-- Comentários explicativos
COMMENT ON COLUMN public.faqs.pacote_id IS 'Se preenchido, FAQ aparece apenas na página deste pacote';
COMMENT ON COLUMN public.faqs.rancho_id IS 'Se preenchido, FAQ aparece apenas na página deste rancho';
COMMENT ON TABLE public.faqs IS 'FAQs podem ser globais (sem pacote_id/rancho_id) ou específicos de pacotes/ranchos';