/**
 * useOptimizedData - Hooks centralizados com cache persistente
 * Elimina queries duplicadas e reduz egress em 60-70%
 */

import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cachedQuery, TTL, invalidateCacheByPrefix } from '@/lib/cacheService';

// ============= TYPES =============

export interface RanchoWithImages {
  id: string;
  nome: string;
  nome_en?: string | null;
  slug: string;
  descricao: string;
  descricao_en?: string | null;
  localizacao: string;
  localizacao_en?: string | null;
  capacidade: number;
  preco: number;
  rating: number;
  quartos: number;
  banheiros: number;
  area: number | null;
  comodidades: string[];
  disponivel: boolean;
  destaque: boolean;
  telefone_whatsapp?: string;
  mensagem_whatsapp?: string;
  typebot_url?: string;
  texto_botao_whatsapp?: string;
  video_youtube?: string;
  google_calendar_url?: string;
  tracking_code?: string;
  latitude?: number;
  longitude?: number;
  endereco_completo?: string;
  imagens: Array<{
    id: string;
    url: string;
    alt_text?: string;
    principal: boolean;
    ordem: number;
  }>;
}

export interface PacoteWithImages {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  preco: number;
  duracao: string;
  pessoas: number;
  rating: number;
  tipo?: string;
  caracteristicas: string[];
  inclusos: string[];
  ativo: boolean;
  popular: boolean;
  destaque: boolean;
  parcelas_quantidade?: number;
  parcela_valor?: number;
  desconto_avista?: number;
  vagas_disponiveis?: number;
  video_youtube?: string;
  tracking_code?: string;
  telefone_whatsapp?: string;
  endereco_completo?: string;
  latitude?: number;
  longitude?: number;
  imagens: Array<{
    id: string;
    url: string;
    alt_text?: string;
    principal: boolean;
    ordem: number;
  }>;
}

export interface Anuncio {
  id: string;
  titulo: string;
  subtitulo?: string;
  descricao?: string;
  imagem_url: string;
  link_url?: string;
  texto_botao?: string;
  tipo: string;
  posicao: string;
  ativo: boolean;
  destaque: boolean;
  ordem: number;
  visualizacoes: number;
  cliques: number;
  duracao_exibicao: number;
  data_inicio?: string;
  data_fim?: string;
  imovel_preco?: number;
  imovel_area?: number;
  imovel_localizacao?: string;
  imovel_unidade_area?: string;
  custom_html?: string;
}

export interface BlogPost {
  id: string;
  titulo: string;
  slug: string;
  resumo?: string;
  conteudo: string;
  imagem_destaque?: string;
  categoria?: string;
  tags?: string[];
  publicado: boolean;
  data_publicacao?: string;
  visualizacoes: number;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  youtube_live_url?: string;
  youtube_video_url?: string;
  youtube_institucional_url?: string;
  facebook_pixel?: string;
  google_analytics?: string;
  google_tag_manager?: string;
  custom_head_scripts?: string;
  whatsapp_numero?: string;
  whatsapp_titulo?: string;
  whatsapp_mensagem_padrao?: string;
  whatsapp_saudacao?: string;
  whatsapp_instrucoes?: string;
  whatsapp_horario?: string;
  whatsapp_mensagens_rapidas?: Array<{ text: string; message: string }>;
  autor_avatar_url?: string;
  // Redes sociais
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  twitter_url?: string;
  // Contato
  telefone_contato?: string;
  email_contato?: string;
  // Footer e Header
  copyright_text?: string;
  reserva_button_link?: string;
}

export interface Depoimento {
  id: string;
  nome: string;
  cargo?: string;
  foto_url?: string;
  depoimento: string;
  rating: number;
  ativo: boolean;
  ordem: number;
}

export interface FAQ {
  id: string;
  pergunta: string;
  resposta: string;
  ativo: boolean;
  ordem: number;
  pacote_id?: string;
  rancho_id?: string;
}

