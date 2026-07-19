import React, { ComponentType } from 'react';

/**
 * Utilitário para envolver React.lazy com retry automático e recarregamento limpo.
 * Quando um novo deploy ocorre, chunks JS velhos no servidor deixam de existir (404),
 * fazendo o import() dinâmico falhar. Este utilitário captura a exceção, desregistra
 * o Service Worker, limpa o CacheStorage e recarrega a página 1 vez para buscar o novo index.html.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    const pageHasBeenRefreshed = JSON.parse(
      window.sessionStorage.getItem('retry-lazy-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('retry-lazy-refreshed', 'false');
      return component;
    } catch (error) {
      console.error('Erro ao carregar componente dinâmico (chunk 404):', error);

      if (!pageHasBeenRefreshed) {
        window.sessionStorage.setItem('retry-lazy-refreshed', 'true');

        // Limpar Service Worker e Caches se disponíveis
        if ('serviceWorker' in navigator) {
          try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
              await registration.unregister();
            }
          } catch (swError) {
            console.error('Erro ao desregistrar SW:', swError);
          }
        }

        if ('caches' in window) {
          try {
            const keys = await caches.keys();
            await Promise.all(keys.map((key) => caches.delete(key)));
          } catch (cacheError) {
            console.error('Erro ao limpar CacheStorage:', cacheError);
          }
        }

        // Recarregar do servidor
        window.location.reload();
      }

      throw error;
    }
  });
}
