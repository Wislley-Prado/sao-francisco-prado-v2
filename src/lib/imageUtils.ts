/**
 * Otimiza URLs de imagens do Supabase Storage usando o endpoint de transformação.
 * Como a transformação não está disponível no servidor atual (causando erros 403/400),
 * retornamos a URL original garantindo o uso do endpoint /object/.
 */
export const getOptimizedUrl = (url: string, width?: number, quality?: number): string => {
  return getOriginalUrl(url);
};

/**
 * Retorna a URL original (sem transformação) para uso principal e fallback.
 * Substitui ativamente /render/image/ por /object/ caso a URL no banco tenha sido
 * salva com o caminho de renderização.
 */
export const getOriginalUrl = (url: string): string => {
  if (!url) return url;
  // Reverte /render/image/ para /object/ para evitar quebras
  const objectUrl = url.replace('/storage/v1/render/image/', '/storage/v1/object/');
  // Remove parâmetros de query (?width=...) que não são suportados pelo endpoint /object/ e podem causar erros
  return objectUrl.split('?')[0];
};
