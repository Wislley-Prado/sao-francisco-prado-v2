-- ============================================
-- CORREÇÃO DE SEGURANÇA: Proteger dados sensíveis
-- ============================================

-- 1. CRIAR VIEW PÚBLICA PARA AVALIAÇÕES (SEM EMAIL)
-- ============================================
CREATE VIEW public.avaliacoes_public
WITH (security_invoker = on) AS
SELECT 
  id,
  rancho_id,
  nome_usuario,
  nota,
  comentario,
  resposta_admin,
  imagens,
  verificado,
  created_at,
  updated_at
FROM public.avaliacoes
WHERE verificado = true;

-- Conceder acesso à view para usuários anônimos
GRANT SELECT ON public.avaliacoes_public TO anon;
GRANT SELECT ON public.avaliacoes_public TO authenticated;

-- 2. ATUALIZAR RLS DA TABELA AVALIACOES
-- ============================================
-- Remover política antiga que expõe emails
DROP POLICY IF EXISTS "Visitantes podem ver avaliações verificadas" ON public.avaliacoes;

-- Nova política: visitantes não podem acessar tabela diretamente (usam a view)
CREATE POLICY "Visitantes acessam via view pública"
ON public.avaliacoes
FOR SELECT
USING (false);

-- 3. CRIAR VIEW PÚBLICA PARA SITE_SETTINGS (SEM DADOS SENSÍVEIS)
-- ============================================
CREATE VIEW public.site_settings_public
WITH (security_invoker = on) AS
SELECT 
  id,
  whatsapp_numero,
  whatsapp_titulo,
  whatsapp_mensagem_padrao,
  whatsapp_saudacao,
  whatsapp_instrucao,
  whatsapp_horario,
  whatsapp_opcoes,
  youtube_live_url,
  youtube_institucional_url,
  youtube_video_url,
  autor_avatar_url,
  created_at,
  updated_at
FROM public.site_settings;

-- Conceder acesso à view para usuários anônimos
GRANT SELECT ON public.site_settings_public TO anon;
GRANT SELECT ON public.site_settings_public TO authenticated;

-- 4. ATUALIZAR RLS DA TABELA SITE_SETTINGS
-- ============================================
-- Remover política antiga que expõe tudo
DROP POLICY IF EXISTS "Visitantes podem ver configurações públicas do site" ON public.site_settings;

-- Nova política: visitantes não podem acessar tabela diretamente (usam a view)
CREATE POLICY "Visitantes acessam via view pública"
ON public.site_settings
FOR SELECT
USING (false);