export interface PropriedadeVenda {
  id: string;
  titulo: string;
  titulo_en: string | null;
  slug: string;
  descricao: string | null;
  descricao_en: string | null;
  tipo: string;
  localizacao: string;
  localizacao_en: string | null;
  preco: number;
  area: number | null;
  unidade_area: string | null;
  latitude: number | null;
  longitude: number | null;
  imagens: string[] | null;
  caracteristicas: string[] | null;
  telefone_contato: string | null;
  whatsapp_contato: string | null;
  video_youtube: string | null;
  texto_botao_whatsapp: string | null;
  mensagem_whatsapp: string | null;
  ativo: boolean;
  destaque: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

// ============= PROPRIEDADES VENDA =============

export const usePropriedadesVenda = (onlyActive = true) => {
  return useQuery(
    ['propriedades_venda', onlyActive ? 'active' : 'all'],
    async () => {
      let query = supabase
        .from('propriedades_venda')
        .select('id, titulo, titulo_en, slug, descricao, descricao_en, tipo, localizacao, localizacao_en, preco, area, unidade_area, latitude, longitude, imagens, caracteristicas, telefone_contato, whatsapp_contato, ativo, destaque, ordem, texto_botao_whatsapp, mensagem_whatsapp, video_youtube, created_at, updated_at')
        .order('destaque', { ascending: false })
        .order('ordem', { ascending: true })
        .order('created_at', { ascending: false });

      if (onlyActive) {
        query = query.eq('ativo', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(p => ({
        ...p,
        preco: Number(p.preco),
        area: p.area ? Number(p.area) : null,
        imagens: p.imagens || [],
        caracteristicas: p.caracteristicas || []
      }));
    },
    {
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    }
  );
};

export const usePropriedadeVendaBySlug = (slug: string | undefined) => {
  const { data: propriedades } = usePropriedadesVenda(false);

  return useQuery(
    ['propriedade_venda', slug],
    async () => {
      // First check if we already have it from the list
      if (propriedades) {
        const found = propriedades.find(p => p.slug === slug);
        if (found) return found;
      }

      // Fetch individually if not in list
      const { data, error } = await supabase
        .from('propriedades_venda')
        .select('id, titulo, titulo_en, slug, descricao, descricao_en, tipo, localizacao, localizacao_en, preco, area, unidade_area, latitude, longitude, imagens, caracteristicas, telefone_contato, whatsapp_contato, ativo, destaque, ordem, texto_botao_whatsapp, mensagem_whatsapp, video_youtube, created_at, updated_at')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        preco: Number(data.preco),
        area: data.area ? Number(data.area) : null,
        imagens: data.imagens || [],
        caracteristicas: data.caracteristicas || []
      };
    },
    {
      enabled: !!slug,
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    }
  );
};

// ============= RANCHOS =============

export const useRanchos = (onlyAvailable = true) => {
  return useQuery(
    ['ranchos', onlyAvailable ? 'available' : 'all'],
    async () => {
      let query = supabase
        .from('ranchos')
        .select(`
          id, nome, nome_en, slug, descricao, descricao_en, localizacao, localizacao_en, capacidade, preco, rating, quartos, banheiros, area, comodidades, disponivel, destaque, telefone_whatsapp, mensagem_whatsapp, typebot_url, texto_botao_whatsapp, video_youtube, google_calendar_url, tracking_code, latitude, longitude, endereco_completo, created_at,
          rancho_imagens!rancho_imagens_rancho_id_fkey (
            id, url, alt_text, principal, ordem
          )
        `)
        .order('destaque', { ascending: false })
        .order('created_at', { ascending: false });

      if (onlyAvailable) {
        query = query.eq('disponivel', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(rancho => ({
        id: rancho.id,
        nome: rancho.nome,
        nome_en: rancho.nome_en,
        slug: rancho.slug,
        descricao: rancho.descricao || '',
        descricao_en: rancho.descricao_en,
        localizacao: rancho.localizacao,
        localizacao_en: rancho.localizacao_en,
        capacidade: rancho.capacidade,
        preco: Number(rancho.preco),
        rating: Number(rancho.rating),
        quartos: rancho.quartos,
        banheiros: rancho.banheiros,
        area: rancho.area,
        comodidades: rancho.comodidades || [],
        disponivel: rancho.disponivel,
        destaque: rancho.destaque,
        telefone_whatsapp: rancho.telefone_whatsapp,
        mensagem_whatsapp: rancho.mensagem_whatsapp,
        typebot_url: rancho.typebot_url,
        texto_botao_whatsapp: rancho.texto_botao_whatsapp,
        video_youtube: rancho.video_youtube,
        google_calendar_url: rancho.google_calendar_url,
        tracking_code: rancho.tracking_code,
        latitude: rancho.latitude,
        longitude: rancho.longitude,
        endereco_completo: rancho.endereco_completo,
        imagens: (rancho.rancho_imagens || [])
          .sort((a: { ordem: number; principal: boolean }, b: { ordem: number; principal: boolean }) => {
            if (a.principal && !b.principal) return -1;
            if (!a.principal && b.principal) return 1;
            return a.ordem - b.ordem;
          })
          .map((img: { id: string; url: string; alt_text?: string; principal: boolean; ordem: number }) => ({
            id: img.id,
            url: img.url,
            alt_text: img.alt_text,
            principal: img.principal,
            ordem: img.ordem,
          })),
      }));
    },
    {
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    }
  );
};

export const useRanchoBySlug = (slug: string | undefined) => {
  const { data: ranchos } = useRanchos(false);

  return useQuery(
    ['rancho', slug],
    async () => {
      // First check if we already have it from the list
      if (ranchos) {
        const found = ranchos.find(r => r.slug === slug);
        if (found) return found;
      }

      // Fetch individually if not in list
      const { data, error } = await supabase
        .from('ranchos')
        .select(`
          id, nome, nome_en, slug, descricao, descricao_en, localizacao, localizacao_en, capacidade, preco, rating, quartos, banheiros, area, comodidades, disponivel, destaque, telefone_whatsapp, mensagem_whatsapp, typebot_url, texto_botao_whatsapp, video_youtube, google_calendar_url, tracking_code, latitude, longitude, endereco_completo, created_at,
          rancho_imagens!rancho_imagens_rancho_id_fkey (
            id, url, alt_text, principal, ordem
          )
        `)
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        nome: data.nome,
        nome_en: data.nome_en,
        slug: data.slug,
        descricao: data.descricao || '',
        descricao_en: data.descricao_en,
        localizacao: data.localizacao,
        localizacao_en: data.localizacao_en,
        capacidade: data.capacidade,
        preco: Number(data.preco),
        rating: Number(data.rating),
        quartos: data.quartos,
        banheiros: data.banheiros,
        area: data.area,
        comodidades: data.comodidades || [],
        disponivel: data.disponivel,
        destaque: data.destaque,
        telefone_whatsapp: data.telefone_whatsapp,
        mensagem_whatsapp: data.mensagem_whatsapp,
        typebot_url: data.typebot_url,
        texto_botao_whatsapp: data.texto_botao_whatsapp,
        video_youtube: data.video_youtube,
        google_calendar_url: data.google_calendar_url,
        tracking_code: data.tracking_code,
        latitude: data.latitude,
        longitude: data.longitude,
        endereco_completo: data.endereco_completo,
        imagens: (data.rancho_imagens || [])
          .sort((a: { ordem: number; principal: boolean }, b: { ordem: number; principal: boolean }) => {
            if (a.principal && !b.principal) return -1;
            if (!a.principal && b.principal) return 1;
            return a.ordem - b.ordem;
          })
          .map((img: { id: string; url: string; alt_text?: string; principal: boolean; ordem: number }) => ({
            id: img.id,
            url: img.url,
            alt_text: img.alt_text,
            principal: img.principal,
            ordem: img.ordem,
          })),
      };
    },
    {
      enabled: !!slug,
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    }
  );
};

// ============= PACOTES =============

export const usePacotes = (onlyActive = true) => {
  return useQuery(
    ['pacotes', onlyActive ? 'active' : 'all'],
    async () => {
      let query = supabase
        .from('pacotes')
        .select(`
          id, nome, slug, descricao, preco, duracao, pessoas, rating, tipo, caracteristicas, inclusos, ativo, popular, destaque, parcelas_quantidade, parcela_valor, desconto_avista, vagas_disponiveis, video_youtube, tracking_code, telefone_whatsapp, endereco_completo, latitude, longitude, created_at,
          pacote_imagens (
            id, url, alt_text, principal, ordem
          )
        `)
        .order('popular', { ascending: false })
        .order('preco', { ascending: true });

      if (onlyActive) {
        query = query.eq('ativo', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(pacote => ({
        id: pacote.id,
        nome: pacote.nome,
        slug: pacote.slug,
        descricao: pacote.descricao || '',
        preco: Number(pacote.preco),
        duracao: pacote.duracao,
        pessoas: pacote.pessoas,
        rating: Number(pacote.rating),
        tipo: pacote.tipo,
        caracteristicas: pacote.caracteristicas || [],
        inclusos: pacote.inclusos || [],
        ativo: pacote.ativo,
        popular: pacote.popular,
        destaque: pacote.destaque,
        parcelas_quantidade: pacote.parcelas_quantidade,
        parcela_valor: pacote.parcela_valor ? Number(pacote.parcela_valor) : undefined,
        desconto_avista: pacote.desconto_avista ? Number(pacote.desconto_avista) : undefined,
        vagas_disponiveis: pacote.vagas_disponiveis,
        video_youtube: pacote.video_youtube,
        tracking_code: pacote.tracking_code,
        telefone_whatsapp: pacote.telefone_whatsapp,
        endereco_completo: pacote.endereco_completo,
        latitude: pacote.latitude,
        longitude: pacote.longitude,
        imagens: (pacote.pacote_imagens || [])
          .sort((a: { ordem: number; principal: boolean }, b: { ordem: number; principal: boolean }) => {
            if (a.principal && !b.principal) return -1;
            if (!a.principal && b.principal) return 1;
            return a.ordem - b.ordem;
          })
          .map((img: { id: string; url: string; alt_text?: string; principal: boolean; ordem: number }) => ({
            id: img.id,
            url: img.url,
            alt_text: img.alt_text,
            principal: img.principal,
            ordem: img.ordem,
          })),
      }));
    },
    {
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    }
  );
};

export const usePacoteBySlug = (slug: string | undefined) => {
  const { data: pacotes } = usePacotes(false);

  return useQuery(
    ['pacote', slug],
    async () => {
      // First check if we already have it from the list
      if (pacotes) {
        const found = pacotes.find(p => p.slug === slug);
        if (found) return found;
      }

      // Fetch individually if not in list
      const { data, error } = await supabase
        .from('pacotes')
        .select(`
          id, nome, slug, descricao, preco, duracao, pessoas, rating, tipo, caracteristicas, inclusos, ativo, popular, destaque, parcelas_quantidade, parcela_valor, desconto_avista, vagas_disponiveis, video_youtube, tracking_code, telefone_whatsapp, endereco_completo, latitude, longitude, created_at,
          pacote_imagens (
            id, url, alt_text, principal, ordem
          )
        `)
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        nome: data.nome,
        slug: data.slug,
        descricao: data.descricao || '',
        preco: Number(data.preco),
        duracao: data.duracao,
        pessoas: data.pessoas,
        rating: Number(data.rating),
        tipo: data.tipo,
        caracteristicas: data.caracteristicas || [],
        inclusos: data.inclusos || [],
        ativo: data.ativo,
        popular: data.popular,
        destaque: data.destaque,
        parcelas_quantidade: data.parcelas_quantidade,
        parcela_valor: data.parcela_valor ? Number(data.parcela_valor) : undefined,
        desconto_avista: data.desconto_avista ? Number(data.desconto_avista) : undefined,
        vagas_disponiveis: data.vagas_disponiveis,
        video_youtube: data.video_youtube,
        tracking_code: data.tracking_code,
        telefone_whatsapp: data.telefone_whatsapp,
        endereco_completo: data.endereco_completo,
        latitude: data.latitude,
        longitude: data.longitude,
        imagens: (data.pacote_imagens || [])
          .sort((a: { ordem: number; principal: boolean }, b: { ordem: number; principal: boolean }) => {
            if (a.principal && !b.principal) return -1;
            if (!a.principal && b.principal) return 1;
            return a.ordem - b.ordem;
          })
          .map((img: { id: string; url: string; alt_text?: string; principal: boolean; ordem: number }) => ({
            id: img.id,
            url: img.url,
            alt_text: img.alt_text,
            principal: img.principal,
            ordem: img.ordem,
          })),
      };
    },
    {
      enabled: !!slug,
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    }
  );
};

// ============= ANÚNCIOS =============

/**
 * useAllAnuncios - Busca TODOS os anúncios ativos em 1 única query.
 * Filtra por posição no frontend, eliminando 3 requests separados.
 */
export const useAllAnuncios = () => {
  return useQuery(
    ['anuncios', 'all'],
    async () => {
      const { data, error } = await supabase
        .from('anuncios')
        .select('id, titulo, subtitulo, descricao, imagem_url, link_url, texto_botao, tipo, posicao, ativo, destaque, ordem, visualizacoes, cliques, duracao_exibicao, data_inicio, data_fim, created_at, updated_at')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    {
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    }
  );
};

/**
 * useAnuncios - Filtra anúncios por posição a partir da query consolidada.
 */
export const useAnuncios = (posicao: string) => {
  const { data: allAnuncios, isLoading, error } = useAllAnuncios();

  const filtered = React.useMemo(
    () => (allAnuncios || []).filter(a => a.posicao === posicao),
    [allAnuncios, posicao]
  );

  return {
    data: filtered,
    isLoading,
    error,
  };
};

// ============= BLOG =============

export const useBlogPosts = (limit?: number) => {
  return useQuery(
    ['blog-posts', limit || 'all'],
    async () => {
      let query = supabase
        .from('blog_posts')
        .select('id, titulo, titulo_en, slug, resumo, resumo_en, conteudo, conteudo_en, categoria, categoria_en, tags, imagem_destaque, publicado, data_publicacao, visualizacoes, redes_sociais, banner_midia_paga, created_at, updated_at')
        .eq('publicado', true)
        .order('data_publicacao', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    {
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    }
  );
};

export const useBlogPostBySlug = (slug: string | undefined) => {
  return useQuery(
    ['blog-post', slug],
    async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, titulo, titulo_en, slug, resumo, resumo_en, conteudo, conteudo_en, categoria, categoria_en, tags, imagem_destaque, publicado, data_publicacao, visualizacoes, redes_sociais, banner_midia_paga, created_at, updated_at')
        .eq('slug', slug)
        .eq('publicado', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    {
      enabled: !!slug,
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    }
  );
};

// ============= DEPOIMENTOS =============

export const useDepoimentos = () => {
  return useQuery(
    ['depoimentos'],
    async () => {
      const { data, error } = await supabase
        .from('depoimentos')
        .select('id, nome, cargo, foto_url, depoimento, rating, ativo, ordem, pacote_id, rancho_id, created_at')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return (data || []).map(d => ({
        id: d.id,
        nome: d.nome,
        cargo: d.cargo,
        foto_url: d.foto_url,
        depoimento: d.depoimento,
        rating: d.rating,
        ativo: d.ativo,
        ordem: d.ordem,
      }));
    },
    {
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 2,
    }
  );
};

// ============= FAQs =============

export const useFAQs = (pacoteId?: string, ranchoId?: string) => {
  const key = pacoteId ? `pacote_${pacoteId}` : ranchoId ? `rancho_${ranchoId}` : 'general';

  return useQuery(
    ['faqs', key],
    async () => {
      let query = supabase
        .from('faqs')
        .select('id, pergunta, pergunta_en, resposta, resposta_en, categoria, ativo, ordem, pacote_id, rancho_id, votos_uteis, votos_nao_uteis, created_at')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (pacoteId) {
        query = query.eq('pacote_id', pacoteId);
      } else if (ranchoId) {
        query = query.eq('rancho_id', ranchoId);
      } else {
        query = query.is('pacote_id', null).is('rancho_id', null);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    {
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    }
  );
};

// ============= SITE SETTINGS =============

export const useSiteSettings = (isAdmin = false) => {
  return useQuery(
    ['site-settings', isAdmin],
    () => cachedQuery<SiteSettings | null>(
      isAdmin ? 'site_settings_admin' : 'site_settings',
      isAdmin ? 0 : TTL.SETTINGS,
      async () => {
        if (isAdmin) {
          const { data, error } = await supabase
            .from('site_settings')
            .select('id, site_name, site_description, contact_phone, contact_email, whatsapp_number, address, hero_title, hero_subtitle, logo_url, favicon_url, pwa_icon_url, og_image_url, primary_color, secondary_color, header_scripts, body_scripts, video_title, video_url, video_enabled, reserva_button_text, created_at, updated_at')
            .maybeSingle();
          if (error) throw error;
          return data as unknown as SiteSettings | null;
        } else {
          const { data, error } = await supabase
            .from('site_settings_public')
            .select('id, site_name, site_description, contact_phone, contact_email, whatsapp_number, address, hero_title, hero_subtitle, logo_url, favicon_url, pwa_icon_url, og_image_url, primary_color, secondary_color, header_scripts, body_scripts, video_title, video_url, video_enabled, reserva_button_text, created_at, updated_at')
            .maybeSingle();
          if (error) throw error;
          return data as unknown as SiteSettings | null;
        }
      }

    ),
    {
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    }
  );
};


// ============= ADMIN STATISTICS =============

export interface FAQEstatistica {
  id: string;
  pergunta: string;
  ordem: number;
  ativo: boolean;
  pacote_id?: string | null;
  rancho_id?: string | null;
  total_votos: number;
  votos_uteis: number;
  votos_nao_uteis: number;
  taxa_utilidade: number;
}

export interface RanchoEstatistica {
  id: string;
  nome: string;
  slug: string;
  total_visualizacoes: number;
  total_cliques_whatsapp: number;
  total_cliques_reserva: number;
  taxa_conversao: number;
  visualizacoes_7_dias: number;
  visualizacoes_30_dias: number;
}

export const useFAQEstatisticas = () => {
  return useQuery(
    ['faq-estatisticas'],
    async () => {
      const { data, error } = await supabase
        .from('faq_estatisticas')
        .select('id, pergunta, ordem, ativo, pacote_id, rancho_id, total_votos, votos_uteis, votos_nao_uteis, taxa_utilidade');
      if (error) throw error;
      return data || [];
    },
    {
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    }
  );
};

export const useRanchoEstatisticas = () => {
  return useQuery(
    ['rancho-estatisticas'],
    async () => {
      const { data, error } = await supabase
        .from('rancho_estatisticas')
        .select('id, nome, slug, total_visualizacoes, total_cliques_whatsapp, total_cliques_reserva, taxa_conversao, visualizacoes_7_dias, visualizacoes_30_dias');
      if (error) throw error;
      return data || [];
    },
    {
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    }
  );
};

// ============= ADMIN HOOKS =============

export interface AdminDepoimento {
  id: string;
  nome: string;
  cargo: string | null;
  foto_url: string | null;
  depoimento: string;
  rating: number;
  ordem: number;
  ativo: boolean;
  created_at: string;
}

export const useAdminDepoimentos = () => {
  return useQuery(
    ['admin-depoimentos'],
    async () => {
      const { data, error } = await supabase
        .from('depoimentos')
        .select('id, nome, cargo, foto_url, depoimento, rating, ordem, ativo, pacote_id, rancho_id, created_at')
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    {
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    }
  );
};

// Use the Supabase type directly for admin blog posts
import type { Tables, Json } from '@/integrations/supabase/types';
export type AdminBlogPost = Tables<'blog_posts'>;

export const useAdminBlogPosts = () => {
  return useQuery(
    ['admin-blog-posts-cached'],
    async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, titulo, titulo_en, slug, resumo, resumo_en, conteudo, conteudo_en, categoria, categoria_en, tags, imagem_destaque, publicado, data_publicacao, visualizacoes, redes_sociais, banner_midia_paga, created_at, updated_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    {
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    }
  );
};

export interface AdminPacote {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  preco: number;
  duracao: string;
  pessoas: number;
  rating: number;
  tipo: string | null;
  caracteristicas: string[] | null;
  inclusos: string[] | null;
  ativo: boolean;
  popular: boolean;
  destaque: boolean;
  created_at: string;
  pacote_imagens: Array<{
    id: string;
    url: string;
    alt_text: string | null;
    principal: boolean;
    ordem: number;
  }>;
}

export const useAdminPacotes = () => {
  return useQuery(
    ['admin-pacotes-cached'],
    async () => {
      const { data, error } = await supabase
        .from('pacotes')
        .select('*, pacote_imagens(*)')
        .order('nome', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    {
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    }
  );
};

// ============= DASHBOARD STATS =============

export interface DashboardStats {
  totalRanchos: number;
  ranchosDisponiveis: number;
  totalPacotes: number;
  pacotesAtivos: number;
  totalBlogPosts: number;
  postsPublicados: number;
  totalDepoimentos: number;
  depoimentosAtivos: number;
  totalVendas: number;
  vendasAtivas: number;
}

export const useDashboardStats = () => {
  return useQuery(
    ['dashboard-stats'],
    async () => {
      const [ranchos, pacotes, blog, depoimentos, vendas] = await Promise.all([
        supabase.from('ranchos').select('disponivel'),
        supabase.from('pacotes').select('ativo'),
        supabase.from('blog_posts').select('publicado'),
        supabase.from('depoimentos').select('ativo'),
        supabase.from('propriedades_venda').select('ativo'),
      ]);

      return {
        totalRanchos: ranchos.data?.length || 0,
        ranchosDisponiveis: ranchos.data?.filter(r => r.disponivel).length || 0,
        totalPacotes: pacotes.data?.length || 0,
        pacotesAtivos: pacotes.data?.filter(p => p.ativo).length || 0,
        totalBlogPosts: blog.data?.length || 0,
        postsPublicados: blog.data?.filter(b => b.publicado).length || 0,
        totalDepoimentos: depoimentos.data?.length || 0,
        depoimentosAtivos: depoimentos.data?.filter(d => d.ativo).length || 0,
        totalVendas: vendas.data?.length || 0,
        vendasAtivas: vendas.data?.filter(v => v.ativo).length || 0,
      };
    },
    {
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 1,
    }
  );
};

// ============= CACHE INVALIDATION HELPERS =============

export const useInvalidateCache = () => {
  const queryClient = useQueryClient();

  return {
    invalidateRanchos: () => {
      invalidateCacheByPrefix('ranchos');
      invalidateCacheByPrefix('rancho_');
      queryClient.invalidateQueries({ queryKey: ['ranchos'] });
      queryClient.invalidateQueries({ queryKey: ['rancho'] });
    },
    invalidatePacotes: () => {
      invalidateCacheByPrefix('pacotes');
      invalidateCacheByPrefix('pacote_');
      queryClient.invalidateQueries({ queryKey: ['pacotes'] });
      queryClient.invalidateQueries({ queryKey: ['pacote'] });
    },
    invalidateBlog: () => {
      invalidateCacheByPrefix('blog');
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-post'] });
    },
    invalidateAnuncios: () => {
      invalidateCacheByPrefix('anuncios');
      queryClient.invalidateQueries({ queryKey: ['anuncios'] });
    },
    invalidateAdminStats: () => {
      invalidateCacheByPrefix('faq_estatisticas');
      invalidateCacheByPrefix('rancho_estatisticas');
      queryClient.invalidateQueries({ queryKey: ['faq-estatisticas'] });
      queryClient.invalidateQueries({ queryKey: ['rancho-estatisticas'] });
    },
    invalidateDepoimentos: () => {
      invalidateCacheByPrefix('admin_depoimentos');
      queryClient.invalidateQueries({ queryKey: ['admin-depoimentos'] });
    },
    invalidateAdminBlog: () => {
      invalidateCacheByPrefix('admin_blog_posts');
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts-cached'] });
    },
    invalidateAdminPacotes: () => {
      invalidateCacheByPrefix('admin_pacotes');
      queryClient.invalidateQueries({ queryKey: ['admin-pacotes-cached'] });
    },
    invalidateDashboard: () => {
      invalidateCacheByPrefix('dashboard_stats');
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    invalidatePropriedadesVenda: () => {
      invalidateCacheByPrefix('propriedades_venda');
      invalidateCacheByPrefix('propriedade_venda_');
      queryClient.invalidateQueries({ queryKey: ['propriedades_venda'] });
      queryClient.invalidateQueries({ queryKey: ['propriedade_venda'] });
      queryClient.invalidateQueries({ queryKey: ['admin-propriedades-venda'] });
      queryClient.invalidateQueries({ queryKey: ['admin-propriedade-venda'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    invalidateAll: () => {
      invalidateCacheByPrefix('');
      queryClient.invalidateQueries();
    },
  };
};
