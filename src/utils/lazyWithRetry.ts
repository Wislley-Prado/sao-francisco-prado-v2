import React, { ComponentType } from 'react';

/**
 * Utilitário para envolver React.lazy com retry automático e recarregamento limpo.
 * Quando um novo deploy ocorre, chunks JS velhos no servidor deixam de existir (404),
 * fazendo o import() dinâmico falhar. Este utilitário captura a exceção, desregistra
 * o Service Worker, limpa o CacheStorage e recarrega a página 1 vez para buscar o novo index.html.
 */
function getSessionItem(key: string): string | null {
  try {
    return typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function setSessionItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(key, value);
    }
  } catch {}
}

function removeSessionItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem(key);
    }
  } catch {}
}

export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    let pageHasBeenRefreshed = false;
    try {
      pageHasBeenRefreshed = JSON.parse(getSessionItem('retry-lazy-refreshed') || 'false');
    } catch {
      pageHasBeenRefreshed = false;
    }

    try {
      const component = await componentImport();
      setSessionItem('retry-lazy-refreshed', 'false');
      return component;
    } catch (error) {
      console.error('Erro ao carregar componente dinâmico (chunk 404):', error);

      if (!pageHasBeenRefreshed) {
        setSessionItem('retry-lazy-refreshed', 'true');

        // Limpar Service Worker e Caches se disponíveis
        if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
          try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
              await registration.unregister();
            }
          } catch (swError) {
            console.error('Erro ao desregistrar SW:', swError);
          }
        }

        if (typeof window !== 'undefined' && 'caches' in window) {
          try {
            const keys = await caches.keys();
            await Promise.all(keys.map((key) => caches.delete(key)));
          } catch (cacheError) {
            console.error('Erro ao limpar CacheStorage:', cacheError);
          }
        }

        // Recarregar do servidor
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
        return new Promise<{ default: T }>(() => {});
      }

      removeSessionItem('retry-lazy-refreshed');
      throw error;
    }
  });
}
