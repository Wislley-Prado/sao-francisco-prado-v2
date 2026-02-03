
## Plano: Corrigir Movimentação da Página Durante Transições de Anúncios

### Problema Identificado
A página está "pulando" para cima e para baixo no mobile durante as transições porque os diferentes tipos de anúncios têm **alturas diferentes**:

- **banner_principal**: 400px fixo
- **full_width**: 300px fixo  
- **card_secundario**: altura variável (depende do conteúdo)

Quando o carousel muda de um anúncio para outro de tipo diferente, a altura do container muda, causando **layout shift** que empurra a página.

### Solução Proposta
Padronizar a altura do container de anúncios para evitar mudanças de layout durante transições.

### Arquivos a Modificar

#### `src/components/AnunciosSection.tsx`

**Mudanças:**

1. **Criar wrapper com altura fixa** para o container de anúncios:
   - Desktop: `min-h-[400px]`
   - Mobile: `min-h-[350px]` ou `min-h-[300px]`

2. **Padronizar alturas por tipo para mobile**:
   - `banner_principal`: `h-[300px] md:h-[400px]`
   - `card_secundario`: `min-h-[300px] md:min-h-[auto]`
   - `full_width`: `h-[300px]` (já está)

3. **Usar posicionamento absoluto para slides**:
   - Container pai com altura fixa e `position: relative`
   - Cada anúncio com `position: absolute` e `inset-0`
   - Transições sem afetar o layout da página

### Detalhes Técnicos

```text
┌─────────────────────────────────────────┐
│  Container (altura fixa: 300px mobile)  │
│  ┌───────────────────────────────────┐  │
│  │  Slide Atual (position: absolute) │  │
│  │  inset-0 (preenche o container)   │  │
│  └───────────────────────────────────┘  │
│  Indicadores/Controles (z-index: 10)    │
└─────────────────────────────────────────┘
```

**Código proposto:**

```tsx
// Container com altura fixa
<div className="relative min-h-[300px] md:min-h-[400px]">
  {/* Anúncio atual - posição absoluta para não afetar layout */}
  <div 
    className={`absolute inset-0 transition-opacity duration-500 ${
      isTransitioning ? 'opacity-0' : 'opacity-100'
    }`}
  >
    {renderAnuncio(currentAnuncio)}
  </div>
</div>
```

**Ajustes nos tipos de anúncio:**

```tsx
// banner_principal - ajustar altura mobile
<div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">

// card_secundario - garantir altura mínima
<Card className="h-full min-h-[300px] overflow-hidden">
  <div className="grid md:grid-cols-2 gap-0 h-full">
    <div className="relative h-[180px] md:h-auto">

// full_width - manter como está (300px)
<div className="relative h-[300px] rounded-xl overflow-hidden">
```

### Benefícios

1. **Zero layout shift** - A página não vai mais "pular"
2. **Melhor CLS** (Cumulative Layout Shift) - Métrica Core Web Vitals
3. **Experiência mobile suave** - Transições apenas visuais, sem movimento de scroll
4. **Compatível com todos os tipos** de anúncios
