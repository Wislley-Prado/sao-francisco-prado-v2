-- Política para admins fazerem upload de imagens de pacotes
CREATE POLICY "Admins podem fazer upload de imagens de pacotes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pacotes' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Política para admins atualizarem imagens de pacotes  
CREATE POLICY "Admins podem atualizar imagens de pacotes"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'pacotes' 
  AND has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  bucket_id = 'pacotes' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Política para admins deletarem imagens de pacotes
CREATE POLICY "Admins podem deletar imagens de pacotes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'pacotes' 
  AND has_role(auth.uid(), 'admin'::app_role)
);