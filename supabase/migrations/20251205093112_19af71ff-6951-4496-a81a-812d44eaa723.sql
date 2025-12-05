-- Remover políticas incorretas (aplicadas ao role public)
DROP POLICY IF EXISTS "Super admins podem gerenciar todas as roles" ON public.user_roles;
DROP POLICY IF EXISTS "Usuários podem ver suas próprias roles" ON public.user_roles;

-- Recriar política para super admins gerenciarem roles (para authenticated)
CREATE POLICY "Super admins podem gerenciar todas as roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (is_super_admin(auth.uid()))
WITH CHECK (is_super_admin(auth.uid()));

-- Recriar política para usuários verem suas próprias roles (para authenticated)
CREATE POLICY "Usuários podem ver suas próprias roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);