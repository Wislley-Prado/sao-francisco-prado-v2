import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Eye, EyeOff, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Rancho {
  id: string;
  nome: string;
  descricao: string;
  localizacao: string;
  capacidade: number;
  preco: number;
  rating: number;
  quartos: number;
  banheiros: number;
  area: number;
  comodidades: string[];
  disponivel: boolean;
  destaque: boolean;
  slug: string;
}

export const AdminRanchos = () => {
  const [selectedRancho, setSelectedRancho] = useState<Rancho | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ranchos, isLoading } = useQuery({
    queryKey: ['admin-ranchos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ranchos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Rancho[];
    },
  });

  const toggleDisponibilidadeMutation = useMutation({
    mutationFn: async ({ id, disponivel }: { id: string; disponivel: boolean }) => {
      const { error } = await supabase
        .from('ranchos')
        .update({ disponivel })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ranchos'] });
      toast({
        title: "Status atualizado",
        description: "A disponibilidade do rancho foi alterada com sucesso.",
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

  const toggleDestaqueMutation = useMutation({
    mutationFn: async ({ id, destaque }: { id: string; destaque: boolean }) => {
      const { error } = await supabase
        .from('ranchos')
        .update({ destaque })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ranchos'] });
      toast({
        title: "Destaque atualizado",
        description: "O status de destaque foi alterado com sucesso.",
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
          <h2 className="text-3xl font-bold tracking-tight">Ranchos</h2>
          <p className="text-muted-foreground">
            Gerencie os ranchos disponíveis para hospedagem
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Rancho
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ranchos?.map((rancho) => (
          <Card key={rancho.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{rancho.nome}</CardTitle>
                  <CardDescription className="text-sm">
                    {rancho.localizacao}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{rancho.rating}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {rancho.descricao}
              </p>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Capacidade: {rancho.capacidade} pessoas</div>
                <div>Preço: R$ {rancho.preco}/noite</div>
                <div>Quartos: {rancho.quartos}</div>
                <div>Banheiros: {rancho.banheiros}</div>
              </div>

              <div className="flex flex-wrap gap-1">
                {rancho.comodidades?.slice(0, 3).map((comodidade) => (
                  <Badge key={comodidade} variant="secondary" className="text-xs">
                    {comodidade}
                  </Badge>
                ))}
                {rancho.comodidades?.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{rancho.comodidades.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Badge variant={rancho.disponivel ? "default" : "secondary"}>
                    {rancho.disponivel ? "Disponível" : "Indisponível"}
                  </Badge>
                  {rancho.destaque && (
                    <Badge variant="outline">Destaque</Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleDisponibilidadeMutation.mutate({
                    id: rancho.id,
                    disponivel: !rancho.disponivel
                  })}
                >
                  {rancho.disponivel ? (
                    <EyeOff className="h-4 w-4 mr-1" />
                  ) : (
                    <Eye className="h-4 w-4 mr-1" />
                  )}
                  {rancho.disponivel ? "Ocultar" : "Mostrar"}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleDestaqueMutation.mutate({
                    id: rancho.id,
                    destaque: !rancho.destaque
                  })}
                >
                  <Star className={`h-4 w-4 mr-1 ${rancho.destaque ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  Destaque
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

      {(!ranchos || ranchos.length === 0) && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhum rancho cadastrado ainda.
            </p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Primeiro Rancho
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};