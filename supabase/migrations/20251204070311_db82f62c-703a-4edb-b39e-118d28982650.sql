-- Adicionar coluna de imagens na tabela avaliacoes
ALTER TABLE public.avaliacoes 
ADD COLUMN imagens TEXT[] DEFAULT '{}';

-- Criar bucket para imagens de avaliações
INSERT INTO storage.buckets (id, name, public)
VALUES ('avaliacoes', 'avaliacoes', true)
ON CONFLICT (id) DO NOTHING;

-- Política: Qualquer pessoa pode fazer upload de imagens
CREATE POLICY "Visitantes podem fazer upload de imagens de avaliações"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avaliacoes');

-- Política: Qualquer pessoa pode ver imagens de avaliações
CREATE POLICY "Visitantes podem ver imagens de avaliações"
ON storage.objects FOR SELECT
USING (bucket_id = 'avaliacoes');

-- Política: Admins podem deletar imagens de avaliações
CREATE POLICY "Admins podem deletar imagens de avaliações"
ON storage.objects FOR DELETE
USING (bucket_id = 'avaliacoes' AND has_role(auth.uid(), 'admin'::app_role));