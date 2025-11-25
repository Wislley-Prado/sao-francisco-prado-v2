import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUploader } from '@/components/admin/propriedade/ImageUploader';

export default function PropriedadeVendaEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    slug: '',
    descricao: '',
    tipo: 'terreno',
    localizacao: 'velho_chico',
    area: '',
    unidade_area: 'hectares',
    preco: '',
    telefone_contato: '',
    whatsapp_contato: '',
    latitude: '',
    longitude: '',
    ativo: true,
    destaque: false,
    ordem: 0
  });
  const [caracteristicas, setCaracteristicas] = useState<string[]>([]);
  const [novaCaracteristica, setNovaCaracteristica] = useState('');
  const [imagens, setImagens] = useState<string[]>([]);

  useEffect(() => {
    fetchPropriedade();
  }, [id]);

  const fetchPropriedade = async () => {
    try {
      const { data, error } = await supabase
        .from('propriedades_venda')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          titulo: data.titulo || '',
          slug: data.slug || '',
          descricao: data.descricao || '',
          tipo: data.tipo || 'terreno',
          localizacao: data.localizacao || 'velho_chico',
          area: data.area?.toString() || '',
          unidade_area: data.unidade_area || 'hectares',
          preco: data.preco?.toString() || '',
          telefone_contato: data.telefone_contato || '',
          whatsapp_contato: data.whatsapp_contato || '',
          latitude: data.latitude?.toString() || '',
          longitude: data.longitude?.toString() || '',
          ativo: data.ativo ?? true,
          destaque: data.destaque ?? false,
          ordem: data.ordem || 0
        });
        setCaracteristicas(data.caracteristicas || []);
        setImagens(data.imagens || []);
      }
    } catch (error) {
      console.error('Erro ao buscar propriedade:', error);
      toast.error('Erro ao carregar propriedade');
      navigate('/admin/propriedades-venda');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTituloChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      titulo: value,
      slug: generateSlug(value)
    }));
  };

  const addCaracteristica = () => {
    if (novaCaracteristica.trim()) {
      setCaracteristicas([...caracteristicas, novaCaracteristica.trim()]);
      setNovaCaracteristica('');
    }
  };

  const removeCaracteristica = (index: number) => {
    setCaracteristicas(caracteristicas.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('propriedades_venda')
        .update({
          ...formData,
          area: parseFloat(formData.area),
          preco: parseFloat(formData.preco),
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          caracteristicas,
          imagens
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Propriedade atualizada com sucesso!');
      navigate('/admin/propriedades-venda');
    } catch (error) {
      console.error('Erro ao atualizar propriedade:', error);
      toast.error('Erro ao atualizar propriedade');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/propriedades-venda')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Editar Propriedade</h1>
          <p className="text-muted-foreground mt-1">
            Atualize as informações da propriedade
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados principais da propriedade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => handleTituloChange(e.target.value)}
                    required
                    placeholder="Ex: Terreno 5 hectares beira do rio"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    placeholder="terreno-5-hectares-beira-rio"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={4}
                  placeholder="Descreva a propriedade, sua localização, diferenciais..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="terreno">Terreno</SelectItem>
                      <SelectItem value="rancho">Rancho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="localizacao">Localização *</Label>
                  <Select
                    value={formData.localizacao}
                    onValueChange={(value) => setFormData({ ...formData, localizacao: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="velho_chico">Velho Chico</SelectItem>
                      <SelectItem value="represa">Represa</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Área e Preço */}
          <Card>
            <CardHeader>
              <CardTitle>Dimensões e Valores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Área *</Label>
                  <Input
                    id="area"
                    type="number"
                    step="0.01"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    required
                    placeholder="5.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unidade_area">Unidade</Label>
                  <Select
                    value={formData.unidade_area}
                    onValueChange={(value) => setFormData({ ...formData, unidade_area: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hectares">Hectares</SelectItem>
                      <SelectItem value="m2">m²</SelectItem>
                      <SelectItem value="alqueires">Alqueires</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço (R$) *</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    required
                    placeholder="250000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card>
            <CardHeader>
              <CardTitle>Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone_contato">Telefone</Label>
                  <Input
                    id="telefone_contato"
                    value={formData.telefone_contato}
                    onChange={(e) => setFormData({ ...formData, telefone_contato: e.target.value })}
                    placeholder="(31) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_contato">WhatsApp</Label>
                  <Input
                    id="whatsapp_contato"
                    value={formData.whatsapp_contato}
                    onChange={(e) => setFormData({ ...formData, whatsapp_contato: e.target.value })}
                    placeholder="5531999999999"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coordenadas */}
          <Card>
            <CardHeader>
              <CardTitle>Localização GPS (Opcional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="-19.123456"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="-45.123456"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Características */}
          <Card>
            <CardHeader>
              <CardTitle>Características</CardTitle>
              <CardDescription>Diferenciais e comodidades da propriedade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={novaCaracteristica}
                  onChange={(e) => setNovaCaracteristica(e.target.value)}
                  placeholder="Ex: Beira do rio, Energia elétrica, Acesso asfaltado"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCaracteristica())}
                />
                <Button type="button" onClick={addCaracteristica}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {caracteristicas.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full"
                  >
                    <span className="text-sm">{item}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
                      onClick={() => removeCaracteristica(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Imagens */}
          <Card>
            <CardHeader>
              <CardTitle>Imagens</CardTitle>
              <CardDescription>Faça upload das fotos da propriedade</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                images={imagens}
                onImagesChange={setImagens}
                maxImages={10}
              />
            </CardContent>
          </Card>

          {/* Configurações */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="ativo">Propriedade Ativa</Label>
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="destaque">Destaque na Home</Label>
                <Switch
                  id="destaque"
                  checked={formData.destaque}
                  onCheckedChange={(checked) => setFormData({ ...formData, destaque: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ordem">Ordem de Exibição</Label>
                <Input
                  id="ordem"
                  type="number"
                  value={formData.ordem}
                  onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/propriedades-venda')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
