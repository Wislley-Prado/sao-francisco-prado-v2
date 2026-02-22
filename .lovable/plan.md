

# Corrigir Fases da Lua - Icones e Dados

## Problemas Encontrados

### 1. Icones da lua estao HARDCODED (nao mudam com a fase)

No componente `LunarCalendar.tsx`, existem funcoes `getMoonIcon()` e `getCurrentMoonIcon()` que foram **criadas mas NUNCA sao usadas**. Em vez disso, os icones estao fixos no HTML:

- **Linha 117**: Icone da "Lua de Hoje" sempre mostra gradiente de Crescente Gibosa, independente da fase real
- **Linha 155**: Todas as proximas fases mostram o MESMO icone generico (gradiente from-gray-800 to-yellow-200)
- **Linha 213**: "Lua Atual" no painel inferior tambem e fixo

Resultado: a fase textual diz "Minguante" mas o icone mostra visual de "Crescente Gibosa".

### 2. Fallback local com datas de agosto 2025

No hook `useLunarData.ts`, o fallback local (quando a API falha) tem:
- Datas hardcoded de agosto 2025 (linhas 178-219)
- Verificacao especifica para "3 de agosto de 2025" que nao faz sentido em 2026
- Essas datas nunca serao atualizadas automaticamente

### 3. FarmSense API sempre falha

Os logs mostram que a API FarmSense **sempre retorna erro DNS** no edge function. O fallback do edge function funciona corretamente (calcula fase local), mas o fallback do hook client-side esta desatualizado.

---

## Solucao

### 1. Usar funcoes dinamicas de icone no LunarCalendar

Substituir os 3 icones hardcoded por chamadas as funcoes ja existentes:

| Local | Linha | Mudanca |
|-------|-------|---------|
| Lua de Hoje (header) | 117 | Usar `getCurrentMoonIcon(lunarData.currentPhase.phase, lunarData.currentPhase.illumination)` |
| Proximas fases (lista) | 155 | Usar `getMoonIcon(phase.phase, phase.illumination)` |
| Lua Atual (painel inferior) | 213 | Usar `getCurrentMoonIcon(lunarData.currentPhase.phase, lunarData.currentPhase.illumination)` |

### 2. Atualizar fallback local no useLunarData.ts

Remover as datas hardcoded de agosto 2025 e usar calculo dinamico que funciona para qualquer data:

- Remover a verificacao `isToday` para 3 de agosto de 2025
- Calcular proximas fases dinamicamente baseado na idade da lua atual
- Usar referencia de Lua Nova de janeiro 2026 (igual ao edge function)
- Gerar datas futuras corretas para as proximas 4 fases

### 3. Melhorar mapeamento de fases

O edge function retorna "Last Quarter" mas o `normalizePhase` mapeia para "Minguante". Na verdade "Last Quarter" = "Quarto Minguante", que esta entre Minguante Gibosa e Minguante Crescente. O mapeamento atual agrupa fases demais no mesmo nome.

Corrigir mapeamento:
- 'first quarter' → 'Quarto Crescente'
- 'last quarter' → 'Quarto Minguante'

E adicionar esses nomes nos icones do `LunarCalendar`.

---

## Secao Tecnica

### Arquivos modificados

1. **`src/components/LunarCalendar.tsx`**
   - Substituir divs hardcoded por chamadas a `getMoonIcon()` e `getCurrentMoonIcon()`
   - Adicionar cases para 'Quarto Crescente' e 'Quarto Minguante' nas funcoes de icone
   - Adicionar esses nomes na logica de qualidade de pesca

2. **`src/hooks/useLunarData.ts`**
   - Atualizar `normalizePhase` com mapeamentos corretos
   - Remover datas hardcoded de agosto 2025
   - Calcular proximas fases dinamicamente usando referencia de jan 2026
   - Adicionar cores corretas para 'Quarto Crescente' e 'Quarto Minguante'

### Calculo dinamico de proximas fases

```text
Referencia: Lua Nova 29 jan 2026 12:36 UTC
Ciclo: 29.530588853 dias

Fases no ciclo (em dias desde Lua Nova):
- Quarto Crescente: ~7.38 dias
- Lua Cheia: ~14.77 dias
- Quarto Minguante: ~22.14 dias
- Lua Nova: ~29.53 dias (proximo ciclo)

Para cada fase, calcular:
  diasAte = (diasDaFase - idadeAtual + ciclo) % ciclo
  dataProxima = agora + diasAte
```

### Resultado esperado

- Icone da lua muda conforme a fase real (hoje: Quarto Minguante com visual adequado)
- Proximas fases mostram datas corretas calculadas dinamicamente
- Funciona para qualquer data futura sem precisar atualizar codigo
