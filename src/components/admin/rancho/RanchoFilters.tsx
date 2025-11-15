import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RanchoFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterDisponivel: boolean | null;
  onFilterDisponivelChange: (value: boolean | null) => void;
  filterDestaque: boolean | null;
  onFilterDestaqueChange: (value: boolean | null) => void;
}

export const RanchoFilters = ({
  searchTerm,
  onSearchChange,
  filterDisponivel,
  onFilterDisponivelChange,
  filterDestaque,
  onFilterDestaqueChange,
}: RanchoFiltersProps) => {
  const hasFilters = searchTerm || filterDisponivel !== null || filterDestaque !== null;

  const clearFilters = () => {
    onSearchChange('');
    onFilterDisponivelChange(null);
    onFilterDestaqueChange(null);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou localização..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        value={filterDisponivel === null ? 'all' : filterDisponivel.toString()}
        onValueChange={(value) =>
          onFilterDisponivelChange(value === 'all' ? null : value === 'true')
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Disponibilidade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="true">Disponível</SelectItem>
          <SelectItem value="false">Indisponível</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filterDestaque === null ? 'all' : filterDestaque.toString()}
        onValueChange={(value) =>
          onFilterDestaqueChange(value === 'all' ? null : value === 'true')
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Destaque" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="true">Em Destaque</SelectItem>
          <SelectItem value="false">Sem Destaque</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="icon" onClick={clearFilters}>
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
