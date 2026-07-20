import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useInvalidateCache } from './useOptimizedData';

/**
 * Hook global para Supabase Realtime (Fase 8 - PDR)
 * Ouve eventos de INSERT, UPDATE e DELETE no banco de dados e invalida
 * a cache do React Query instantaneamente para atualizar a interface sem F5.
 */
export const useSupabaseRealtime = () => {
  const {
    invalidateRanchos,
    invalidatePacotes,
    invalidatePropriedadesVenda,
    invalidateAnuncios,
    invalidateBlog,
    invalidateDepoimentos,
    invalidateDashboard,
    invalidateAll,
  } = useInvalidateCache();

  useEffect(() => {
    console.log('[Supabase Realtime 📡] Conectando canais em tempo real...');

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ranchos' },
        (payload) => {
          console.log('[Realtime ⚡] Mudança detectada na tabela ranchos:', payload.eventType);
          invalidateRanchos();
          invalidateDashboard();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pacotes' },
        (payload) => {
          console.log('[Realtime ⚡] Mudança detectada na tabela pacotes:', payload.eventType);
          invalidatePacotes();
          invalidateDashboard();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'propriedades_venda' },
        (payload) => {
          console.log('[Realtime ⚡] Mudança detectada na tabela propriedades_venda:', payload.eventType);
          invalidatePropriedadesVenda();
          invalidateDashboard();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'anuncios' },
        (payload) => {
          console.log('[Realtime ⚡] Mudança detectada na tabela anuncios:', payload.eventType);
          invalidateAnuncios();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blog_posts' },
        (payload) => {
          console.log('[Realtime ⚡] Mudança detectada na tabela blog_posts:', payload.eventType);
          invalidateBlog();
          invalidateDashboard();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'depoimentos' },
        (payload) => {
          console.log('[Realtime ⚡] Mudança detectada na tabela depoimentos:', payload.eventType);
          invalidateDepoimentos();
          invalidateDashboard();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        () => {
          console.log('[Realtime ⚡] Mudança em site_settings');
          invalidateAll();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Supabase Realtime ✅] Inscrito com sucesso em todos os canais.');
        }
      });

    return () => {
      console.log('[Supabase Realtime 🔌] Desconectando canais...');
      supabase.removeChannel(channel);
    };
  }, [
    invalidateRanchos,
    invalidatePacotes,
    invalidatePropriedadesVenda,
    invalidateAnuncios,
    invalidateBlog,
    invalidateDepoimentos,
    invalidateDashboard,
    invalidateAll,
  ]);
};
