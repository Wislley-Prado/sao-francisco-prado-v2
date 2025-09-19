import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Configuracao {
  id: string;
  chave: string;
  valor: string;
  tipo: string;
  descricao: string;
}

export const AdminConfiguracoes = () => {
  const [configuracoes, setConfiguracoes] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: configData, isLoading } = useQuery({
    queryKey: ['admin-configuracoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .order('chave', { ascending: true });
      
      if (error) throw error;
      
      // Converter array em objeto para facilitar o uso
      const configObj: Record<string, string> = {};
      data.forEach((config: Configuracao) => {
        configObj[config.chave] = config.valor || '';
      });
      
      setConfiguracoes(configObj);
      return data as Configuracao[];
    },
  });

  const salvarConfiguracoesMutation = useMutation({
    mutationFn: async (configuracoesParaSalvar: Record<string, string>) => {
      const updates = Object.entries(configuracoesParaSalvar).map(([chave, valor]) => ({
        chave,
        valor,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('configuracoes')
          .update({ valor: update.valor })
          .eq('chave', update.chave);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-configuracoes'] });
      toast({
        title: "Configurações salvas",
        description: "As configurações foram atualizadas com sucesso.",
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

  const handleInputChange = (chave: string, valor: string) => {
    setConfiguracoes(prev => ({
      ...prev,
      [chave]: valor
    }));
  };

  const handleSalvar = () => {
    salvarConfiguracoesMutation.mutate(configuracoes);
  };

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
          <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Configure as informações gerais do site
          </p>
        </div>
        <Button 
          onClick={handleSalvar}
          disabled={salvarConfiguracoesMutation.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {salvarConfiguracoesMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
            <CardDescription>
              Configure as informações principais do site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_nome">Nome do Site</Label>
              <Input
                id="site_nome"
                value={configuracoes.site_nome || ''}
                onChange={(e) => handleInputChange('site_nome', e.target.value)}
                placeholder="Rancho Prado Aqui"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site_descricao">Descrição do Site</Label>
              <Textarea
                id="site_descricao"
                value={configuracoes.site_descricao || ''}
                onChange={(e) => handleInputChange('site_descricao', e.target.value)}
                placeholder="A melhor experiência de pesca no Rio São Francisco"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={configuracoes.endereco || ''}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                placeholder="Prado, MG - Rio São Francisco"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contato</CardTitle>
            <CardDescription>
              Configure as informações de contato
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp_numero">Número do WhatsApp</Label>
              <Input
                id="whatsapp_numero"
                value={configuracoes.whatsapp_numero || ''}
                onChange={(e) => handleInputChange('whatsapp_numero', e.target.value)}
                placeholder="5534999999999"
              />
              <p className="text-xs text-muted-foreground">
                Formato: código do país + DDD + número (sem espaços ou símbolos)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email_contato">Email de Contato</Label>
              <Input
                id="email_contato"
                type="email"
                value={configuracoes.email_contato || ''}
                onChange={(e) => handleInputChange('email_contato', e.target.value)}
                placeholder="contato@ranchopradoaqui.com.br"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Valores Atuais</CardTitle>
          <CardDescription>
            Visualize todas as configurações atuais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {configData?.map((config) => (
              <div key={config.id} className="p-3 border rounded-lg">
                <div className="font-medium text-sm">{config.descricao}</div>
                <div className="text-xs text-muted-foreground mb-2">
                  Chave: {config.chave}
                </div>
                <div className="text-sm bg-gray-50 p-2 rounded">
                  {config.valor || '(não definido)'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};