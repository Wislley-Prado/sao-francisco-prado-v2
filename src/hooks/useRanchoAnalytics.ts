import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type AnalyticsEvent = "visualizacao" | "clique_whatsapp" | "clique_reserva";

export const useRanchoAnalytics = (ranchoId: string, evento: AnalyticsEvent) => {
  useEffect(() => {
    const registrarEvento = async () => {
      try {
        const { error } = await supabase.from("rancho_analytics").insert([{
          rancho_id: ranchoId,
          evento,
          user_agent: navigator.userAgent,
        }]);

        if (error) {
          console.error("Erro ao registrar analytics:", error);
        }
      } catch (err) {
        console.error("Erro ao registrar analytics:", err);
      }
    };

    registrarEvento();
  }, [ranchoId, evento]);
};

export const registrarEvento = async (ranchoId: string, evento: AnalyticsEvent) => {
  try {
    const { error } = await supabase.from("rancho_analytics").insert([{
      rancho_id: ranchoId,
      evento,
      user_agent: navigator.userAgent,
    }]);

    if (error) {
      console.error("Erro ao registrar analytics:", error);
    }
  } catch (err) {
    console.error("Erro ao registrar analytics:", err);
  }
};
