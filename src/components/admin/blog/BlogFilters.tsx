import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface BlogFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  categoriaFilter: string;
  onCategoriaFilterChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
}

export const BlogFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoriaFilter,
  onCategoriaFilterChange,
  sortBy,
  onSortByChange
}: BlogFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por título ou conteúdo..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
            <SelectItem value="draft">Rascunhos</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoriaFilter} onValueChange={onCategoriaFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Categorias</SelectItem>
            <SelectItem value="dicas">Dicas de Pesca</SelectItem>
            <SelectItem value="noticias">Notícias</SelectItem>
            <SelectItem value="especies">Espécies</SelectItem>
            <SelectItem value="equipamentos">Equipamentos</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger>
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at_desc">Mais Recentes</SelectItem>
            <SelectItem value="created_at_asc">Mais Antigos</SelectItem>
            <SelectItem value="titulo_asc">Título (A-Z)</SelectItem>
            <SelectItem value="titulo_desc">Título (Z-A)</SelectItem>
            <SelectItem value="visualizacoes_desc">Mais Visualizados</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
