import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { DepoimentoTable } from "@/components/admin/depoimento/DepoimentoTable";
import { DepoimentoFilters } from "@/components/admin/depoimento/DepoimentoFilters";
import { useAdminDepoimentos, useInvalidateCache } from "@/hooks/useOptimizedData";
import { toast } from "sonner";

export default function Depoimentos() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const { data: depoimentos = [], isLoading, refetch } = useAdminDepoimentos();
  const { invalidateDepoimentos } = useInvalidateCache();

  const filteredDepoimentos = useMemo(() => {
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

    return filtered;
  }, [depoimentos, searchTerm, statusFilter]);

  const handleRefresh = () => {
    invalidateDepoimentos();
    refetch();
    toast.success("Dados atualizados!");
  };

  const handleUpdate = () => {
    invalidateDepoimentos();
    refetch();
  };

  if (isLoading) {
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
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button onClick={() => navigate("/admin/depoimentos/novo")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Depoimento
          </Button>
        </div>
      </div>

      <DepoimentoFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <DepoimentoTable depoimentos={filteredDepoimentos} onUpdate={handleUpdate} />
    </div>
  );
}
