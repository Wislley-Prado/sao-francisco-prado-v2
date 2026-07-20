/**
 * CacheService - Sistema de cache persistente com localStorage
 * USADO APENAS PARA: configurações, tema, preferências, menus e imagens estáticas.
 * NUNCA PARA DADOS DO BANCO (Ranchos, Blog, Pacotes, Agenda, Reservas, Usuários, Financeiro, etc.).
 */

// TTL configs em milliseconds (0 = sempre tempo real do banco de dados)
export const TTL = {
  // Dados estáticos, imagens e assets - 24 horas
  STATIC: 24 * 60 * 60 * 1000,
  // Tema do sistema - 24 horas
  THEME: 24 * 60 * 60 * 1000,
  // Preferências do usuário - 24 horas
  PREFERENCES: 24 * 60 * 60 * 1000,
  // Menus e navegação - 24 horas
  MENUS: 24 * 60 * 60 * 1000,
  // Configurações do site - 0 segundos (tempo real)
  SETTINGS: 0,
  // Dados do banco: SEMPRE 0 segundos (nunca cacheados em localStorage/cacheService)
  SEMI_DYNAMIC: 0,
  DYNAMIC: 0,
  LISTS: 0,
  ADMIN_STATS: 0,
} as const;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

interface CacheStats {
  hits: number;
  misses: number;
  supabaseCalls: number;
}

// Storage key prefix (versão 6 com invalidação total de caches anteriores de dados do banco)
const CACHE_VERSION = 'v6';
const CACHE_PREFIX = `prado_cache_${CACHE_VERSION}_`;
const STATS_KEY = 'prado_cache_stats';

// Limpar qualquer cache no localStorage no carregamento do módulo
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      // Remove todos os caches antigos do prado_cache (inclusive versões antigas com dados do banco)
      if (key && key.startsWith('prado_cache_') && !key.startsWith(CACHE_PREFIX) && key !== STATS_KEY) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // Ignora erros de localStorage
  }
}

// In-memory cache for faster access
const memoryCache = new Map<string, CacheEntry<unknown>>();

// Stats tracking
let stats: CacheStats = { hits: 0, misses: 0, supabaseCalls: 0 };

// Load stats from localStorage
const loadStats = (): CacheStats => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return { hits: 0, misses: 0, supabaseCalls: 0 };
};

// Save stats to localStorage (debounced to avoid thread blocking during page navigation)
let saveStatsTimeout: ReturnType<typeof setTimeout> | null = null;
const saveStats = (): void => {
  if (saveStatsTimeout) return;
  saveStatsTimeout = setTimeout(() => {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {
      // Ignore storage errors
    }
    saveStatsTimeout = null;
  }, 2000);
};

// Initialize stats on load
stats = loadStats();

/**
 * Padrões de chaves de banco de dados que NUNCA devem ser salvas em cacheService
 */
const DB_DATA_PATTERNS = [
  'ranchos',
  'rancho',
  'blog',
  'pacotes',
  'pacote',
  'agenda',
  'reservas',
  'reserva',
  'usuarios',
  'usuario',
  'users',
  'user',
  'financeiro',
  'vendas',
  'propriedades',
  'anuncios',
  'anuncio',
  'depoimentos',
  'depoimento',
  'faqs',
  'faq',
  'stats',
  'dashboard',
  'analytics'
];

const isDatabaseDataKey = (key: string): boolean => {
  const lowerKey = key.toLowerCase();
  return DB_DATA_PATTERNS.some((pattern) => lowerKey.includes(pattern));
};

/**
 * Log cache event with emoji indicators
 */
export const logCacheEvent = (
  _type: 'HIT' | 'MISS' | 'SUPABASE' | 'SET' | 'EXPIRE',
  _key: string,
  _details?: string
): void => {
  // Logs only in development to avoid mobile jank
  if (!import.meta.env.DEV) return;
  const emoji = { HIT: '✅', MISS: '❌', SUPABASE: '🌐', SET: '💾', EXPIRE: '⏰' };
  console.log(`[Cache ${emoji[_type]}] ${_type} | ${_key}${_details ? ` | ${_details}` : ''}`);
};

/**
 * Get item from cache (memory first, then localStorage)
 * Retorna null para qualquer chave de dados do banco de dados.
 */
export const getFromCache = <T>(key: string): T | null => {
  if (isDatabaseDataKey(key)) {
    return null;
  }

  const fullKey = CACHE_PREFIX + key;
  
  // Try memory cache first (faster)
  const memEntry = memoryCache.get(fullKey) as CacheEntry<T> | undefined;
  if (memEntry) {
    const now = Date.now();
    if (now - memEntry.timestamp < memEntry.ttl) {
      stats.hits++;
      saveStats();
      logCacheEvent('HIT', key, 'from memory');
      return memEntry.data;
    } else {
      // Expired in memory
      memoryCache.delete(fullKey);
      logCacheEvent('EXPIRE', key, 'memory cache expired');
    }
  }
  
  // Try localStorage
  try {
    const stored = localStorage.getItem(fullKey);
    if (stored) {
      const entry: CacheEntry<T> = JSON.parse(stored);
      const now = Date.now();
      
      if (now - entry.timestamp < entry.ttl) {
        // Valid cache - also store in memory for faster access
        memoryCache.set(fullKey, entry);
        stats.hits++;
        saveStats();
        logCacheEvent('HIT', key, 'from localStorage');
        return entry.data;
      } else {
        // Expired - remove from storage
        localStorage.removeItem(fullKey);
        logCacheEvent('EXPIRE', key, 'localStorage cache expired');
      }
    }
  } catch {
    // Ignore parse/storage errors
  }
  
  stats.misses++;
  saveStats();
  logCacheEvent('MISS', key);
  return null;
};

