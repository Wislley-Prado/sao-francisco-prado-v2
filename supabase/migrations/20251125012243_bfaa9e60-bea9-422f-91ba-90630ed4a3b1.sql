-- Criar bucket para imagens de propriedades à venda
INSERT INTO storage.buckets (id, name, public)
VALUES ('propriedades-venda', 'propriedades-venda', true)
ON CONFLICT (id) DO NOTHING;

-- Política: Todos podem ver imagens (bucket público)
CREATE POLICY "Imagens de propriedades são públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'propriedades-venda');

-- Política: Admins podem fazer upload
CREATE POLICY "Admins podem fazer upload de imagens"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'propriedades-venda' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Política: Admins podem atualizar imagens
CREATE POLICY "Admins podem atualizar imagens"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'propriedades-venda' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Política: Admins podem deletar imagens
CREATE POLICY "Admins podem deletar imagens"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'propriedades-venda' 
  AND has_role(auth.uid(), 'admin'::app_role)
);
