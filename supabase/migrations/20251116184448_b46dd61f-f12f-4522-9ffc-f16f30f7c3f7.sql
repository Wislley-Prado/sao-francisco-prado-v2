-- Criar políticas de storage para o bucket configuracoes permitir upload de imagens de depoimentos por admins

-- Permitir admins fazerem upload de arquivos no bucket configuracoes
CREATE POLICY "Admins podem fazer upload no bucket configuracoes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'configuracoes' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Permitir admins atualizarem arquivos no bucket configuracoes
CREATE POLICY "Admins podem atualizar arquivos no bucket configuracoes"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'configuracoes' 
  AND has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  bucket_id = 'configuracoes' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Permitir admins deletarem arquivos no bucket configuracoes
CREATE POLICY "Admins podem deletar arquivos no bucket configuracoes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'configuracoes' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Permitir todos visualizarem arquivos públicos do bucket configuracoes
CREATE POLICY "Todos podem visualizar arquivos do bucket configuracoes"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'configuracoes');