/**
 * Set item in cache (both memory and localStorage)
 * Bloqueado para dados do banco de dados.
 */
export const setInCache = <T>(key: string, data: T, ttl: number): void => {
  if (isDatabaseDataKey(key) || ttl <= 0) {
    return;
  }

  const fullKey = CACHE_PREFIX + key;
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    ttl,
    key,
  };
  
  // Store in memory
  memoryCache.set(fullKey, entry);
  
  // Store in localStorage
  try {
    localStorage.setItem(fullKey, JSON.stringify(entry));
    logCacheEvent('SET', key, `TTL: ${Math.round(ttl / 1000 / 60)}min`);
  } catch {
    // localStorage might be full - clear old entries
    clearOldCacheEntries();
    try {
      localStorage.setItem(fullKey, JSON.stringify(entry));
    } catch {
      if (import.meta.env.DEV) console.warn('[Cache] localStorage full, using memory only');
    }
  }
};

/**
 * Record a Supabase call for stats
 */
export const recordSupabaseCall = (key: string): void => {
  stats.supabaseCalls++;
  saveStats();
  logCacheEvent('SUPABASE', key, 'API call made');
};

/**
 * Invalidate cache for a specific key
 */
export const invalidateCache = (key: string): void => {
  const fullKey = CACHE_PREFIX + key;
  memoryCache.delete(fullKey);
  try {
    localStorage.removeItem(fullKey);
  } catch {
    // Ignore errors
  }
  if (import.meta.env.DEV) console.log(`[Cache 🗑️] Invalidated: ${key}`);
};

/**
 * Invalidate cache by prefix pattern
 */
export const invalidateCacheByPrefix = (prefix: string): void => {
  const fullPrefix = CACHE_PREFIX + prefix;
  
  // Clear from memory
  for (const key of memoryCache.keys()) {
    if (key.startsWith(fullPrefix)) {
      memoryCache.delete(key);
    }
  }
  
  // Clear from localStorage
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith(fullPrefix)) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // Ignore errors
  }
  if (import.meta.env.DEV) console.log(`[Cache 🗑️] Invalidated all: ${prefix}*`);
};

/**
 * Invalidate cache by tag/entity (e.g. 'auth', 'user_role', 'theme', 'settings')
 */
export const invalidateByTag = (tag: string): void => {
  invalidateCacheByPrefix(tag);
};

/**
 * Clear old cache entries when storage is full
 */
const clearOldCacheEntries = (): void => {
  try {
    const now = Date.now();
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_PREFIX)) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const entry: CacheEntry<unknown> = JSON.parse(stored);
            // Remove if expired or older than 24 hours
            if (now - entry.timestamp > entry.ttl || now - entry.timestamp > 24 * 60 * 60 * 1000) {
              localStorage.removeItem(key);
            }
          }
        } catch {
          // Remove invalid entries
          localStorage.removeItem(key);
        }
      }
    }
  } catch {
    // Ignore errors
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = (): CacheStats & { hitRate: string; savings: string } => {
  const total = stats.hits + stats.misses;
  const hitRate = total > 0 ? ((stats.hits / total) * 100).toFixed(1) : '0';
  const savings = stats.supabaseCalls > 0 
    ? ((stats.hits / (stats.hits + stats.supabaseCalls)) * 100).toFixed(1) 
    : '0';
  
  return {
    ...stats,
    hitRate: `${hitRate}%`,
    savings: `${savings}% saved`,
  };
};

/**
 * Reset cache statistics
 */
export const resetCacheStats = (): void => {
  stats = { hits: 0, misses: 0, supabaseCalls: 0 };
  saveStats();
  if (import.meta.env.DEV) console.log('[Cache 📊] Stats reset');
};

/**
 * Clear all cache
 */
export const clearAllCache = (): void => {
  memoryCache.clear();
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // Ignore errors
  }
  if (import.meta.env.DEV) console.log('[Cache 🧹] All cache cleared');
};

/**
 * Wrapper function for cached queries (APENAS PARA CONFIGURAÇÕES, TEMAS, MENUS E IMAGENS ESTÁTICAS)
 * Se a chave pertencer a dados do banco de dados (Ranchos, Blog, Pacotes, Agenda, Reservas, etc.),
 * a busca é feita diretamente no Supabase sem armazenamento no cacheService.
 */
export const cachedQuery = async <T>(
  key: string,
  ttl: number,
  fetchFn: () => Promise<T>
): Promise<T> => {
  // Dados do banco de dados ou TTL <= 0: nunca guardar em cacheService, buscar direto do banco
  if (ttl <= 0 || isDatabaseDataKey(key)) {
    recordSupabaseCall(key);
    return await fetchFn();
  }

  // Check cache first
  const cached = getFromCache<T>(key);
  if (cached !== null) {
    return cached;
  }
  
  // Fetch from Supabase
  recordSupabaseCall(key);
  const data = await fetchFn();
  
  // Store in cache
  setInCache(key, data, ttl);
  
  return data;
};

// Export a console command for debugging
if (typeof window !== 'undefined') {
  (window as unknown as { pradoCache: object }).pradoCache = {
    stats: getCacheStats,
    reset: resetCacheStats,
    clear: clearAllCache,
    invalidate: invalidateCache,
  };
  if (import.meta.env.DEV) console.log('[Cache 🚀] Cache system initialized. Direct DB queries bypass custom cache.');
}

