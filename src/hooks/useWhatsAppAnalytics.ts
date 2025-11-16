import { supabase } from "@/integrations/supabase/client";

type WhatsAppEvent = "widget_aberto" | "mensagem_rapida" | "botao_whatsapp";

export const registrarEventoWhatsApp = async (
  evento: WhatsAppEvent,
  mensagemTipo?: string
) => {
  try {
    const { error } = await supabase.from("whatsapp_analytics").insert([{
      evento,
      mensagem_tipo: mensagemTipo,
      user_agent: navigator.userAgent,
    }]);

    if (error) {
      console.error("Erro ao registrar analytics do WhatsApp:", error);
    }
  } catch (err) {
    console.error("Erro ao registrar analytics do WhatsApp:", err);
  }
};
