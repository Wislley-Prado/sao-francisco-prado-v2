/**
 * Captura Global de Erros do Sistema (Fase 1 - PDR)
 * Intercepta window.onerror, window.onunhandledrejection e erros de Chunk (ChunkLoadError)
 */

import { logger } from './logger';

export interface LogPayload {
  message: string;
  stack?: string;
  page: string;
  browser: string;
  timestamp: string;
  chunkFailed?: boolean;
  errorCode?: string;
}

const CHUNK_RETRY_KEY = 'prado_chunk_retry_attempts';

/**
 * Verifica se a mensagem de erro é associada a falha de carregamento de módulo/chunk.
 */
export function isChunkLoadError(error: unknown | string): boolean {
  if (!error) return false;
  const errorString = typeof error === 'string' ? error : (error as Error).message || (error as Error).name || String(error);
  return (
    errorString.includes('ChunkLoadError') ||
    errorString.includes('Failed to fetch dynamically imported module') ||
    errorString.includes('Loading chunk failed') ||
    errorString.includes('Importing a module script failed') ||
    errorString.includes('error loading dynamically imported module')
  );
}

/**
 * Limpa todos os caches (Service Worker, CacheStorage, localStorage de cache) e recarrega.
 */
export async function clearAppCachesAndReload(): Promise<void> {
  try {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.unregister();
      }
    }

    if (typeof window !== 'undefined' && 'caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('prado_cache') || key.startsWith('workbox'))) {
          localStorage.removeItem(key);
        }
      }
    }

    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem(CHUNK_RETRY_KEY);
      sessionStorage.clear();
    }
  } catch (e) {
    console.error('[GlobalError] Erro ao limpar caches:', e);
  }

  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

/**
 * Trata o erro de chunk recarregando a página no máximo 1 vez automaticamente.
 */
export async function handleChunkErrorAutoRetry(): Promise<boolean> {
  const attempts = Number(sessionStorage.getItem(CHUNK_RETRY_KEY) || '0');
  if (attempts < 1) {
    sessionStorage.setItem(CHUNK_RETRY_KEY, String(attempts + 1));
    logger.warn('chunk', 'Chunk load failed. Auto-clearing cache and refreshing...');
    await clearAppCachesAndReload();
    return true;
  }
  return false;
}

/**
 * Inicializa ouvintes globais de erro no navegador.
 */
export function initGlobalErrorHandlers(): void {
  if (typeof window === 'undefined') return;

  // Window OnError
  window.onerror = (message, source, lineno, colno, error) => {
    const errorMsg = typeof message === 'string' ? message : error?.message || 'Erro desconhecido';
    
    logger.error('console', `[window.onerror]: ${errorMsg}`, { source, lineno, colno }, error?.stack);

    if (isChunkLoadError(error || errorMsg)) {
      handleChunkErrorAutoRetry();
    }
  };

  // Window Unhandled Rejection (Promessas não tratadas)
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const errorMsg = typeof reason === 'object' && reason !== null ? reason.message || String(reason) : String(reason);
    
    logger.error('api', `[unhandledrejection]: ${errorMsg}`, { reason }, reason?.stack);

    if (isChunkLoadError(reason)) {
      event.preventDefault();
      handleChunkErrorAutoRetry();
    }
  });

  console.log('[GlobalError] Handlers globais de erros ativados.');
}
