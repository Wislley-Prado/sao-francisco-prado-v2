import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  id: string;
  pergunta: string;
  resposta: string;
  ordem: number;
}

interface RanchoFAQsProps {
  ranchoId: string;
}

export const RanchoFAQs = ({ ranchoId }: RanchoFAQsProps) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, [ranchoId]);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("ativo", true)
        .eq("rancho_id", ranchoId)
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
    return <div className="text-muted-foreground">Carregando perguntas...</div>;
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhuma pergunta frequente disponível para este rancho.</p>
        <p className="text-sm mt-2">Entre em contato pelo WhatsApp para tirar suas dúvidas!</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={faq.id} value={`item-${index}`}>
          <AccordionTrigger className="text-left">
            {faq.pergunta}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {faq.resposta}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
