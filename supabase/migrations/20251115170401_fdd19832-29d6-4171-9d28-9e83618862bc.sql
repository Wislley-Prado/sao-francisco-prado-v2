-- Adicionar role de admin para wislleyprado@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('b3863b56-c0a6-46c9-8468-a8ca514a260c', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;