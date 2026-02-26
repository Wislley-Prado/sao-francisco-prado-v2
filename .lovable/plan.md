

# Diagnostico: Site Nao Abre / Muito Lento

## Problemas Encontrados

### 1. HeroSection bloqueia render com 2 chamadas externas ao OpenWeatherMap
O `HeroSection` chama `useWeatherData()` que faz **2 fetch HTTP externos** (current + forecast) para `api.openweathermap.org` no carregamento inicial. Em conexoes moveis lentas, isso pode levar 3-5 segundos e bloqueia a renderizacao do Hero.

### 2. Dupla verificacao de auth no startup
- `TrackingScripts` chama `supabase.auth.getSession()` 
- `AuthContext` chama `supabase.auth.getSession()`
Sao 2 chamadas de autenticacao simultaneas antes de qualquer conteudo aparecer.

### 3. Console.log excessivo em producao (cacheService)
O `cacheService.ts` faz `console.log` em TODA operacao de cache (hit, miss, set, expire). Em mobile, isso causa jank no rendering. O `useDamData.ts` tambem emite 15+ logs por render.

### 4. CookieConsent renderiza componentes pesados imediatamente
O banner de cookies carrega `Dialog`, `Card`, `Switch`, `Label` etc. no primeiro render, mesmo que so precise de um banner simples.

---

## Correcoes Planejadas

| # | Arquivo | Mudanca | Impacto |
|---|---------|---------|---------|
| 1 | `src/components/HeroSection.tsx` | Nao usar `useWeatherData()` e `useDamData()` diretamente - mostrar valores placeholder e carregar dados depois (defer) | Hero aparece instantaneamente |
| 2 | `src/components/TrackingScripts.tsx` | Remover chamada `supabase.auth.getSession()` propria - usar o AuthContext que ja faz isso | Elimina 1 chamada auth duplicada |
| 3 | `src/lib/cacheService.ts` | Remover TODOS os `console.log` em producao (verificar `import.meta.env.DEV`) | Menos jank no mobile |
| 4 | `src/hooks/useDamData.ts` | Remover todos os `console.log` de debug | Menos jank no mobile |
| 5 | `src/hooks/useWeatherData.ts` | Remover todos os `console.log` de debug | Menos jank no mobile |

### Detalhes Tecnicos

**HeroSection (Correcao 1)**: O componente vai renderizar imediatamente com valores default (temperatura 24C, nivel 86%, etc.) e depois atualizar quando os dados chegarem. Isso garante que o Hero aparece em <1 segundo mesmo em 3G lento. Os hooks continuam funcionando normalmente - apenas o render inicial nao fica bloqueado esperando.

**TrackingScripts (Correcao 2)**: Ao inves de chamar `getSession()` internamente, o componente vai receber o estado de autenticacao do `AuthContext` (via `useAuth()`). Como o AuthContext ja faz essa verificacao, elimina uma chamada de rede duplicada.

**Console.log (Correcoes 3-5)**: Em producao, cada `console.log` com emoji e string template custa tempo de CPU. Com ~20 logs por page load, isso causa stuttering perceptivel em celulares fracos. Vamos envolver todos em `if (import.meta.env.DEV)` para que so apareçam em desenvolvimento.

