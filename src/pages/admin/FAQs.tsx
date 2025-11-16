import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FAQTable } from "@/components/admin/faq/FAQTable";
import { FAQFilters } from "@/components/admin/faq/FAQFilters";
import { FAQStats } from "@/components/admin/faq/FAQStats";

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
  votos_stats?: {
    total_votos: number;
    votos_uteis: number;
    votos_nao_uteis: number;
    taxa_utilidade: number;
  };
}

export default function FAQs() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    if (faqs.length > 0) {
      fetchStats();
    }
  }, [faqs]);

  useEffect(() => {
    filterFaqs();
  }, [faqs, searchTerm, statusFilter]);

  const fetchFaqs = async () => {
    try {
      // Buscar FAQs
      const { data: faqsData, error: faqsError } = await supabase
        .from("faqs")
        .select(`
          *,
          pacotes:pacote_id (nome),
          ranchos:rancho_id (nome)
        `)
        .order("ordem", { ascending: true });

      if (faqsError) throw faqsError;

      // Buscar estatísticas de votos
      const { data: statsData, error: statsError } = await supabase
        .from("faq_estatisticas")
        .select("*");

      if (statsError) throw statsError;

      // Combinar FAQs com suas estatísticas
      const faqsComStats = faqsData?.map(faq => {
        const stats = statsData?.find(s => s.id === faq.id);
        return {
          ...faq,
          votos_stats: stats ? {
            total_votos: stats.total_votos || 0,
            votos_uteis: stats.votos_uteis || 0,
            votos_nao_uteis: stats.votos_nao_uteis || 0,
            taxa_utilidade: stats.taxa_utilidade || 0,
          } : undefined,
        };
      }) || [];

      setFaqs(faqsComStats);
    } catch (error) {
      console.error("Erro ao buscar FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: estatisticas, error } = await supabase
        .from("faq_estatisticas")
        .select("*");

      if (error) throw error;

      const totalFaqs = faqs.length;
      const totalVotos = estatisticas?.reduce((acc, curr) => acc + (curr.total_votos || 0), 0) || 0;
      const taxaUtilidade = estatisticas?.length > 0
        ? estatisticas.reduce((acc, curr) => acc + (curr.taxa_utilidade || 0), 0) / estatisticas.length
        : 0;

      const maisUteis = estatisticas
        ?.filter(e => e.total_votos >= 5)
        ?.sort((a, b) => b.taxa_utilidade - a.taxa_utilidade)
        ?.slice(0, 3) || [];

      const menosUteis = estatisticas
        ?.filter(e => e.total_votos >= 5 && e.taxa_utilidade < 70)
        ?.sort((a, b) => a.taxa_utilidade - b.taxa_utilidade)
        ?.slice(0, 3) || [];

      setStats({
        totalFaqs,
        totalVotos,
        taxaUtilidade,
        maisUteis,
        menosUteis,
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
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

      {stats && <FAQStats stats={stats} />}

      <FAQFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <FAQTable faqs={filteredFaqs} onUpdate={() => { fetchFaqs(); fetchStats(); }} />
    </div>
  );
}
