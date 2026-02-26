

# Plano: Otimizar Carregamento do Site

## Problema Principal
O carregamento inicial dispara **14+ requests simultâneos** ao Supabase e APIs externas. Muitos são duplicados ou desnecessários.

## Requests atuais no primeiro carregamento (cache vazio)

| Request | Necessário? |
|---------|-------------|
| `site_settings` (TrackingScripts) | **406 SEMPRE** - tabela protegida por RLS |
| `site_settings_public?select=*` (useSiteSettings) | Sim |
| `site_settings_public?select=youtube_live_url...` (useVideoSettings) | **DUPLICADO** - dados já vêm no anterior |
| `anuncios?posicao=topo` | Sim |
| `anuncios?posicao=meio` | Poderia ser consolidado |
| `anuncios?posicao=rodape` | Poderia ser consolidado |
| `dam_data` | Sim |
| `ranchos` | Sim |
| `pacotes` | Sim |
| `weather` (current) | Sim |
| `weather` (forecast) | Sim |
| `blog_posts` | Sim (lazy) |
| `depoimentos` | Sim (lazy) |

**Total: 14 requests, sendo 2 desnecessários e 2 consolidáveis = economia de 4 requests**

---

## Correções Planejadas

### 1. Eliminar query duplicada de `site_settings_public`
**Arquivo:** `src/hooks/useVideoSettings.ts`
- Refatorar `useVideoSettings` para usar os dados de `useSiteSettings` (de `useOptimizedData.ts`) ao invés de fazer query separada
- Remove 1 request duplicado

### 2. Corrigir TrackingScripts (406 persistente)
**Arquivo:** `src/components/TrackingScripts.tsx`
- Mudar de `site_settings` (protegida) para `site_settings_public` (acessível)
- A tabela `site_settings_public` já contém os dados necessários (veja o response body nos network requests - não tem facebook_pixel/google_analytics lá, mas se não tem, o componente não deve tentar buscar)
- Se os campos de tracking não existem em `site_settings_public`, simplesmente **não renderizar o componente** para visitantes anônimos (elimina o request 406)

### 3. Consolidar 3 queries de anúncios em 1
**Arquivo:** `src/hooks/useOptimizedData.ts`
- Criar `useAllAnuncios()` que busca todos os anúncios ativos em uma única query
- Filtrar por posição no frontend
- Reduz 3 requests para 1

### 4. Adiar requests não-críticos
**Arquivo:** `src/pages/Index.tsx`
- O `AnunciosSection posicao="topo"` renderiza imediatamente após o Hero, disparando query antes do usuário scrollar
- Envolver em Suspense com delay ou lazy load

---

## Impacto Esperado
- De **14 requests** para **~9 requests** no carregamento inicial
- Eliminação do erro 406 constante
- Cache localStorage já funciona bem para visitas subsequentes

