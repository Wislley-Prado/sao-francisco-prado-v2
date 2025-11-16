-- Adicionar campos para redes sociais e mídia paga nos posts do blog
ALTER TABLE blog_posts 
ADD COLUMN redes_sociais jsonb DEFAULT '{}'::jsonb,
ADD COLUMN banner_midia_paga jsonb DEFAULT NULL;

COMMENT ON COLUMN blog_posts.redes_sociais IS 'Links para redes sociais do post (facebook, twitter, instagram, linkedin)';
COMMENT ON COLUMN blog_posts.banner_midia_paga IS 'Banner de mídia paga com campos: imagem_url, link_anunciante, alt_text';