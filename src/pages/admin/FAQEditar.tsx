import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FAQForm } from "@/components/admin/faq/FAQForm";
import { supabase } from "@/integrations/supabase/client";

export default function FAQEditar() {
  const { id } = useParams();
  const [faq, setFaq] = useState<{ id: string;[key: string]: unknown } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaq();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchFaq = async () => {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setFaq(data);
    } catch (error) {
      console.error("Erro ao buscar FAQ:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  if (!faq) {
    return <div className="p-8">FAQ não encontrado</div>;
  }

  return (
    <div className="p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Editar FAQ</CardTitle>
          <CardDescription>
            Atualize as informações da pergunta frequente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FAQForm initialData={faq} />
        </CardContent>
      </Card>
    </div>
  );
}
