-- ================================================================
-- EXECUTE ESTE SQL NO SUPABASE DASHBOARD > SQL EDITOR
-- Corrige as políticas RLS da tabela 'propriedades_venda'
-- e do bucket 'propriedades-venda'
-- ================================================================

-- ========================
-- 1. TABELA propriedades_venda
-- ========================

-- Verificar se RLS está habilitado
ALTER TABLE public.propriedades_venda ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas
DROP POLICY IF EXISTS "Allow public read propriedades_venda" ON public.propriedades_venda;
DROP POLICY IF EXISTS "Allow authenticated insert propriedades_venda" ON public.propriedades_venda;
DROP POLICY IF EXISTS "Allow authenticated update propriedades_venda" ON public.propriedades_venda;
DROP POLICY IF EXISTS "Allow authenticated delete propriedades_venda" ON public.propriedades_venda;
DROP POLICY IF EXISTS "propriedades_venda_select" ON public.propriedades_venda;
DROP POLICY IF EXISTS "propriedades_venda_insert" ON public.propriedades_venda;
DROP POLICY IF EXISTS "propriedades_venda_update" ON public.propriedades_venda;
DROP POLICY IF EXISTS "propriedades_venda_delete" ON public.propriedades_venda;

-- Leitura pública (site pode exibir)
CREATE POLICY "Allow public read propriedades_venda"
ON public.propriedades_venda FOR SELECT
TO public
USING (true);

-- INSERT: apenas usuários autenticados (admins)
CREATE POLICY "Allow authenticated insert propriedades_venda"
ON public.propriedades_venda FOR INSERT
TO authenticated
WITH CHECK (true);

-- UPDATE: apenas usuários autenticados
CREATE POLICY "Allow authenticated update propriedades_venda"
ON public.propriedades_venda FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- DELETE: apenas usuários autenticados
CREATE POLICY "Allow authenticated delete propriedades_venda"
ON public.propriedades_venda FOR DELETE
TO authenticated
USING (true);

-- ========================
-- 2. BUCKET propriedades-venda (Storage)
-- ========================

-- Criar/atualizar bucket
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
  file_size_limit = 10485760;

-- Remover políticas antigas do storage
DROP POLICY IF EXISTS "Allow authenticated upload propriedades-venda" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read propriedades-venda" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update propriedades-venda" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete propriedades-venda" ON storage.objects;
DROP POLICY IF EXISTS "propriedades-venda_upload" ON storage.objects;
DROP POLICY IF EXISTS "propriedades-venda_read" ON storage.objects;
DROP POLICY IF EXISTS "propriedades-venda_delete" ON storage.objects;

-- Criar políticas do storage
CREATE POLICY "Allow authenticated upload propriedades-venda"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'propriedades-venda');

CREATE POLICY "Allow public read propriedades-venda"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'propriedades-venda');

CREATE POLICY "Allow authenticated update propriedades-venda"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'propriedades-venda');

CREATE POLICY "Allow authenticated delete propriedades-venda"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'propriedades-venda');

-- ========================
-- 3. VERIFICAÇÃO FINAL
-- ========================
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE tablename = 'propriedades_venda'
ORDER BY cmd;
