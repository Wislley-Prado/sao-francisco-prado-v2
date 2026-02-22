DROP VIEW IF EXISTS site_settings_public;

CREATE VIEW site_settings_public
WITH (security_invoker = false)
AS SELECT
  id, created_at, updated_at,
  whatsapp_numero, whatsapp_titulo, whatsapp_mensagem_padrao,
  whatsapp_saudacao, whatsapp_instrucao, whatsapp_horario, whatsapp_opcoes,
  youtube_live_url, youtube_video_url, youtube_institucional_url,
  autor_avatar_url,
  facebook_url, instagram_url, youtube_url, tiktok_url, twitter_url,
  telefone_contato, email_contato,
  copyright_text, reserva_button_link
FROM site_settings;

GRANT SELECT ON site_settings_public TO anon, authenticated;