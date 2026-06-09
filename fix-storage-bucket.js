/**
 * Script para verificar e criar o bucket 'propriedades-venda' no Supabase Storage
 * e configurar as políticas de acesso corretas.
 */

const SUPABASE_URL = 'https://pradoaqui.vendopro.com.br';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogInNlcnZpY2Vfcm9sZSIsCiAgImlzcyI6ICJzdXBhYmFzZSIsCiAgImlhdCI6IDE3MTUwNTA4MDAsCiAgImV4cCI6IDE4NzI4MTcyMDAKfQ.Yl30TXhhTdohurjkqf3tU76Ow-jWJhqvn7A1qmWAkdw';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'apikey': SERVICE_ROLE_KEY,
};

async function run() {
  console.log('🔍 Verificando buckets existentes...\n');

  // 1. Listar buckets existentes
  const listRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, { headers });
  const buckets = await listRes.json();

  if (!listRes.ok) {
    console.error('❌ Erro ao listar buckets:', buckets);
    return;
  }

  console.log('📦 Buckets existentes:');
  buckets.forEach(b => console.log(`  - ${b.id} (público: ${b.public})`));

  const bucketName = 'propriedades-venda';
  const exists = buckets.find(b => b.id === bucketName);

  // 2. Criar bucket se não existir
  if (!exists) {
    console.log(`\n⚠️  Bucket '${bucketName}' NÃO existe. Criando...`);
    const createRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        id: bucketName,
        name: bucketName,
        public: true,
        file_size_limit: 10485760, // 10MB
        allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      }),
    });
    const createData = await createRes.json();
    if (createRes.ok) {
      console.log(`✅ Bucket '${bucketName}' criado com sucesso!`);
    } else {
      console.error(`❌ Erro ao criar bucket:`, createData);
      return;
    }
  } else {
    console.log(`\n✅ Bucket '${bucketName}' já existe (público: ${exists.public})`);

    // Garantir que está público
    if (!exists.public) {
      console.log('🔧 Tornando bucket público...');
      const updateRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket/${bucketName}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ public: true }),
      });
      const updateData = await updateRes.json();
      if (updateRes.ok) {
        console.log('✅ Bucket atualizado para público!');
      } else {
        console.error('❌ Erro ao atualizar bucket:', updateData);
      }
    }
  }

  // 3. Criar/verificar políticas de storage via SQL
  console.log('\n🔧 Configurando políticas de storage...');

  const policies = [
    {
      name: 'Permitir upload autenticado - propriedades-venda',
      sql: `
        DO $$
        BEGIN
          -- Política para INSERT (upload)
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'storage' 
            AND tablename = 'objects' 
            AND policyname = 'Allow authenticated upload propriedades-venda'
          ) THEN
            CREATE POLICY "Allow authenticated upload propriedades-venda"
            ON storage.objects FOR INSERT
            TO authenticated
            WITH CHECK (bucket_id = 'propriedades-venda');
          END IF;

          -- Política para SELECT (leitura pública)
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'storage' 
            AND tablename = 'objects' 
            AND policyname = 'Allow public read propriedades-venda'
          ) THEN
            CREATE POLICY "Allow public read propriedades-venda"
            ON storage.objects FOR SELECT
            TO public
            USING (bucket_id = 'propriedades-venda');
          END IF;

          -- Política para UPDATE
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'storage' 
            AND tablename = 'objects' 
            AND policyname = 'Allow authenticated update propriedades-venda'
          ) THEN
            CREATE POLICY "Allow authenticated update propriedades-venda"
            ON storage.objects FOR UPDATE
            TO authenticated
            USING (bucket_id = 'propriedades-venda');
          END IF;

          -- Política para DELETE
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'storage' 
            AND tablename = 'objects' 
            AND policyname = 'Allow authenticated delete propriedades-venda'
          ) THEN
            CREATE POLICY "Allow authenticated delete propriedades-venda"
            ON storage.objects FOR DELETE
            TO authenticated
            USING (bucket_id = 'propriedades-venda');
          END IF;
        END $$;
      `,
    },
  ];

  for (const policy of policies) {
    const sqlRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: policy.sql }),
    });

    // Tenta via SQL direto se rpc não funcionar
    if (!sqlRes.ok) {
      console.log(`  ⚠️  RPC exec_sql não disponível. Use o SQL Editor do Supabase manualmente.`);
      break;
    }
  }

  // 4. Teste de upload
  console.log('\n🧪 Testando upload de arquivo...');
  const testContent = new Blob(['test'], { type: 'text/plain' });
  const testPath = `test-upload-${Date.now()}.txt`;

  const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucketName}/${testPath}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
      'Content-Type': 'text/plain',
    },
    body: testContent,
  });

  if (uploadRes.ok) {
    console.log('✅ Teste de upload bem-sucedido!');

    // Limpar arquivo de teste
    await fetch(`${SUPABASE_URL}/storage/v1/object/${bucketName}/${testPath}`, {
      method: 'DELETE',
      headers,
    });
    console.log('🧹 Arquivo de teste removido.');
  } else {
    const uploadError = await uploadRes.json();
    console.error('❌ Falha no teste de upload:', uploadError);
    console.log('\n📋 Possível causa: políticas de storage RLS bloqueando o upload.');
    console.log('💡 Execute o SQL abaixo no Supabase Dashboard > SQL Editor:\n');
    console.log(`
-- COLE ISSO NO SQL EDITOR DO SUPABASE:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'propriedades-venda',
  'propriedades-venda', 
  true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Políticas de storage
DROP POLICY IF EXISTS "Allow authenticated upload propriedades-venda" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read propriedades-venda" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update propriedades-venda" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete propriedades-venda" ON storage.objects;

CREATE POLICY "Allow authenticated upload propriedades-venda"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'propriedades-venda');

CREATE POLICY "Allow public read propriedades-venda"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'propriedades-venda');

CREATE POLICY "Allow authenticated update propriedades-venda"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'propriedades-venda');

CREATE POLICY "Allow authenticated delete propriedades-venda"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'propriedades-venda');
    `);
  }

  console.log('\n✅ Diagnóstico concluído!');
}

run().catch(console.error);
