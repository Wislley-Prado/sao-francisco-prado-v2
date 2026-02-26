

# Diagnostico: Site Lento / Nao Abre no Celular

## Resultados do Profiling (mobile 375x812)

| Metrica | Valor | Ideal |
|---------|-------|-------|
| DOM Nodes | **15,948** | < 1,500 |
| FCP | **4,996ms** | < 1,800ms |
| Full Page Load | **5,126ms** | < 3,000ms |
| Scripts carregados | 139 | -- |
| PATCH requests (ads) | 7 | 0-1 |

## Problemas Encontrados

### 1. WhatsAppButton faz query duplicada a `site_settings_public`
**Arquivo:** `src/components/WhatsAppButton.tsx` (linha 69)
Faz `supabase.from('site_settings_public').select('*')` direto, ignorando o hook `useSiteSettings` que ja faz a mesma query com cache.
**Impacto:** 1 request extra (674ms)

### 2. AnunciosSection registra views de TODOS os ads de uma vez
**Arquivo:** `src/components/AnunciosSection.tsx`
Existem 3 instancias (topo, meio, rodape) e cada uma registra views dos seus ads. Com 7 ads ativos, sao **7 PATCH requests** no carregamento inicial.
**Impacto:** 7 requests write bloqueando o render

### 3. recharts (224KB) carregado eagerly via DamInfo
Os componentes `DamHistoryChart` e `DamLevelCard` importam recharts diretamente. Mesmo com `DamInfo` em Suspense/lazy, o recharts e resolvido como dependencia e carregado cedo.
**Impacto:** 224KB + 1,102ms de parse

### 4. 15,948 DOM nodes
O site renderiza TODAS as secoes (Hero, DamInfo, LunarCalendar, WeatherDashboard, Ranchos, Pacotes, Blog, Testimonials, FAQ, 3x Anuncios, WhatsApp, CookieConsent, Footer) de uma vez. Mesmo com Suspense, tudo resolve rapidamente.

## Correcoes Planejadas

### 1. WhatsAppButton: usar useSiteSettings
Refatorar para consumir dados do hook centralizado, eliminando query duplicada.

### 2. AnunciosSection: batch view registration
Ao inves de registrar views individualmente, coletar IDs e fazer 1 unico PATCH apos 5 segundos. Ou melhor: so registrar view do ad **visivel** (currentIndex), nao de todos.

### 3. Lazy import recharts nos componentes dam
Usar `React.lazy()` para `DamHistoryChart` e `DamLevelCard`, ou dynamic import de recharts dentro deles.

### 4. Adiar renderizacao de secoes abaixo do fold
Usar `IntersectionObserver` para renderizar `RanchosSection`, `PackagesSection`, `BlogSection`, `TestimonialsSection`, `FAQSection` e `AnunciosSection` somente quando o usuario scrollar ate perto delas. Isso reduz DOM nodes iniciais drasticamente.

### 5. Remover 2 dos 3 AnunciosSection do render inicial
As secoes `meio` e `rodape` so devem carregar quando o usuario chegar nelas.

## Arquivos a Editar

| Arquivo | Mudanca |
|---------|---------|
| `src/components/WhatsAppButton.tsx` | Usar `useSiteSettings` ao inves de query direta |
| `src/components/AnunciosSection.tsx` | Registrar view apenas do ad visivel, com delay de 5s |
| `src/pages/Index.tsx` | Envolver secoes below-fold com IntersectionObserver lazy rendering |
| `src/components/dam/DamHistoryChart.tsx` | Lazy import do recharts |
| `src/components/dam/DamLevelCard.tsx` | Lazy import do recharts |

## Impacto Esperado
- De 15,948 para ~3,000 DOM nodes no carregamento inicial
- De 7 PATCH requests para 1
- FCP reduzido para ~2-3 segundos
- Eliminacao de 1 query duplicada

