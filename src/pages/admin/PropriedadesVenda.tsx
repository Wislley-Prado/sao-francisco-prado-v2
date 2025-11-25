import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash, Search, Eye, EyeOff, Star } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Propriedade {
  id: string;
  titulo: string;
  slug: string;
  tipo: string;
  localizacao: string;
  area: number;
  preco: number;
  ativo: boolean;
  destaque: boolean;
  created_at: string;
}

export default function PropriedadesVenda() {
  const navigate = useNavigate();
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchPropriedades();
  }, []);

  const fetchPropriedades = async () => {
    try {
      const { data, error } = await supabase
        .from('propriedades_venda')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      setPropriedades(data || []);
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
      toast.error('Erro ao carregar propriedades');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('propriedades_venda')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast.success('Propriedade excluída com sucesso');
      fetchPropriedades();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao excluir propriedade');
    } finally {
      setDeleteId(null);
    }
  };

  const toggleAtivo = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('propriedades_venda')
        .update({ ativo: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Propriedade ${!currentStatus ? 'ativada' : 'desativada'} com sucesso`);
      fetchPropriedades();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const toggleDestaque = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('propriedades_venda')
        .update({ destaque: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Destaque ${!currentStatus ? 'ativado' : 'desativado'}`);
      fetchPropriedades();
    } catch (error) {
      console.error('Erro ao atualizar destaque:', error);
      toast.error('Erro ao atualizar destaque');
    }
  };

  const filteredPropriedades = propriedades.filter(p =>
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.localizacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLocalizacaoLabel = (loc: string) => {
    const labels: Record<string, string> = {
      velho_chico: 'Velho Chico',
      represa: 'Represa',
      outros: 'Outros'
    };
    return labels[loc] || loc;
  };

  const getTipoLabel = (tipo: string) => {
    return tipo === 'terreno' ? 'Terreno' : 'Rancho';
  };

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Propriedades à Venda</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie terrenos e ranchos disponíveis para compra
          </p>
        </div>
        <Button onClick={() => navigate('/admin/propriedades-venda/novo')}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Propriedade
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-3xl">{propriedades.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ativos</CardDescription>
            <CardTitle className="text-3xl">
              {propriedades.filter(p => p.ativo).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Em Destaque</CardDescription>
            <CardTitle className="text-3xl">
              {propriedades.filter(p => p.destaque).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Terrenos</CardDescription>
            <CardTitle className="text-3xl">
              {propriedades.filter(p => p.tipo === 'terreno').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Propriedades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar por título, tipo ou localização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Propriedades</CardTitle>
          <CardDescription>
            {filteredPropriedades.length} propriedade(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPropriedades.map((propriedade) => (
                <TableRow key={propriedade.id}>
                  <TableCell className="font-medium">
                    {propriedade.titulo}
                    {propriedade.destaque && (
                      <Star className="w-4 h-4 inline ml-2 text-yellow-500 fill-yellow-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getTipoLabel(propriedade.tipo)}</Badge>
                  </TableCell>
                  <TableCell>{getLocalizacaoLabel(propriedade.localizacao)}</TableCell>
                  <TableCell>{propriedade.area} ha</TableCell>
                  <TableCell>R$ {propriedade.preco.toLocaleString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge variant={propriedade.ativo ? 'default' : 'secondary'}>
                      {propriedade.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleAtivo(propriedade.id, propriedade.ativo)}
                        title={propriedade.ativo ? 'Desativar' : 'Ativar'}
                      >
                        {propriedade.ativo ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleDestaque(propriedade.id, propriedade.destaque)}
                        title={propriedade.destaque ? 'Remover destaque' : 'Destacar'}
                      >
                        <Star 
                          className={`w-4 h-4 ${propriedade.destaque ? 'fill-yellow-500 text-yellow-500' : ''}`} 
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/propriedades-venda/editar/${propriedade.id}`)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(propriedade.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPropriedades.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma propriedade encontrada
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta propriedade? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
