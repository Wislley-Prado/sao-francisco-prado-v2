import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Eye, EyeOff, Package, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  slug: string;
  ativo: boolean;
  ordem: number;
}

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  preco_promocional: number;
  categoria_id: string;
  ativo: boolean;
  destaque: boolean;
  estoque: number;
  tags: string[];
  slug: string;
  categorias: Categoria;
}

export const AdminLoja = () => {
  const [activeTab, setActiveTab] = useState('produtos');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: produtos, isLoading: produtosLoading } = useQuery({
    queryKey: ['admin-produtos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('produtos')
        .select('*, categorias(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Produto[];
    },
  });

  const { data: categorias, isLoading: categoriasLoading } = useQuery({
    queryKey: ['admin-categorias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('ordem', { ascending: true });
      
      if (error) throw error;
      return data as Categoria[];
    },
  });

  const toggleProdutoAtivoMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase
        .from('produtos')
        .update({ ativo })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-produtos'] });
      toast({
        title: "Status atualizado",
        description: "O status do produto foi alterado com sucesso.",
      });
    },
  });

  const toggleCategoriaAtivaMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase
        .from('categorias')
        .update({ ativo })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categorias'] });
      toast({
        title: "Status atualizado",
        description: "O status da categoria foi alterado com sucesso.",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Loja</h2>
        <p className="text-muted-foreground">
          Gerencie produtos e categorias da loja online
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="produtos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Produtos</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </div>

          {produtosLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {produtos?.map((produto) => (
                <Card key={produto.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{produto.nome}</CardTitle>
                        <CardDescription>
                          {produto.categorias?.nome}
                        </CardDescription>
                      </div>
                      <Badge variant={produto.ativo ? "default" : "secondary"}>
                        {produto.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {produto.descricao}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-lg font-bold text-primary">
                          R$ {produto.preco.toFixed(2)}
                        </div>
                        {produto.preco_promocional && (
                          <div className="text-sm text-muted-foreground line-through">
                            R$ {produto.preco_promocional.toFixed(2)}
                          </div>
                        )}
                      </div>
                      <div className="text-sm">
                        Estoque: {produto.estoque}
                      </div>
                    </div>

                    {produto.tags && produto.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {produto.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleProdutoAtivoMutation.mutate({
                          id: produto.id,
                          ativo: !produto.ativo
                        })}
                      >
                        {produto.ativo ? (
                          <EyeOff className="h-4 w-4 mr-1" />
                        ) : (
                          <Eye className="h-4 w-4 mr-1" />
                        )}
                        {produto.ativo ? "Ocultar" : "Mostrar"}
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {(!produtos || produtos.length === 0) && !produtosLoading && (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Nenhum produto cadastrado ainda.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeiro Produto
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="categorias" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Categorias</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </div>

          {categoriasLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categorias?.map((categoria) => (
                <Card key={categoria.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{categoria.nome}</CardTitle>
                        <CardDescription>
                          Ordem: {categoria.ordem}
                        </CardDescription>
                      </div>
                      <Badge variant={categoria.ativo ? "default" : "secondary"}>
                        {categoria.ativo ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {categoria.descricao}
                    </p>
                    
                    <div className="text-sm">
                      <strong>Slug:</strong> {categoria.slug}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCategoriaAtivaMutation.mutate({
                          id: categoria.id,
                          ativo: !categoria.ativo
                        })}
                      >
                        {categoria.ativo ? (
                          <EyeOff className="h-4 w-4 mr-1" />
                        ) : (
                          <Eye className="h-4 w-4 mr-1" />
                        )}
                        {categoria.ativo ? "Ocultar" : "Mostrar"}
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {(!categorias || categorias.length === 0) && !categoriasLoading && (
            <Card>
              <CardContent className="text-center py-8">
                <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Nenhuma categoria cadastrada ainda.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeira Categoria
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};