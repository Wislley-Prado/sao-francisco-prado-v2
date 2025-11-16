-- Permitir que visitantes criem avaliações (que ficam pendentes de aprovação)
CREATE POLICY "Visitantes podem criar avaliações"
ON public.avaliacoes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);