import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQVoteButtons } from "@/components/FAQVoteButtons";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { HelpCircle } from "lucide-react";

interface FAQ {
  id: string;
  pergunta: string;
  resposta: string;
  ordem: number;
}

interface PacoteFAQsProps {
  pacoteId: string | null;
  showTitle?: boolean;
  className?: string;
}

const FAQItem = ({ faq, index, value }: { faq: FAQ; index: number; value: string }) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-4'
        }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <AccordionItem value={value} className="border-b border-border/50 hover:border-primary/30 transition-colors">
        <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors py-4">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span>{faq.pergunta}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground pb-5">
          <div className="pl-8">
            <p className="leading-relaxed mb-3">{faq.resposta}</p>
            <FAQVoteButtons faqId={faq.id} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
};

export const PacoteFAQs = ({ pacoteId, showTitle = false, className = '' }: PacoteFAQsProps) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal({ threshold: 0.3 });

  useEffect(() => {
    fetchFaqs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacoteId]);

  const fetchFaqs = async () => {
    try {
      let query = supabase
        .from("faqs")
        .select("id, pergunta, resposta, ativo, ordem, pacote_id, rancho_id, created_at")
        .eq("ativo", true)
        .order("ordem", { ascending: true });

      if (pacoteId) {
        query = query.or(`pacote_id.eq.${pacoteId},and(rancho_id.is.null,pacote_id.is.null)`);
      } else {
        query = query.is("rancho_id", null).is("pacote_id", null);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error("Erro ao buscar FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-6 text-center">
        <div className="animate-pulse text-sm text-muted-foreground">Carregando perguntas frequentes...</div>
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground bg-muted/20 rounded-xl">
        <HelpCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
        <p className="font-medium text-sm mb-1">Nenhuma pergunta frequente cadastrada para este pacote.</p>
        <p className="text-xs">Entre em contato pelo WhatsApp para tirar todas as suas dúvidas!</p>
      </div>
    );
  }

  const accordionContent = (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <FAQItem
          key={faq.id}
          faq={faq}
          index={index}
          value={`item-${index}`}
        />
      ))}
    </Accordion>
  );

  if (!showTitle) {
    return (
      <div className={`w-full ${className}`}>
        {accordionContent}
      </div>
    );
  }

  return (
    <section className={`py-8 ${className}`}>
      <div className="container max-w-4xl mx-auto px-4">
        <div
          ref={titleRef}
          className={`text-center mb-8 transition-all duration-700 ${titleVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4'
            }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Perguntas Frequentes
          </h2>
          <p className="text-muted-foreground text-lg">
            Tire suas dúvidas sobre este pacote
          </p>
        </div>
        {accordionContent}
      </div>
    </section>
  );
};
