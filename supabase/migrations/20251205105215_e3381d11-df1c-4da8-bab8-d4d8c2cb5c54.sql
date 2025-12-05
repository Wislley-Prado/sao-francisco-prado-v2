-- Permitir que visitantes façam upload de imagens de avaliacoes
CREATE POLICY "Visitantes podem fazer upload de imagens de avaliacoes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avaliacoes');

-- Permitir que qualquer pessoa visualize imagens de avaliações
CREATE POLICY "Imagens de avaliacoes são públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'avaliacoes');

-- Permitir que admins deletem imagens de avaliações
CREATE POLICY "Admins podem deletar imagens de avaliacoes"
ON storage.objects FOR DELETE
USING (bucket_id = 'avaliacoes' AND has_role(auth.uid(), 'admin'::app_role));