

# Melhorar Performance com Lazy Loading de Imagens

## Problema Atual

Analisando o codigo, encontrei que **varios componentes carregam imagens sem `loading="lazy"`**, o que significa que o navegador baixa todas as imagens de uma vez, mesmo as que estao fora da tela. Isso impacta:

- Tempo de carregamento inicial da pagina
- Consumo de banda (egress do Supabase)
- Performance no mobile

### Componentes sem lazy loading:
- **RanchCard** - imagem principal do rancho
- **BlogCard** - imagem do post
- **ImageGallery** - thumbnails e imagem principal
- **TestimonialsSection** - fotos dos depoimentos
- **AnunciosSection** - imagens dos anuncios

### Componentes que ja tem:
- PackageCard, FeaturedPackagesCarousel, PaidMediaBannerDisplay

---

## Solucao

### 1. Criar componente `OptimizedImage` reutilizavel

Um componente centralizado que aplica automaticamente:
- `loading="lazy"` em imagens fora do viewport
- Placeholder com skeleton enquanto carrega
- Tratamento de erro com fallback gradiente
- Transicao suave (fade-in) ao carregar

Arquivo: `src/components/ui/optimized-image.tsx`

### 2. Aplicar lazy loading nos componentes existentes

Atualizar os seguintes componentes para usar `loading="lazy"` ou o novo `OptimizedImage`:

| Componente | Mudanca |
|-----------|---------|
| RanchCard | Adicionar `loading="lazy"` na img |
| BlogCard | Adicionar `loading="lazy"` na img |
| ImageGallery | `loading="lazy"` nas thumbnails |
| TestimonialsSection | `loading="lazy"` nos avatares |
| AnunciosSection | `loading="lazy"` nas imagens |

### 3. Lazy load de secoes na pagina Index

Usar `React.lazy` + `Suspense` para carregar sob demanda as secoes que ficam abaixo da dobra (below the fold):

- DamInfo, LunarCalendar, WeatherDashboard
- BlogSection, TestimonialsSection, FAQSection

O HeroSection, Header e RanchosSection continuam carregando normalmente por estarem visiveis logo no inicio.

### 4. Preconnect para o Supabase Storage

Adicionar tag `<link rel="preconnect">` no `index.html` apontando para o dominio do Supabase Storage, para que o navegador inicie a conexao antes de precisar das imagens.

---

## Secao Tecnica

### Componente OptimizedImage

```text
Props:
- src: string
- alt: string
- className?: string
- loading?: 'lazy' | 'eager' (default: 'lazy')
- fallbackClassName?: string

Comportamento:
1. Renderiza Skeleton enquanto imagem carrega
2. Ao carregar (onLoad), faz fade-in com opacity transition
3. Ao falhar (onError), mostra div gradiente como fallback
```

### Lazy sections no Index.tsx

```text
const LazyDamInfo = React.lazy(() => import('@/components/DamInfo'));
const LazyLunarCalendar = React.lazy(() => import('@/components/LunarCalendar'));
const LazyWeatherDashboard = React.lazy(() => import('@/components/WeatherDashboard'));
const LazyBlogSection = React.lazy(() => import('@/components/BlogSection'));
const LazyTestimonialsSection = React.lazy(...)
const LazyFAQSection = React.lazy(...)

Cada um envolto em <Suspense fallback={<Skeleton />}>
```

### Preconnect

Adicionar no `index.html`:
```text
<link rel="preconnect" href="https://zeqloqlhnbdeivnyghkx.supabase.co" />
<link rel="dns-prefetch" href="https://zeqloqlhnbdeivnyghkx.supabase.co" />
```

### Arquivos modificados

1. **Novo**: `src/components/ui/optimized-image.tsx`
2. **Editar**: `src/components/RanchCard.tsx` - adicionar loading="lazy"
3. **Editar**: `src/components/BlogCard.tsx` - adicionar loading="lazy"
4. **Editar**: `src/components/ImageGallery.tsx` - loading="lazy" nas thumbnails
5. **Editar**: `src/components/AnunciosSection.tsx` - loading="lazy"
6. **Editar**: `src/pages/Index.tsx` - React.lazy para secoes below-fold
7. **Editar**: `index.html` - preconnect tags

### Impacto esperado

- Reducao de 40-60% no carregamento inicial de imagens
- Menor consumo de egress (imagens so baixam quando necessario)
- Melhor LCP (Largest Contentful Paint) e CLS (Cumulative Layout Shift)
- Bundles menores para o carregamento inicial da home
