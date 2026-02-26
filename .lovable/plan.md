

# Plano: Upload de Imagens PWA, Favicon e OG Image no Admin

## O que sera feito

Adicionar uma nova seção (Card) na pagina `Configuracoes.tsx` com 3 uploaders:
1. **Favicon** — salva URL no campo `favicon_url` (ja existe no banco)
2. **OG Image** — para compartilhamento em redes sociais
3. **Icones PWA** — icone 192x192 e 512x512

As imagens serao salvas no bucket `configuracoes` do Supabase Storage (ja existe) e as URLs salvas em `site_settings`.

## Detalhes Tecnicos

### Banco de dados
- `favicon_url` ja existe em `site_settings`
- Precisamos adicionar `og_image_url` e `pwa_icon_url` via migration SQL
- As imagens serao comprimidas no client antes do upload usando o `compressImage` ja existente

### Componente DynamicFavicon
- Criar componente que le `favicon_url` de `site_settings_public` e injeta `<link rel="icon">` no document head
- Tambem atualiza os icones PWA dinamicamente

### Frontend (Index.tsx, Blog.tsx, BlogPost.tsx)
- Alterar as tags `og:image` para usar a URL dinamica do `og_image_url` quando disponivel

## Arquivos a criar/editar

| Arquivo | Acao |
|---------|------|
| `supabase/migrations/add_brand_image_fields.sql` | Adicionar `og_image_url` e `pwa_icon_url` a `site_settings` e view publica |
| `src/pages/admin/Configuracoes.tsx` | Adicionar Card "Imagens do Site" com 3 uploaders (favicon, og-image, icones PWA) |
| `src/components/DynamicFavicon.tsx` | Componente que injeta favicon/PWA icons dinamicos no head |
| `src/App.tsx` | Montar `<DynamicFavicon />` |
| `src/pages/Index.tsx` | Usar `og_image_url` dinamico nas meta tags |

