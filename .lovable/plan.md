

# Plano: Otimizar Velocidade do Site

## Problemas Identificados

Analisando os logs de rede e console, identifiquei os seguintes gargalos no carregamento inicial:

### 1. TrackingScripts faz request que sempre falha (406)
O componente `TrackingScripts.tsx` faz uma query direta a `site_settings` (tabela protegida por RLS), que retorna **erro 406** para visitantes. Isso gera uma request desperdiçada em cada carregamento.

### 2. HeroSection dispara 3 hooks de dados simultaneamente
O `HeroSection` carrega `useWeatherData`, `useDamData` e `useVideoSettings` imediatamente, gerando **4 requests** antes do usuário ver qualquer conteúdo.

### 3. useWeatherData sobrescreve cache global
O hook tem `refetchOnMount: true` e `refetchOnWindowFocus: true`, ignorando as configurações globais do QueryClient que desabilitam esses refetches.

### 4. Requests duplicados a site_settings_public
Vejo 2 requests separados para `site_settings_public` -- um do `useVideoSettings` e outro de outro componente (Header/Footer). Deveria ser uma única query.

### 5. AnunciosSection faz PATCH em cada visualização
Cada carregamento dispara múltiplos PATCH requests para atualizar contadores de visualização dos anúncios, bloqueando o thread.

### 6. PWA devOptions habilitado
No `vite.config.ts`, `devOptions.enabled: true` registra um service worker desnecessário que pode interferir no carregamento.

---

## Correções Planejadas

| # | Arquivo | Mudança | Impacto |
|---|---------|---------|---------|
| 1 | `TrackingScripts.tsx` | Usar `cachedQuery` com TTL de 1h ao invés de query direta; silenciar erro RLS | Elimina 1 request falhando |
| 2 | `useWeatherData.ts` | Remover `refetchOnMount: true` e `refetchOnWindowFocus: true` para respeitar cache global | Elimina re-fetches desnecessários |
| 3 | `vite.config.ts` | Remover `devOptions.enabled: true` | Evita SW em dev interferindo |
| 4 | `AnunciosSection.tsx` | Fazer PATCH de visualização com `setTimeout` de 2s (debounce) para não bloquear render inicial | Carregamento mais rápido |
| 5 | `index.html` | Adicionar `<link rel="preconnect">` para OpenWeatherMap API | Reduz latência DNS |

### Detalhes Técnicos

**TrackingScripts**: Vai tentar ler do cache localStorage primeiro (TTL 1h). Se não tiver cache, faz a query. Se der erro RLS, não tenta novamente por 1h.

**useWeatherData**: Removendo as flags de refetch, os dados ficam em cache por 15 minutos (configuração global do QueryClient) ao invés de rebuscar toda vez que a aba ganha foco.

**AnunciosSection**: O registro de visualização será adiado 2 segundos após render, permitindo que o conteúdo visual carregue primeiro.

Todas as mudanças são de baixo risco e não alteram funcionalidade visível -- apenas reduzem requests e melhoram tempo de carregamento.

