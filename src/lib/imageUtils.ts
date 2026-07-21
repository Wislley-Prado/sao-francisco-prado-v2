/**
 * Otimiza URLs de imagens do Supabase Storage usando o endpoint de transformação wsrv.nl.
 * Como a transformação nativa do Supabase não está disponível, usamos o proxy wsrv.nl
 * para reduzir a largura e converter para WebP on-the-fly.
 */
export const getOptimizedUrl = (url: string, width?: number, quality = 80): string => {
  if (!url) return '';
  const originalUrl = getOriginalUrl(url);

  // Se a URL for externa e tiver largura, usamos o proxy de imagens wsrv.nl
  if (width && (originalUrl.startsWith('http://') || originalUrl.startsWith('https://'))) {
    return `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}&w=${width}&q=${quality}&output=webp`;
  }

  return originalUrl;
};

/**
 * Retorna a URL original (sem transformação) para uso principal e fallback.
 * Substitui ativamente /render/image/ por /object/ caso a URL no banco tenha sido
 * salva com o caminho de renderização.
 */
export const getOriginalUrl = (url: string): string => {
  if (!url) return '';
  // Reverte /render/image/ para /object/ para evitar quebras
  const objectUrl = url.replace('/storage/v1/render/image/', '/storage/v1/object/');
  // Remove parâmetros de query (?width=...) que não são suportados pelo endpoint /object/ e podem causar erros
  return objectUrl.split('?')[0];
};
