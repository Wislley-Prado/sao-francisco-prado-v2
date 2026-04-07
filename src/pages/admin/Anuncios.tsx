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
import { Plus, Pencil, Trash, Search, Eye, EyeOff, Star, BarChart } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateCacheByPrefix } from '@/lib/cacheService';
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
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Anuncio {
  id: string;
  titulo: string;
  tipo: string;
  posicao: string;
  ativo: boolean;
  destaque: boolean;
  visualizacoes: number;
  cliques: number;
  data_inicio: string | null;
  data_fim: string | null;
  created_at: string;
}

export default function Anuncios() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchAnuncios();
  }, []);

  const fetchAnuncios = async () => {
    try {
      const { data, error } = await supabase
        .from('anuncios')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      setAnuncios(data || []);
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error);
      toast.error('Erro ao carregar anúncios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('anuncios')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      invalidateCacheByPrefix('anuncios_all');
      queryClient.invalidateQueries({ queryKey: ['anuncios'] });

      toast.success('Anúncio excluído com sucesso');
      fetchAnuncios();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao excluir anúncio');
    } finally {
      setDeleteId(null);
    }
  };

  const toggleAtivo = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('anuncios')
        .update({ ativo: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      invalidateCacheByPrefix('anuncios_all');
      queryClient.invalidateQueries({ queryKey: ['anuncios'] });

      toast.success(`Anúncio ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`);
      fetchAnuncios();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const getTipoLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      banner_principal: 'Banner Principal',
      card_secundario: 'Card Secundário',
      full_width: 'Largura Total'
    };
    return tipos[tipo] || tipo;
  };

  const getPosicaoLabel = (posicao: string) => {
    const posicoes: Record<string, string> = {
      topo: 'Topo',
      meio: 'Meio',
      rodape: 'Rodapé',
      sidebar: 'Lateral'
    };
    return posicoes[posicao] || posicao;
  };

  const isAtivo = (anuncio: Anuncio) => {
    if (!anuncio.ativo) return false;
    const now = new Date();
    if (anuncio.data_inicio && new Date(anuncio.data_inicio) > now) return false;
    if (anuncio.data_fim && new Date(anuncio.data_fim) < now) return false;
    return true;
  };

  const filteredAnuncios = anuncios.filter(a =>
    a.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCliques = anuncios.reduce((acc, a) => acc + a.cliques, 0);
  const totalVisualizacoes = anuncios.reduce((acc, a) => acc + a.visualizacoes, 0);
  const ctr = totalVisualizacoes > 0 ? ((totalCliques / totalVisualizacoes) * 100).toFixed(2) : '0';

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Anúncios</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie banners e anúncios exibidos no site
          </p>
        </div>
        <Button onClick={() => navigate('/admin/anuncios/novo')}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Anúncio
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Anúncios</CardDescription>
            <CardTitle className="text-3xl">{anuncios.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ativos</CardDescription>
            <CardTitle className="text-3xl">
              {anuncios.filter(a => isAtivo(a)).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Cliques</CardDescription>
            <CardTitle className="text-3xl">{totalCliques}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>CTR Médio</CardDescription>
            <CardTitle className="text-3xl">{ctr}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Anúncios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Anúncios</CardTitle>
          <CardDescription>
            {filteredAnuncios.length} anúncio(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Posição</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnuncios.map((anuncio) => (
                <TableRow key={anuncio.id}>
                  <TableCell className="font-medium">
                    {anuncio.titulo}
                    {anuncio.destaque && (
                      <Star className="w-4 h-4 inline ml-2 text-yellow-500 fill-yellow-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getTipoLabel(anuncio.tipo)}</Badge>
                  </TableCell>
                  <TableCell>{getPosicaoLabel(anuncio.posicao)}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {anuncio.data_inicio && (
                        <div>Início: {format(new Date(anuncio.data_inicio), 'dd/MM/yyyy', { locale: ptBR })}</div>
                      )}
                      {anuncio.data_fim && (
                        <div>Fim: {format(new Date(anuncio.data_fim), 'dd/MM/yyyy', { locale: ptBR })}</div>
                      )}
                      {!anuncio.data_inicio && !anuncio.data_fim && (
                        <span className="text-muted-foreground">Permanente</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {anuncio.visualizacoes}
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart className="w-3 h-3" />
                        {anuncio.cliques}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={isAtivo(anuncio) ? 'default' : 'secondary'}>
                      {isAtivo(anuncio) ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleAtivo(anuncio.id, anuncio.ativo)}
                        title={anuncio.ativo ? 'Desativar' : 'Ativar'}
                      >
                        {anuncio.ativo ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/anuncios/editar/${anuncio.id}`)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(anuncio.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAnuncios.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum anúncio encontrado
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
              Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.
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
