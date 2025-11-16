import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DepoimentoTable } from "@/components/admin/depoimento/DepoimentoTable";
import { DepoimentoFilters } from "@/components/admin/depoimento/DepoimentoFilters";

interface Depoimento {
  id: string;
  nome: string;
  cargo: string | null;
  foto_url: string | null;
  depoimento: string;
  rating: number;
  ordem: number;
  ativo: boolean;
  created_at: string;
}

export default function Depoimentos() {
  const navigate = useNavigate();
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [filteredDepoimentos, setFilteredDepoimentos] = useState<Depoimento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepoimentos();
  }, []);

  useEffect(() => {
    filterDepoimentos();
  }, [depoimentos, searchTerm, statusFilter]);

  const fetchDepoimentos = async () => {
    try {
      const { data, error } = await supabase
        .from("depoimentos")
        .select("*")
        .order("ordem", { ascending: true });

      if (error) throw error;
      setDepoimentos(data || []);
    } catch (error) {
      console.error("Erro ao buscar depoimentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterDepoimentos = () => {
    let filtered = [...depoimentos];

    if (searchTerm) {
      filtered = filtered.filter(
        (dep) =>
          dep.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dep.depoimento.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "todos") {
      const isActive = statusFilter === "ativo";
      filtered = filtered.filter((dep) => dep.ativo === isActive);
    }

    setFilteredDepoimentos(filtered);
  };

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Depoimentos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os depoimentos dos seus clientes
          </p>
        </div>
        <Button onClick={() => navigate("/admin/depoimentos/novo")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Depoimento
        </Button>
      </div>

      <DepoimentoFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <DepoimentoTable depoimentos={filteredDepoimentos} onUpdate={fetchDepoimentos} />
    </div>
  );
}
