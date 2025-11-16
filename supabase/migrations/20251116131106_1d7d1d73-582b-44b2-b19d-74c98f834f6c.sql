-- Remover a view antiga com SECURITY DEFINER
DROP VIEW IF EXISTS public.rancho_estatisticas;

-- Recriar a view sem SECURITY DEFINER
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

-- Garantir permissões
GRANT SELECT ON public.rancho_estatisticas TO authenticated;