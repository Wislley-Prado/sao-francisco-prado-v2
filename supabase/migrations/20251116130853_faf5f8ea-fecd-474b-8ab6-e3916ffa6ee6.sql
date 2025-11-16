-- Criar tabela de analytics dos ranchos
CREATE TABLE public.rancho_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rancho_id UUID NOT NULL REFERENCES public.ranchos(id) ON DELETE CASCADE,
  evento TEXT NOT NULL CHECK (evento IN ('visualizacao', 'clique_whatsapp', 'clique_reserva')),
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.rancho_analytics ENABLE ROW LEVEL SECURITY;

-- Política para inserção pública (apenas eventos específicos)
CREATE POLICY "Permitir inserção de eventos de analytics"
ON public.rancho_analytics
FOR INSERT
WITH CHECK (true);

-- Política para admins visualizarem
CREATE POLICY "Admins podem ver analytics"
ON public.rancho_analytics
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Criar índices para melhor performance
CREATE INDEX idx_rancho_analytics_rancho_id ON public.rancho_analytics(rancho_id);
CREATE INDEX idx_rancho_analytics_evento ON public.rancho_analytics(evento);
CREATE INDEX idx_rancho_analytics_created_at ON public.rancho_analytics(created_at);

-- Criar view para estatísticas agregadas por rancho
CREATE VIEW public.rancho_estatisticas AS
SELECT 
  r.id,
  r.nome,
  r.slug,
  COUNT(CASE WHEN ra.evento = 'visualizacao' THEN 1 END) as total_visualizacoes,
  COUNT(CASE WHEN ra.evento = 'clique_whatsapp' THEN 1 END) as total_cliques_whatsapp,
  COUNT(CASE WHEN ra.evento = 'clique_reserva' THEN 1 END) as total_cliques_reserva,
  COALESCE(
    ROUND(
      (COUNT(CASE WHEN ra.evento IN ('clique_whatsapp', 'clique_reserva') THEN 1 END)::NUMERIC / 
      NULLIF(COUNT(CASE WHEN ra.evento = 'visualizacao' THEN 1 END), 0)) * 100, 
      2
    ), 
    0
  ) as taxa_conversao,
  COUNT(CASE WHEN ra.evento = 'visualizacao' AND ra.created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as visualizacoes_7_dias,
  COUNT(CASE WHEN ra.evento = 'visualizacao' AND ra.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as visualizacoes_30_dias
FROM public.ranchos r
LEFT JOIN public.rancho_analytics ra ON r.id = ra.rancho_id
GROUP BY r.id, r.nome, r.slug;

-- Permitir admins visualizarem a view
GRANT SELECT ON public.rancho_estatisticas TO authenticated;