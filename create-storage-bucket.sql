-- ================================================================
-- EXECUTE ESTE SQL NO SUPABASE DASHBOARD > SQL EDITOR
-- Cria o bucket 'propriedades-venda' e configura as políticas
-- ================================================================

-- 1. Criar o bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'propriedades-venda',
  'propriedades-venda',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Allow authenticated upload propriedades-venda" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read propriedades-venda" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update propriedades-venda" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete propriedades-venda" ON storage.objects;
DROP POLICY IF EXISTS "propriedades-venda_upload" ON storage.objects;
DROP POLICY IF EXISTS "propriedades-venda_read" ON storage.objects;
DROP POLICY IF EXISTS "propriedades-venda_delete" ON storage.objects;

-- 3. Criar políticas de acesso

-- Upload: apenas usuários autenticados (admins)
CREATE POLICY "Allow authenticated upload propriedades-venda"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'propriedades-venda');

-- Leitura: pública (para exibir as imagens no site)
CREATE POLICY "Allow public read propriedades-venda"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'propriedades-venda');

-- Atualização: apenas usuários autenticados
CREATE POLICY "Allow authenticated update propriedades-venda"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'propriedades-venda');

-- Exclusão: apenas usuários autenticados
CREATE POLICY "Allow authenticated delete propriedades-venda"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'propriedades-venda');

-- 4. Verificar resultado
SELECT id, name, public, file_size_limit FROM storage.buckets WHERE id = 'propriedades-venda';
