import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { PropriedadeVendaForm } from '@/components/admin/propriedade/PropriedadeVendaForm';
import { supabase } from '@/integrations/supabase/client';

const PropriedadeVendaEditar = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch property details
  const { data: propriedade, isLoading } = useQuery({
    queryKey: ['admin-propriedade-venda', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('propriedades_venda')
        .select('id, titulo, titulo_en, slug, descricao, descricao_en, tipo, localizacao, localizacao_en, preco, area, unidade_area, latitude, longitude, imagens, caracteristicas, telefone_contato, whatsapp_contato, ativo, destaque, ordem, texto_botao_whatsapp, mensagem_whatsapp, video_youtube, created_at, updated_at')
        .eq('id', id)
        .single();

      if (error) throw error;
      return {
        ...data,
        preco: Number(data.preco),
        area: data.area ? Number(data.area) : null
      };
    },
    enabled: !!id,
  });

  const handleSuccess = () => {
    navigate('/admin/vendas');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/vendas')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Editar Oportunidade à Venda</h1>
          <p className="text-muted-foreground mt-1">
            Atualize as informações e mídias do lote, terreno ou rancho
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Propriedade</CardTitle>
          <CardDescription>
            Edite as informações correspondentes ao cadastro
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Carregando dados...</span>
            </div>
          ) : propriedade ? (
            <PropriedadeVendaForm propriedade={propriedade} onSuccess={handleSuccess} />
          ) : (
            <div className="text-center py-12 text-sm text-red-500 font-semibold">
              Erro: Propriedade não encontrada.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropriedadeVendaEditar;
