
# Corrigir Redes Sociais e Video Gravado na Home

## Problema Encontrado

A causa raiz dos dois problemas e a mesma: **a view `site_settings_public` nao retorna dados para visitantes anonimos**.

### Por que isso acontece?

A tabela `site_settings` tem RLS (Row Level Security) ativado com estas politicas:
- **Admins**: podem ler e escrever (funciona)
- **Visitantes**: a politica SELECT tem a condicao `false` -- ou seja, BLOQUEIA todas as leituras

A view `site_settings_public` faz `SELECT FROM site_settings`, mas como ela nao tem `SECURITY DEFINER`, ela roda com as permissoes do visitante (anon). Como o anon esta bloqueado pela RLS, a view retorna 0 linhas.

### Impacto:
1. **Redes sociais** -- o Footer usa `useSiteSettings()` que consulta a view `site_settings_public`. Como retorna vazio, `settings` e null e os links de Facebook, Instagram, YouTube, TikTok nao aparecem
2. **Video gravado** -- o HeroSection usa `useVideoSettings()` que consulta `site_settings` diretamente com `.single()`. Como o anon esta bloqueado, retorna erro PGRST116 e o video cai no fallback (ID padrao `cN_BspPR2gg`)

Os dados existem no banco corretamente:
- `youtube_video_url`: `https://www.youtube.com/watch?v=vGVZlO0lrpQ`
- `facebook_url`, `instagram_url`, `youtube_url`, `tiktok_url`: todos configurados

---

## Solucao

### 1. Recriar a view como SECURITY DEFINER

Recriar `site_settings_public` com `security_invoker = false` (SECURITY DEFINER). Isso faz a view rodar com permissoes do criador (owner/postgres), ignorando a RLS da tabela base. A view ja filtra apenas colunas seguras (sem tracking codes), entao e seguro.

Executar via migracao SQL:

```text
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
```

### 2. Corrigir `useVideoSettings` para usar a view publica

Atualmente `useVideoSettings` consulta `site_settings` diretamente, o que falha por causa da RLS. Alterar para consultar `site_settings_public` com `.maybeSingle()` ao inves de `.single()`.

Arquivo: `src/hooks/useVideoSettings.ts`

Mudanca:
- De: `supabase.from('site_settings').select(...).single()`
- Para: `supabase.from('site_settings_public' as any).select(...).maybeSingle()`

Isso elimina o erro PGRST116 e carrega as URLs de video corretamente.

### 3. Nenhuma mudanca necessaria no Footer/Header

Uma vez que a view funcione, o `useSiteSettings()` ja vai retornar os dados corretos e as redes sociais aparecerao automaticamente em todas as telas (PC e mobile).

---

## Secao Tecnica

### Arquivos modificados

1. **Nova migracao SQL**: recriar view `site_settings_public` com `security_invoker = false` e GRANT para anon
2. **Editar** `src/hooks/useVideoSettings.ts`: mudar query de `site_settings` para `site_settings_public` e usar `maybeSingle()`

### Por que SECURITY DEFINER e seguro aqui

A view `site_settings_public` ja exclui colunas sensiveis como `facebook_pixel`, `google_analytics`, `google_tag_manager` e `custom_head_scripts`. Ela so expoe dados publicos (redes sociais, WhatsApp, YouTube URLs). Usar SECURITY DEFINER neste caso e a pratica recomendada pelo Supabase para views publicas.

### Resultado esperado

- Redes sociais visíveis no Footer em PC e mobile
- Video gravado correto na HeroSection (video ID: `vGVZlO0lrpQ`)
- Sem erros PGRST116 no console
