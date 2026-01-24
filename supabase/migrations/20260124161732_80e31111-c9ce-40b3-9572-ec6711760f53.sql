-- Corrigir RLS policies da tabela pacotes para permitir que admins vejam TODOS os pacotes
-- O problema é que ambas as policies são RESTRICTIVE, exigindo que TODAS sejam satisfeitas

-- Remover a policy restritiva de admin
DROP POLICY IF EXISTS "Admins podem gerenciar pacotes" ON public.pacotes;

-- Criar nova policy PERMISSIVE para admin (permite acesso completo independente de ativo)
CREATE POLICY "Admins podem gerenciar pacotes" 
ON public.pacotes 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- A policy de visitantes já está correta (restritiva para ver apenas ativos)
-- Não precisamos alterar ela

-- Repetir para pacote_imagens que tem o mesmo problema
DROP POLICY IF EXISTS "Admins podem gerenciar imagens de pacotes" ON public.pacote_imagens;

CREATE POLICY "Admins podem gerenciar imagens de pacotes" 
ON public.pacote_imagens 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));