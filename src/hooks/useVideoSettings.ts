import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface VideoSettings {
  youtube_live_url: string | null;
  youtube_video_url: string | null;
  youtube_institucional_url: string | null;
}

export const useVideoSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['video-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings_public')
        .select('youtube_live_url, youtube_video_url, youtube_institucional_url')
        .maybeSingle();

      if (error) throw error;
      return data as VideoSettings;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<VideoSettings>) => {
      const { error } = await supabase
        .from('site_settings')
        .update(newSettings)
        .eq('id', (await supabase.from('site_settings').select('id').single()).data?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-settings'] });
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
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\/\s]+)/,
    /youtube\.com\/shorts\/([^&?\/\s]+)/,
    /youtube\.com\/live\/([^&?\/\s]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

export const isValidYouTubeUrl = (url: string): boolean => {
  if (!url) return true; // Empty is valid (optional field)
  return extractYouTubeId(url) !== null;
};
