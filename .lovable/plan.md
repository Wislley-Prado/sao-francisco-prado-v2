

## Plano: Corrigir Layout dos Anúncios no Mobile

### Problemas Identificados

**1. Layout Mobile Cortado (`card_secundario`)**

O problema está na estrutura do card secundário:
- Container tem `min-h-[320px]` 
- Imagem usa `h-[200px]` (fixo)
- Sobra apenas ~120px para o conteúdo (título, descrição, badges, botão)
- Resultado: botão de ação e informações ficam cortados

**2. Painel Admin - Tipos Funcionando**

Verifiquei o banco de dados e os tipos estão sendo salvos corretamente:
- `card_secundario` - 6 anúncios
- `full_width` - 1 anúncio

O painel está funcionando. Se algo não aparece, pode ser um problema de cache do navegador ou filtro de posição.

---

### Solução Proposta

**Arquivo: `src/components/AnunciosSection.tsx`**

#### Mudanças para `card_secundario` (mobile):

1. **Aumentar altura do container mobile**: `min-h-[380px]` -> `min-h-[420px]`
2. **Reduzir altura da imagem mobile**: `h-[200px]` -> `h-[140px]`
3. **Adicionar scroll interno se necessário**: `overflow-y-auto` no conteúdo
4. **Proteger área do botão**: padding-bottom maior para não sobrepor pontos de navegação

#### Mudanças para `banner_principal` e `full_width` (mobile):

5. **Aumentar padding inferior**: `pb-16` para dar espaço aos pontos de navegação
6. **Limitar linha de texto**: `line-clamp-2` para título mobile

---

### Detalhes Técnicos

**Antes (card_secundario - linha 272-275):**
```tsx
<Card className="h-full min-h-[320px] md:min-h-[420px] ...">
  <div className="flex flex-col md:grid md:grid-cols-2 gap-0 h-full">
    <div className="relative h-[200px] md:h-full ...">
```

**Depois:**
```tsx
<Card className="h-full min-h-[420px] md:min-h-[420px] ...">
  <div className="flex flex-col md:grid md:grid-cols-2 gap-0 h-full">
    <div className="relative h-[140px] md:h-full ...">
```

**Antes (conteúdo - linha 297):**
```tsx
<CardContent className="p-5 md:p-6 lg:p-8 flex flex-col justify-center flex-1 space-y-3 md:space-y-4">
```

**Depois:**
```tsx
<CardContent className="p-4 md:p-6 lg:p-8 flex flex-col justify-start flex-1 space-y-2 md:space-y-4 pb-6">
```

**Ajuste nos banners (linha 233):**
```tsx
<div className="absolute bottom-0 left-0 right-0 p-5 pb-14 md:p-10 lg:p-12">
```

---

### Container Principal (linha 415)

Ajustar para altura mínima maior:
```tsx
<div className="relative min-h-[380px] md:min-h-[400px] group">
```

---

### Resultado Esperado

- Botão de ação sempre visível no mobile
- Título e descrição legíveis sem cortes
- Pontos de navegação não sobrepõem conteúdo
- Layout consistente entre tipos de anúncio
- Informações de imóvel (preço, área, localização) visíveis

