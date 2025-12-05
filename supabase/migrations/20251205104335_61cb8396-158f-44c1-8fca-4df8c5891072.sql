-- Atualizar todos os super_admin para admin
UPDATE public.user_roles 
SET role = 'admin'::app_role 
WHERE role = 'super_admin'::app_role;

-- Remover o trigger e função que criava super_admin automaticamente
DROP TRIGGER IF EXISTS on_wislley_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_wislley_admin() CASCADE;