-- Policy para user_roles: apenas admins podem visualizar roles
CREATE POLICY "Admins podem visualizar todas as roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy para user_roles: apenas admins podem inserir roles
CREATE POLICY "Admins podem gerenciar roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));