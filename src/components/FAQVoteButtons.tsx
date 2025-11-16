import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FAQVoteButtonsProps {
  faqId: string;
}

export const FAQVoteButtons = ({ faqId }: FAQVoteButtonsProps) => {
  const [hasVoted, setHasVoted] = useState<boolean | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    // Verificar se já votou (usando localStorage)
    const voted = localStorage.getItem(`faq_vote_${faqId}`);
    if (voted) {
      setHasVoted(voted === "true");
    }
  }, [faqId]);

  const handleVote = async (voto: boolean) => {
    if (hasVoted !== null) {
      return; // Já votou, não mostra nada
    }

    setIsVoting(true);
    try {
      const { error } = await supabase
        .from("faq_votes")
        .insert([{
          faq_id: faqId,
          voto,
          ip_address: null,
          user_agent: navigator.userAgent,
        }]);

      if (error) throw error;

      setHasVoted(voto);
      localStorage.setItem(`faq_vote_${faqId}`, voto.toString());
      toast.success(voto ? "Obrigado! Ficamos felizes que foi útil! 😊" : "Obrigado pelo feedback! Vamos melhorar esta resposta. 📝");
    } catch (error) {
      console.error("Erro ao registrar voto:", error);
      toast.error("Erro ao registrar sua avaliação");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4 pt-4 border-t">
      <span className="text-sm text-muted-foreground mr-2">Esta resposta foi útil?</span>
      <Button
        variant={hasVoted === true ? "default" : "outline"}
        size="sm"
        onClick={() => handleVote(true)}
        disabled={isVoting || hasVoted !== null}
        className={cn(
          "gap-1",
          hasVoted === true && "bg-green-500 hover:bg-green-600"
        )}
      >
        <ThumbsUp className="h-4 w-4" />
        Sim
      </Button>
      <Button
        variant={hasVoted === false ? "default" : "outline"}
        size="sm"
        onClick={() => handleVote(false)}
        disabled={isVoting || hasVoted !== null}
        className={cn(
          "gap-1",
          hasVoted === false && "bg-red-500 hover:bg-red-600"
        )}
      >
        <ThumbsDown className="h-4 w-4" />
        Não
      </Button>
    </div>
  );
};
