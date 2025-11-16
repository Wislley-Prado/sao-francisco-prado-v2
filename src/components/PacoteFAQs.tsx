import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQVoteButtons } from "@/components/FAQVoteButtons";

interface FAQ {
  id: string;
  pergunta: string;
  resposta: string;
  ordem: number;
}

interface PacoteFAQsProps {
  pacoteId: string;
}

export const PacoteFAQs = ({ pacoteId }: PacoteFAQsProps) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, [pacoteId]);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("ativo", true)
        .eq("pacote_id", pacoteId)
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
        <p>Nenhuma pergunta frequente disponível para este pacote.</p>
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
            <p>{faq.resposta}</p>
            <FAQVoteButtons faqId={faq.id} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
