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
import { Edit, Trash2, Star, Users, Calendar } from 'lucide-react';
import { DeletePacoteDialog } from './DeletePacoteDialog';
import { useState } from 'react';

interface PacoteImage {
  url: string;
  principal: boolean;
}

interface Pacote {
  id: string;
  nome: string;
  tipo: string;
  duracao: string;
  pessoas: number;
  preco: number;
  rating: number;
  ativo: boolean;
  popular: boolean;
  destaque: boolean;
  pacote_imagens: PacoteImage[];
}

interface PacoteTableProps {
  pacotes: Pacote[];
  isLoading: boolean;
  onUpdate: () => void;
}

export const PacoteTable = ({ pacotes, isLoading, onUpdate }: PacoteTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPacote, setSelectedPacote] = useState<Pacote | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (pacotes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg mb-2">Nenhum pacote encontrado</p>
        <p className="text-sm">
          Ajuste os filtros ou cadastre um novo pacote
        </p>
      </div>
    );
  }

  const getMainImage = (pacote: Pacote) => {
    const mainImage = pacote.pacote_imagens?.find(img => img.principal);
    return mainImage?.url || pacote.pacote_imagens?.[0]?.url || '/placeholder.svg';
  };

  const getTipoBadge = (tipo: string) => {
    const tipos = {
      pescaria: { label: 'Pescaria', variant: 'default' as const },
      completo: { label: 'Completo', variant: 'secondary' as const },
      personalizado: { label: 'Personalizado', variant: 'outline' as const },
    };
    return tipos[tipo as keyof typeof tipos] || tipos.pescaria;
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pacote</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Pessoas</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pacotes.map((pacote) => (
              <TableRow key={pacote.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={getMainImage(pacote)}
                      alt={pacote.nome}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground">{pacote.nome}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {pacote.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                        {pacote.destaque && (
                          <Badge variant="default" className="text-xs">
                            Destaque
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getTipoBadge(pacote.tipo).variant}>
                    {getTipoBadge(pacote.tipo).label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{pacote.duracao}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{pacote.pessoas}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  R$ {Number(pacote.preco).toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{Number(pacote.rating).toFixed(1)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={pacote.ativo ? 'default' : 'secondary'}>
                    {pacote.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="ghost" size="icon">
                      <Link to={`/admin/pacotes/${pacote.id}/editar`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedPacote(pacote);
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

      <DeletePacoteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        pacote={selectedPacote}
        onSuccess={onUpdate}
      />
    </>
  );
};
