import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useInvalidateCache } from './useOptimizedData';

/**
 * Hook global para Supabase Realtime
 * Ouve eventos de INSERT, UPDATE e DELETE no banco de dados e invalida
 * as consultas do React Query instantaneamente para atualizar todas as abas sem F5.
 */
export const useSupabaseRealtime = () => {
  const queryClient = useQueryClient();
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
      .channel('public-db-realtime-changes')
      // 1. Invalidação global para qualquer alteração no schema public
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          console.log(`[Realtime ⚡] Mudança (${payload.eventType}) detectada na tabela: ${payload.table}`);
          
          // Invalida a query específica de acordo com a tabela
          switch (payload.table) {
            case 'ranchos':
            case 'rancho_imagens':
              invalidateRanchos();
              invalidateDashboard();
              break;
            case 'pacotes':
            case 'pacote_imagens':
              invalidatePacotes();
              invalidateDashboard();
              break;
            case 'propriedades_venda':
              invalidatePropriedadesVenda();
              invalidateDashboard();
              break;
            case 'anuncios':
              invalidateAnuncios();
              break;
            case 'blog_posts':
              invalidateBlog();
              invalidateDashboard();
              break;
            case 'depoimentos':
              invalidateDepoimentos();
              invalidateDashboard();
              break;
            case 'site_settings':
            case 'site_settings_public':
              invalidateAll();
              break;
            default:
              // Para qualquer outra tabela (agenda, reservas, usuarios, avaliacoes, faqs, etc.)
              queryClient.invalidateQueries();
              break;
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Supabase Realtime ✅] Inscrito com sucesso nos eventos do banco.');
        } else if (status === 'CHANNEL_ERROR') {
          console.warn('[Supabase Realtime ⚠️] Erro de canal ao tentar se inscrever.');
        }
      });

    return () => {
      console.log('[Supabase Realtime 🔌] Desconectando canais...');
      supabase.removeChannel(channel);
    };
  }, [
    queryClient,
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

