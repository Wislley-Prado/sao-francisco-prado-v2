import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FAQTable } from "@/components/admin/faq/FAQTable";
import { FAQFilters } from "@/components/admin/faq/FAQFilters";

interface FAQ {
  id: string;
  pergunta: string;
  resposta: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
  pacote_id?: string | null;
  rancho_id?: string | null;
  pacotes?: { nome: string } | null;
  ranchos?: { nome: string } | null;
}

export default function FAQs() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    filterFaqs();
  }, [faqs, searchTerm, statusFilter]);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select(`
          *,
          pacotes:pacote_id (nome),
          ranchos:rancho_id (nome)
        `)
        .order("ordem", { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error("Erro ao buscar FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterFaqs = () => {
    let filtered = [...faqs];

    if (searchTerm) {
      filtered = filtered.filter(
        (faq) =>
          faq.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.resposta.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "todos") {
      const isActive = statusFilter === "ativo";
      filtered = filtered.filter((faq) => faq.ativo === isActive);
    }

    setFilteredFaqs(filtered);
  };

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Perguntas Frequentes</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as perguntas e respostas do seu site
          </p>
        </div>
        <Button onClick={() => navigate("/admin/faqs/novo")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo FAQ
        </Button>
      </div>

      <FAQFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <FAQTable faqs={filteredFaqs} onUpdate={fetchFaqs} />
    </div>
  );
}
