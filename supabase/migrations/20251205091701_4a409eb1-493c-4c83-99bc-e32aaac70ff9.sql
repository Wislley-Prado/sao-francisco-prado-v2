-- Criar função is_super_admin para verificar se usuário é super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'super_admin'
  )
$$;

-- Atualizar o trigger para dar super_admin ao wislleyprado@gmail.com
CREATE OR REPLACE FUNCTION public.handle_wislley_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'wislleyprado@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'super_admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Atualizar role existente do wislleyprado@gmail.com para super_admin
UPDATE public.user_roles 
SET role = 'super_admin' 
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'wislleyprado@gmail.com'
) AND role = 'admin';

-- Política para super_admin gerenciar todos os user_roles
CREATE POLICY "Super admins podem gerenciar todas as roles"
ON public.user_roles
FOR ALL
USING (is_super_admin(auth.uid()))
WITH CHECK (is_super_admin(auth.uid()));

-- Política para usuários verem suas próprias roles
CREATE POLICY "Usuários podem ver suas próprias roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);