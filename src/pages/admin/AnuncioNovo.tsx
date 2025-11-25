import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import { ImageUploader } from '@/components/admin/anuncio/ImageUploader';
import { AnuncioTemplates } from '@/components/admin/anuncio/AnuncioTemplates';

export default function AnuncioNovo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(undefined);
  
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    descricao: '',
    imagem_url: '',
    link_url: '',
    texto_botao: 'Saiba Mais',
    tipo: 'banner_principal',
    posicao: 'topo',
    ativo: true,
    destaque: false,
    ordem: 0,
    duracao_exibicao: 8,
    data_inicio: '',
    data_fim: '',
  });

  const handleTemplateSelect = (config: any) => {
    setFormData({
      ...formData,
      tipo: config.tipo,
      posicao: config.posicao,
      duracao_exibicao: config.duracao_exibicao,
      ordem: config.ordem,
      texto_botao: config.texto_botao,
    });
    setSelectedTemplate(config.tipo + '_' + config.posicao);
    toast.success('Template aplicado! Agora adicione título e imagem.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo || !formData.imagem_url) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('anuncios').insert({
        titulo: formData.titulo,
        subtitulo: formData.subtitulo || null,
        descricao: formData.descricao || null,
        imagem_url: formData.imagem_url,
        link_url: formData.link_url || null,
        texto_botao: formData.texto_botao,
        tipo: formData.tipo,
        posicao: formData.posicao,
        ativo: formData.ativo,
        destaque: formData.destaque,
        ordem: formData.ordem,
        duracao_exibicao: formData.duracao_exibicao,
        data_inicio: formData.data_inicio || null,
        data_fim: formData.data_fim || null,
      });

      if (error) throw error;

      toast.success('Anúncio criado com sucesso!');
      navigate('/admin/anuncios');
    } catch (error) {
      console.error('Erro ao criar anúncio:', error);
      toast.error('Erro ao criar anúncio');
    } finally {
      setLoading(false);
    }
  };

  const renderManualConfig = () => (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Manuais</CardTitle>
        <CardDescription>Configure o anúncio do zero</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="banner_principal">Banner Principal</SelectItem>
                <SelectItem value="card_secundario">Card Secundário</SelectItem>
                <SelectItem value="full_width">Largura Total</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="posicao">Posição</Label>
            <Select value={formData.posicao} onValueChange={(value) => setFormData({ ...formData, posicao: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="topo">Topo</SelectItem>
                <SelectItem value="meio">Meio</SelectItem>
                <SelectItem value="rodape">Rodapé</SelectItem>
                <SelectItem value="sidebar">Lateral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ordem">Ordem</Label>
            <Input
              id="ordem"
              type="number"
              value={formData.ordem}
              onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duracao_exibicao">Duração (segundos)</Label>
            <Input
              id="duracao_exibicao"
              type="number"
              value={formData.duracao_exibicao}
              onChange={(e) => setFormData({ ...formData, duracao_exibicao: parseInt(e.target.value) || 8 })}
              min="3"
              max="60"
              placeholder="8"
            />
            <p className="text-xs text-muted-foreground">
              Tempo que o anúncio fica visível na rotação (3-60s)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/anuncios')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Novo Anúncio</h1>
          <p className="text-muted-foreground">Criar um novo anúncio para o site</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="template" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="template" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="manual">Configuração Manual</TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="space-y-6">
            <AnuncioTemplates 
              onSelectTemplate={handleTemplateSelect}
              selectedTemplate={selectedTemplate}
            />
          </TabsContent>

          <TabsContent value="manual" className="space-y-6">
            {renderManualConfig()}
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Conteúdo do Anúncio</CardTitle>
            <CardDescription>Preencha as informações que serão exibidas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Título do anúncio"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitulo">Subtítulo</Label>
                <Input
                  id="subtitulo"
                  value={formData.subtitulo}
                  onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                  placeholder="Subtítulo opcional"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição do anúncio"
                rows={4}
              />
            </div>

            <ImageUploader
              value={formData.imagem_url}
              onChange={(url) => setFormData({ ...formData, imagem_url: url || '' })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="link_url">URL do Link</Label>
                <Input
                  id="link_url"
                  type="url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="texto_botao">Texto do Botão</Label>
                <Input
                  id="texto_botao"
                  value={formData.texto_botao}
                  onChange={(e) => setFormData({ ...formData, texto_botao: e.target.value })}
                  placeholder="Saiba Mais"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="data_inicio">Data Início</Label>
                <Input
                  id="data_inicio"
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_fim">Data Fim</Label>
                <Input
                  id="data_fim"
                  type="date"
                  value={formData.data_fim}
                  onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
                <Label htmlFor="ativo">Ativo</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="destaque"
                  checked={formData.destaque}
                  onCheckedChange={(checked) => setFormData({ ...formData, destaque: checked })}
                />
                <Label htmlFor="destaque">Destaque</Label>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/anuncios')}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>Salvando...</>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Anúncio
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
