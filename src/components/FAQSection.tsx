import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FAQVoteButtons } from "@/components/FAQVoteButtons";
import { useFAQs } from "@/hooks/useOptimizedData";
import { useEffect } from "react";
import { invalidateCache } from "@/lib/cacheService";

export const FAQSection = () => {
  const { data: faqs, isLoading, refetch } = useFAQs();

  // If no data and not loading, try to invalidate cache and reload
  // This handles the case where a previous empty result was cached
  useEffect(() => {
    if (!isLoading && (!faqs || faqs.length === 0)) {
      invalidateCache('faqs_general');
      refetch();
    }
  }, [isLoading, faqs, refetch]);

  if (isLoading) {
    return null;
  }

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Perguntas Frequentes
            </CardTitle>
            <p className="text-center text-muted-foreground mt-2">
              Encontre respostas para as dúvidas mais comuns
            </p>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
