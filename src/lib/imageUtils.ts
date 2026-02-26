/**
 * Otimiza URLs de imagens do Supabase Storage usando o endpoint de transformação.
 * O Supabase usa /render/image/ ao invés de /object/ para servir imagens transformadas.
 * Se a transformação não estiver disponível (plano free), retorna a URL original.
 */
export const getOptimizedUrl = (url: string, width: number, quality = 80): string => {
  if (!url) return url;
  
  // Só otimiza URLs do Supabase Storage
  if (!url.includes('supabase.co/storage')) return url;
  
  // Avoid adding duplicate params
  if (url.includes('width=') || url.includes('quality=')) return url;
  
  // Supabase image transformations require changing /object/ to /render/image/
  // URL format: https://xxx.supabase.co/storage/v1/object/public/bucket/file.jpg
  // Becomes:    https://xxx.supabase.co/storage/v1/render/image/public/bucket/file.jpg?width=400&quality=80
  const transformedUrl = url.replace(
    '/storage/v1/object/',
    '/storage/v1/render/image/'
  );
  
  const separator = transformedUrl.includes('?') ? '&' : '?';
  return `${transformedUrl}${separator}width=${width}&quality=${quality}`;
};

/**
 * Retorna a URL original (sem transformação) para uso como fallback.
 * Útil quando o plano não suporta transformações de imagem.
 */
export const getOriginalUrl = (url: string): string => {
  if (!url) return url;
  // Reverte /render/image/ para /object/ se necessário
  return url.replace('/storage/v1/render/image/', '/storage/v1/object/');
};
