

## Diagnóstico: Imagens renderizando lentamente

### Problemas identificados

1. **Nenhuma imagem usa `fetchpriority="high"`** — a imagem do Hero (thumbnail do YouTube) e imagens above-the-fold carregam sem prioridade, competindo com outros recursos.

2. **Todas as imagens de Supabase Storage não têm parâmetros de transformação** — imagens originais (potencialmente 2-5MB) são servidas sem redimensionamento. Supabase Storage suporta `?width=X&quality=Y` para servir versões otimizadas automaticamente.

3. **`OptimizedImage` component existe mas não é usado** — os componentes `RanchCard`, `BlogCard`, `PackageCard`, `AnunciosSection` e `ImageGallery` todos usam `<img>` direto, sem o componente de fallback/skeleton.

4. **Imagens no `RanchCard` e `PackageCard` não têm `width`/`height`** — isso causa layout shift (CLS) e o browser não pode reservar espaço.

5. **`ImageGallery` principal carrega imagem sem `loading="eager"`** — a imagem principal da galeria deveria ser eager.

### Plano de correção

| # | Arquivo | Ação |
|---|---------|------|
| 1 | `src/lib/imageUtils.ts` | Criar helper `getOptimizedUrl(url, width, quality)` que adiciona `?width=X&quality=Y` a URLs do Supabase Storage |
| 2 | `src/components/RanchCard.tsx` | Usar `getOptimizedUrl(url, 400)` na imagem, adicionar `width`/`height` |
| 3 | `src/components/PackageCard.tsx` | Usar `getOptimizedUrl(url, 400)` na imagem, adicionar `width`/`height` |
| 4 | `src/components/BlogCard.tsx` | Usar `getOptimizedUrl(url, 400)` na imagem |
| 5 | `src/components/AnunciosSection.tsx` | Usar `getOptimizedUrl(url, 800)` nos banners |
| 6 | `src/components/HeroSection.tsx` | Adicionar `fetchPriority="high"` à thumbnail do YouTube |
| 7 | `src/components/ImageGallery.tsx` | Imagem principal com `loading="eager"` e `fetchPriority="high"`; thumbnails com `getOptimizedUrl(url, 120)` |
| 8 | `src/components/packages/PackageGallery.tsx` | Primeiras 6 imagens com `getOptimizedUrl(url, 600)`, restantes com `getOptimizedUrl(url, 400)` |
| 9 | `src/components/FeaturedPackagesCarousel.tsx` | Usar `getOptimizedUrl(url, 400)` |

### Helper `getOptimizedUrl`

```typescript
export const getOptimizedUrl = (url: string, width: number, quality = 80): string => {
  if (!url || !url.includes('supabase.co/storage')) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}width=${width}&quality=${quality}`;
};
```

Isso reduz o tamanho das imagens servidas em ~70-80% sem perda visual, acelerando significativamente o carregamento.

