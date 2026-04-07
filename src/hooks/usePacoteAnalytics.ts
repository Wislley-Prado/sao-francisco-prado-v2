import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}


type AnalyticsEvent = "visualizacao" | "clique_reserva" | "clique_whatsapp" | "conversao";

export const usePacoteAnalytics = (pacoteId: string, evento: AnalyticsEvent) => {
  useEffect(() => {
    // Não registrar se o pacoteId estiver vazio
    if (!pacoteId) return;

    const registrarEvento = async () => {
      try {
        const { error } = await supabase.from("pacote_analytics").insert([{
          pacote_id: pacoteId,
          evento,
          user_agent: navigator.userAgent,
        }]);

        if (error) {
          console.error("Erro ao registrar analytics do pacote:", error);
        }
      } catch (err) {
        console.error("Erro ao registrar analytics do pacote:", err);
      }
    };

    registrarEvento();
  }, [pacoteId, evento]);
};

export const registrarEventoPacote = async (
  pacoteId: string,
  evento: AnalyticsEvent,
  tipo?: string
) => {
  try {
    const { error } = await supabase.from("pacote_analytics").insert([{
      pacote_id: pacoteId,
      evento,
      tipo,
      user_agent: navigator.userAgent,
    }]);

    if (error) {
      console.error("Erro ao registrar analytics do pacote:", error);
    }
  } catch (err) {
    console.error("Erro ao registrar analytics do pacote:", err);
  }
};

// Função para disparar tracking code personalizado (Facebook Pixel, Google Analytics, etc)
export const dispararPixel = (trackingCode: string, evento: string, dados?: Record<string, unknown>) => {
  try {
    // Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', evento, dados);
    }

    // Google Analytics (GA4)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', evento, dados);
    }

    // Google Tag Manager
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: evento,
        ...dados
      });
    }

    // Código personalizado via Function constructor (mais seguro que eval)
    if (trackingCode && trackingCode.trim()) {
      try {
        // Se o tracking code contém código executável, executa usando Function constructor
        if (trackingCode.includes('fbq(') || trackingCode.includes('gtag(') || trackingCode.includes('dataLayer')) {
          const executar = new Function('evento', 'dados', trackingCode);
          executar(evento, dados);
        }
      } catch (error) {
        console.error('Erro ao executar tracking code:', error);
      }
    }
  } catch (error) {
    console.error('Erro ao disparar pixel:', error);
  }
};
