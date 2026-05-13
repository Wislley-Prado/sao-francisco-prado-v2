import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSiteSettings } from '@/hooks/useOptimizedData';
import { invalidateCache } from '@/lib/cacheService';

export interface VideoSettings {
  youtube_live_url: string | null;
  youtube_video_url: string | null;
  youtube_institucional_url: string | null;
}

/**
 * useVideoSettings - Reutiliza dados de useSiteSettings (elimina query duplicada)
 */
export const useVideoSettings = () => {
  const queryClient = useQueryClient();
  const { data: siteSettings, isLoading } = useSiteSettings(true);

  // Extrair video settings dos site settings já carregados
  const settings: VideoSettings | null = useMemo(() => {
    return siteSettings ? {
      youtube_live_url: siteSettings.youtube_live_url || null,
      youtube_video_url: siteSettings.youtube_video_url || null,
      youtube_institucional_url: siteSettings.youtube_institucional_url || null,
    } : null;
  }, [siteSettings]);

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<VideoSettings>) => {
      // Usar o ID do siteSettings se disponível, ou o ID padrão do projeto como fallback
      const SETTINGS_ID = '00000000-0000-0000-0000-000000000001';
      const settingsId = siteSettings?.id || SETTINGS_ID;

      console.log('Atualizando configurações com ID:', settingsId);

      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: settingsId,
          ...newSettings,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao salvar no banco de dados:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalida ambos os caches (publico e admin)
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      queryClient.invalidateQueries({ queryKey: ['video-settings'] });
      invalidateCache('site_settings');
      invalidateCache('site_settings_admin');
      toast.success('Configurações de vídeo atualizadas com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar configurações:', error);
      toast.error('Erro ao atualizar configurações de vídeo');
    },
  });


  return {
    settings,
    isLoading,
    updateSettings: updateSettings.mutate,
    isUpdating: updateSettings.isPending,
  };
};

export const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;

  // Pattern robusto para capturar ID de vídeo do YouTube em diversos formatos
  // Suporta: watch?v=, shorts/, live/, embed/, v/, e links encurtados youtu.be/
  const patterns = [
    /(?:v=|v\/|embed\/|shorts\/|live\/|^|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};


export const isValidYouTubeUrl = (url: string): boolean => {
  if (!url) return true;
  return extractYouTubeId(url) !== null;
};
