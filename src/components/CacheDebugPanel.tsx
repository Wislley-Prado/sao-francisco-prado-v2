/**
 * CacheDebugPanel - Painel de debug para monitorar cache
 * Mostra estatísticas de cache hits/misses e chamadas Supabase
 * 
 * Para usar: adicione <CacheDebugPanel /> em qualquer página (apenas em dev)
 */

import React, { useEffect, useState } from 'react';
import { getCacheStats, resetCacheStats, clearAllCache } from '@/lib/cacheService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Trash2, BarChart3, Database, Zap, Target } from 'lucide-react';

interface CacheStatsData {
  hits: number;
  misses: number;
  supabaseCalls: number;
  hitRate: string;
  savings: string;
}

export const CacheDebugPanel = () => {
  const [stats, setStats] = useState<CacheStatsData>({ 
    hits: 0, 
    misses: 0, 
    supabaseCalls: 0, 
    hitRate: '0%',
    savings: '0% saved'
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      setStats(getCacheStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = () => {
    resetCacheStats();
    setStats(getCacheStats());
  };

  const handleClear = () => {
    clearAllCache();
    setStats(getCacheStats());
  };

  // Toggle visibility with keyboard shortcut (Ctrl+Shift+C)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        setIsVisible(v => !v);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-colors"
        title="Mostrar painel de cache (Ctrl+Shift+C)"
      >
        <BarChart3 className="h-5 w-5" />
      </button>
    );
  }

  const totalRequests = stats.hits + stats.misses;
  const hitRateNum = totalRequests > 0 ? (stats.hits / totalRequests) * 100 : 0;

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-xl border-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="h-4 w-4" />
            Cache Monitor
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-green-50 dark:bg-green-950 rounded-lg p-2">
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <Zap className="h-3 w-3" />
              <span>Cache Hits</span>
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-300">{stats.hits}</div>
          </div>
          <div className="bg-red-50 dark:bg-red-950 rounded-lg p-2">
            <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
              <Target className="h-3 w-3" />
              <span>Cache Misses</span>
            </div>
            <div className="text-xl font-bold text-red-700 dark:text-red-300">{stats.misses}</div>
          </div>
        </div>

        {/* API Calls */}
        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-2 text-xs">
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <Database className="h-3 w-3" />
            <span>Supabase API Calls</span>
          </div>
          <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{stats.supabaseCalls}</div>
        </div>

        {/* Hit Rate Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Taxa de Cache</span>
            <Badge variant={hitRateNum >= 60 ? 'default' : 'secondary'}>
              {stats.hitRate}
            </Badge>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                hitRateNum >= 70 ? 'bg-green-500' : 
                hitRateNum >= 40 ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}
              style={{ width: `${hitRateNum}%` }}
            />
          </div>
        </div>

        {/* Savings */}
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            💰 Economia: {stats.savings}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleReset}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset Stats
          </Button>
          <Button variant="destructive" size="sm" className="flex-1 text-xs" onClick={handleClear}>
            <Trash2 className="h-3 w-3 mr-1" />
            Clear Cache
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground text-center">
          Ctrl+Shift+C para toggle | Console: window.pradoCache
        </p>
      </CardContent>
    </Card>
  );
};

export default CacheDebugPanel;
