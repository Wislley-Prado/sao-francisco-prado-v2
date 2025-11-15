import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2, Star, Users, BedDouble } from 'lucide-react';
import { DeleteRanchoDialog } from './DeleteRanchoDialog';
import { useState } from 'react';

interface RanchoImage {
  url: string;
  principal: boolean;
}

interface Rancho {
  id: string;
  nome: string;
  localizacao: string;
  capacidade: number;
  quartos: number;
  preco: number;
  rating: number;
  disponivel: boolean;
  destaque: boolean;
  rancho_imagens: RanchoImage[];
}

interface RanchoTableProps {
  ranchos: Rancho[];
  isLoading: boolean;
  onUpdate: () => void;
}

export const RanchoTable = ({ ranchos, isLoading, onUpdate }: RanchoTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRancho, setSelectedRancho] = useState<Rancho | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (ranchos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg mb-2">Nenhum rancho encontrado</p>
        <p className="text-sm">
          Ajuste os filtros ou cadastre um novo rancho
        </p>
      </div>
    );
  }

  const getMainImage = (rancho: Rancho) => {
    const mainImage = rancho.rancho_imagens?.find(img => img.principal);
    return mainImage?.url || rancho.rancho_imagens?.[0]?.url || '/placeholder.svg';
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rancho</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Capacidade</TableHead>
              <TableHead>Preço/Dia</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranchos.map((rancho) => (
              <TableRow key={rancho.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={getMainImage(rancho)}
                      alt={rancho.nome}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground">{rancho.nome}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <BedDouble className="w-3 h-3" />
                        <span>{rancho.quartos} quartos</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {rancho.localizacao}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{rancho.capacidade}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  R$ {Number(rancho.preco).toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-foreground">
                      {Number(rancho.rating).toFixed(1)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Badge variant={rancho.disponivel ? 'default' : 'secondary'}>
                      {rancho.disponivel ? 'Disponível' : 'Indisponível'}
                    </Badge>
                    {rancho.destaque && (
                      <Badge variant="outline" className="border-yellow-400 text-yellow-600">
                        Destaque
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/admin/ranchos/editar/${rancho.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedRancho(rancho);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedRancho && (
        <DeleteRanchoDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          rancho={selectedRancho}
          onSuccess={onUpdate}
        />
      )}
    </>
  );
};
