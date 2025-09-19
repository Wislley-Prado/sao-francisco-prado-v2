import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Eye, EyeOff, Star, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Pacote {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao: string;
  pessoas: number;
  rating: number;
  caracteristicas: string[];
  inclusos: string[];
  ativo: boolean;
  popular: boolean;
  destaque: boolean;
  slug: string;
  tipo: string;
}

export const AdminPacotes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pacotes, isLoading } = useQuery({
    queryKey: ['admin-pacotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pacotes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Pacote[];
    },
  });

  const toggleAtivoMutation = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase
        .from('pacotes')
        .update({ ativo })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pacotes'] });
      toast({
        title: "Status atualizado",
        description: "O status do pacote foi alterado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const togglePopularMutation = useMutation({
    mutationFn: async ({ id, popular }: { id: string; popular: boolean }) => {
      const { error } = await supabase
        .from('pacotes')
        .update({ popular })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pacotes'] });
      toast({
        title: "Status popular atualizado",
        description: "O status de popularidade foi alterado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pacotes</h2>
          <p className="text-muted-foreground">
            Gerencie os pacotes de pesca e hospedagem
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Pacote
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pacotes?.map((pacote) => (
          <Card key={pacote.id} className="relative">
            {pacote.popular && (
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                Mais Popular
              </div>
            )}
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{pacote.nome}</CardTitle>
                  <CardDescription className="text-sm">
                    {pacote.tipo.charAt(0).toUpperCase() + pacote.tipo.slice(1)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{pacote.rating}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {pacote.descricao}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-primary">
                  R$ {pacote.preco.toLocaleString('pt-BR')}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {pacote.duracao}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {pacote.pessoas} pessoas
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Características:</h4>
                <div className="flex flex-wrap gap-1">
                  {pacote.caracteristicas?.slice(0, 3).map((caracteristica) => (
                    <Badge key={caracteristica} variant="secondary" className="text-xs">
                      {caracteristica}
                    </Badge>
                  ))}
                  {pacote.caracteristicas?.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{pacote.caracteristicas.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Badge variant={pacote.ativo ? "default" : "secondary"}>
                    {pacote.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                  {pacote.popular && (
                    <Badge variant="outline">Popular</Badge>
                  )}
                  {pacote.destaque && (
                    <Badge variant="outline">Destaque</Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAtivoMutation.mutate({
                    id: pacote.id,
                    ativo: !pacote.ativo
                  })}
                >
                  {pacote.ativo ? (
                    <EyeOff className="h-4 w-4 mr-1" />
                  ) : (
                    <Eye className="h-4 w-4 mr-1" />
                  )}
                  {pacote.ativo ? "Ocultar" : "Mostrar"}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePopularMutation.mutate({
                    id: pacote.id,
                    popular: !pacote.popular
                  })}
                >
                  <Star className={`h-4 w-4 mr-1 ${pacote.popular ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  Popular
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

      {(!pacotes || pacotes.length === 0) && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhum pacote cadastrado ainda.
            </p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Primeiro Pacote
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};