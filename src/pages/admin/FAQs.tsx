import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FAQTable } from "@/components/admin/faq/FAQTable";
import { FAQFilters } from "@/components/admin/faq/FAQFilters";
import { FAQStats } from "@/components/admin/faq/FAQStats";
import { useFAQEstatisticas, useInvalidateCache } from "@/hooks/useOptimizedData";
import { toast } from "sonner";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const { invalidateAdminStats } = useInvalidateCache();

  // Buscar FAQs
  const { data: faqsData, isLoading: loadingFaqs, refetch: refetchFaqs } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select(`
          *,
          pacotes:pacote_id (nome),
          ranchos:rancho_id (nome)
        `)
        .order("ordem", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Buscar estatísticas com cache de 1 hora
  const { data: statsData, isLoading: loadingStats, refetch: refetchStats, isFetching } = useFAQEstatisticas();

  // Combinar FAQs com estatísticas
  const faqs = useMemo(() => {
    if (!faqsData) return [];
    
    return faqsData.map(faq => {
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
    }) as FAQ[];
  }, [faqsData, statsData]);

  // Calcular stats gerais
  const stats = useMemo(() => {
    if (!statsData || !faqs.length) return null;

    const totalFaqs = faqs.length;
    const totalVotos = statsData.reduce((acc, curr) => acc + (curr.total_votos || 0), 0);
    const taxaUtilidade = statsData.length > 0
      ? statsData.reduce((acc, curr) => acc + (curr.taxa_utilidade || 0), 0) / statsData.length
      : 0;

    const maisUteis = statsData
      .filter(e => e.total_votos >= 5)
      .sort((a, b) => b.taxa_utilidade - a.taxa_utilidade)
      .slice(0, 3);

    const menosUteis = statsData
      .filter(e => e.total_votos >= 5 && e.taxa_utilidade < 70)
      .sort((a, b) => a.taxa_utilidade - b.taxa_utilidade)
      .slice(0, 3);

    return {
      totalFaqs,
      totalVotos,
      taxaUtilidade,
      maisUteis,
      menosUteis,
    };
  }, [statsData, faqs]);

  // Filtrar FAQs
  const filteredFaqs = useMemo(() => {
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

    return filtered;
  }, [faqs, searchTerm, statusFilter]);

  const handleRefresh = async () => {
    invalidateAdminStats();
    await Promise.all([refetchFaqs(), refetchStats()]);
    toast.success("Dados atualizados!");
  };

  const handleUpdate = () => {
    refetchFaqs();
    refetchStats();
  };

  if (loadingFaqs || loadingStats) {
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
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={() => navigate("/admin/faqs/novo")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo FAQ
          </Button>
        </div>
      </div>

      {stats && <FAQStats stats={stats} />}

      <FAQFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <FAQTable faqs={filteredFaqs} onUpdate={handleUpdate} />
    </div>
  );
}
