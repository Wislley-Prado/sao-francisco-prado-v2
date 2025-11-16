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
  pacoteId: string;
}

const FAQItem = ({ faq, index, value }: { faq: FAQ; index: number; value: string }) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.3 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <AccordionItem value={value} className="border-b border-border/50 hover:border-primary/30 transition-colors">
        <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors py-5">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <span>{faq.pergunta}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground pb-6">
          <div className="pl-8">
            <p className="leading-relaxed mb-4">{faq.resposta}</p>
            <FAQVoteButtons faqId={faq.id} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
};

export const PacoteFAQs = ({ pacoteId }: PacoteFAQsProps) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal({ threshold: 0.5 });

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
    return (
      <div className="py-16 text-center">
        <div className="animate-pulse text-muted-foreground">Carregando perguntas...</div>
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl">
        <HelpCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="font-semibold mb-2">Nenhuma pergunta frequente disponível para este pacote.</p>
        <p className="text-sm">Entre em contato pelo WhatsApp para tirar suas dúvidas!</p>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container max-w-4xl mx-auto px-4">
        <div
          ref={titleRef}
          className={`text-center mb-12 transition-all duration-700 ${
            titleVisible 
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
      </div>
    </section>
  );
};
