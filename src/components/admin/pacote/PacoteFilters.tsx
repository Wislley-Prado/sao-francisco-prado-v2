import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface PacoteFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  tipoFilter: string;
  onTipoChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  orderBy: string;
  onOrderByChange: (value: string) => void;
}

export const PacoteFilters = ({
  searchTerm,
  onSearchChange,
  tipoFilter,
  onTipoChange,
  statusFilter,
  onStatusChange,
  orderBy,
  onOrderByChange,
}: PacoteFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar por nome ou slug..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={tipoFilter} onValueChange={onTipoChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os Tipos</SelectItem>
          <SelectItem value="pescaria">Pescaria</SelectItem>
          <SelectItem value="completo">Completo</SelectItem>
          <SelectItem value="personalizado">Personalizado</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os Status</SelectItem>
          <SelectItem value="ativo">Ativos</SelectItem>
          <SelectItem value="inativo">Inativos</SelectItem>
          <SelectItem value="popular">Populares</SelectItem>
          <SelectItem value="destaque">Destaques</SelectItem>
        </SelectContent>
      </Select>

      <Select value={orderBy} onValueChange={onOrderByChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="nome">Nome</SelectItem>
          <SelectItem value="preco_asc">Preço (menor)</SelectItem>
          <SelectItem value="preco_desc">Preço (maior)</SelectItem>
          <SelectItem value="rating">Rating</SelectItem>
          <SelectItem value="created_at">Mais Recentes</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
