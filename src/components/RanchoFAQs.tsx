import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQVoteButtons } from "@/components/FAQVoteButtons";
import { useTranslation } from "react-i18next";
import { HelpCircle } from "lucide-react";

interface FAQ {
  id: string;
  pergunta: string;
  pergunta_en?: string | null;
  resposta: string;
  resposta_en?: string | null;
  ordem: number;
}

interface RanchoFAQsProps {
  ranchoId: string;
}

export const RanchoFAQs = ({ ranchoId }: RanchoFAQsProps) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ranchoId]);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("id, pergunta, resposta, ativo, ordem, pacote_id, rancho_id, created_at")
        .eq("ativo", true)
        .or(`rancho_id.eq.${ranchoId},and(rancho_id.is.null,pacote_id.is.null)`)
        .order("ordem", { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error("Erro ao buscar FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground py-4 text-center">Carregando perguntas...</div>;
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{isEn ? "No frequently asked questions available for this ranch." : "Nenhuma pergunta frequente disponível para este rancho."}</p>
        <p className="text-sm mt-2">{isEn ? "Contact us on WhatsApp to clarify your questions!" : "Entre em contato pelo WhatsApp para tirar suas dúvidas!"}</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-3">
      {faqs.map((faq, index) => {
        const perguntaText = isEn && faq.pergunta_en ? faq.pergunta_en : faq.pergunta;
        const respostaText = isEn && faq.resposta_en ? faq.resposta_en : faq.resposta;

        return (
          <AccordionItem 
            key={faq.id} 
            value={`item-${index}`}
            className="border border-border/60 rounded-xl px-4 bg-card shadow-sm hover:border-rio-blue/40 transition-colors"
          >
            <AccordionTrigger className="text-left font-medium hover:no-underline py-4 text-base">
              <span className="flex items-center gap-3 text-foreground">
                <HelpCircle className="h-5 w-5 text-rio-blue shrink-0" />
                {perguntaText}
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4 pt-1 pl-8">
              <p className="leading-relaxed whitespace-pre-line text-sm sm:text-base">{respostaText}</p>
              <div className="mt-4 pt-3 border-t border-border/40">
                <FAQVoteButtons faqId={faq.id} />
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
