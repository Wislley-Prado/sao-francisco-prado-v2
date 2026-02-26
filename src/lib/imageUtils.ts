/**
 * Otimiza URLs de imagens do Supabase Storage adicionando parâmetros de transformação.
 * Reduz o tamanho das imagens em ~70-80% sem perda visual perceptível.
 */
export const getOptimizedUrl = (url: string, width: number, quality = 80): string => {
  if (!url || !url.includes('supabase.co/storage')) return url;
  // Avoid adding duplicate params
  if (url.includes('width=') || url.includes('quality=')) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}width=${width}&quality=${quality}`;
};
