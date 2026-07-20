import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Search, Edit2, Trash2, Landmark, DollarSign, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { invalidateCacheByPrefix } from '@/lib/cacheService';
import { useInvalidateCache } from '@/hooks/useOptimizedData';

interface Propriedade {
  id: string;
  titulo: string;
  slug: string;
  tipo: string;
  localizacao: string;
  preco: number;
  area: number | null;
  unidade_area: string | null;
  ativo: boolean;
  destaque: boolean;
  imagens: string[] | null;
}

const PropriedadesVenda = () => {
  const navigate = useNavigate();
  const { invalidatePropriedadesVenda } = useInvalidateCache();
  const [search, setSearch] = useState('');

  // Fetch properties from supabase
  const { data: properties, isLoading, refetch } = useQuery<Propriedade[]>({
    queryKey: ['admin-propriedades-venda'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('propriedades_venda')
        .select('id, titulo, titulo_en, slug, descricao, descricao_en, tipo, localizacao, localizacao_en, preco, area, unidade_area, latitude, longitude, imagens, caracteristicas, telefone_contato, whatsapp_contato, ativo, destaque, ordem, texto_botao_whatsapp, mensagem_whatsapp, video_youtube, created_at, updated_at')
        .order('ordem', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(p => ({
        ...p,
        preco: Number(p.preco),
        area: p.area ? Number(p.area) : null
      }));
    },
  });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!properties) return { total: 0, ativos: 0, valorMedio: 0 };
    const total = properties.length;
    const ativos = properties.filter((p) => p.ativo).length;
    const somaValores = properties.reduce((acc, curr) => acc + curr.preco, 0);
    const valorMedio = total > 0 ? somaValores / total : 0;
    return { total, ativos, valorMedio };
  }, [properties]);

  // Toggle active status
  const handleToggleAtivo = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('propriedades_venda')
        .update({ ativo: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success('Status da propriedade atualizado!');
      invalidatePropriedadesVenda();
      refetch();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar status.');
    }
  };

  // Toggle highlight status
  const handleToggleDestaque = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('propriedades_venda')
        .update({ destaque: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success('Destaque atualizado!');
      invalidatePropriedadesVenda();
      refetch();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar destaque.');
    }
  };

  // Delete property
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('propriedades_venda')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Propriedade excluída com sucesso!');
      invalidatePropriedadesVenda();
      refetch();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir propriedade.');
    }
  };

  // Filtered properties
  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    return properties.filter(
      (p) =>
        p.titulo.toLowerCase().includes(search.toLowerCase()) ||
        p.tipo.toLowerCase().includes(search.toLowerCase()) ||
        p.localizacao.toLowerCase().includes(search.toLowerCase())
    );
  }, [properties, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Oportunidades (Venda)</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie lotes, terrenos e ranchos à venda no site
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/vendas/nova">
            <Plus className="w-4 h-4 mr-2" />
            Nova Oportunidade
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cadastrado</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">imóveis cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos no Site</CardTitle>
            <Sparkles className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.ativos}</div>
            <p className="text-xs text-muted-foreground">visíveis para os visitantes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Imóveis Disponíveis</CardTitle>
          <CardDescription>
            Pesquise, edite, altere o status ou remova imóveis à venda
          </CardDescription>
          <div className="flex items-center gap-2 pt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por título, tipo ou localização..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando imóveis...</div>
          ) : filteredProperties.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Imagem</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead className="w-[100px] text-center">Destaque</TableHead>
                    <TableHead className="w-[100px] text-center">Ativo</TableHead>
                    <TableHead className="w-[120px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((prop) => (
                    <TableRow key={prop.id}>
                      <TableCell>
                        {prop.imagens && prop.imagens.length > 0 ? (
                          <img
                            src={prop.imagens[0]}
                            alt={prop.titulo}
                            className="w-12 h-12 object-cover rounded-md border"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-150 rounded-md border flex items-center justify-center text-xs text-muted-foreground font-semibold">
                            S/ Foto
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">{prop.titulo}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize text-xs font-semibold">
                          {prop.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{prop.localizacao}</TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        R$ {prop.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {prop.area ? `${prop.area} ${prop.unidade_area || 'hectares'}` : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={prop.destaque}
                          onCheckedChange={() => handleToggleDestaque(prop.id, prop.destaque)}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={prop.ativo}
                          onCheckedChange={() => handleToggleAtivo(prop.id, prop.ativo)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Ver no site público"
                            onClick={() => {
                              window.open(`/vendas?propriedade=${prop.slug}`, '_blank');
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            title="Editar"
                            onClick={() => navigate(`/admin/vendas/editar/${prop.id}`)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Imóvel?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Você tem certeza que deseja excluir "{prop.titulo}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(prop.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                  Confirmar Exclusão
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="font-semibold text-gray-700">Nenhuma propriedade encontrada</p>
              <p className="text-xs text-muted-foreground mt-1">
                Tente redefinir sua busca ou crie uma nova oportunidade.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropriedadesVenda;
