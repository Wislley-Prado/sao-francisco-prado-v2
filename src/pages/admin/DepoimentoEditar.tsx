import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DepoimentoForm } from "@/components/admin/depoimento/DepoimentoForm";
import { supabase } from "@/integrations/supabase/client";

export default function DepoimentoEditar() {
  const { id } = useParams();
  const [depoimento, setDepoimento] = useState<{ id: string;[key: string]: unknown } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepoimento();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchDepoimento = async () => {
    try {
      const { data, error } = await supabase
        .from("depoimentos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setDepoimento(data);
    } catch (error) {
      console.error("Erro ao buscar depoimento:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  if (!depoimento) {
    return <div className="p-8">Depoimento não encontrado</div>;
  }

  return (
    <div className="p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Editar Depoimento</CardTitle>
          <CardDescription>
            Atualize as informações do depoimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DepoimentoForm initialData={depoimento} />
        </CardContent>
      </Card>
    </div>
  );
}
