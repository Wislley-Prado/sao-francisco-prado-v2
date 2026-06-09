import { useState, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, X, Plus, Upload, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { compressImages } from '@/utils/imageCompression';
import { invalidateCacheByPrefix } from '@/lib/cacheService';
import { CoordenadasHelper } from '@/components/admin/shared/CoordenadasHelper';

const propriedadeSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  slug: z.string().min(3, 'Slug deve ter no mínimo 3 caracteres'),
  descricao: z.string().optional().or(z.literal('')),
  tipo: z.string().min(1, 'Selecione o tipo de propriedade'),
  localizacao: z.string().min(3, 'Localização é obrigatória'),
  preco: z.number().min(0.01, 'Preço deve ser maior que zero'),
  area: z.number().optional().or(z.literal('')),
  unidade_area: z.string().default('hectares'),
  telefone_contato: z.string().optional().or(z.literal('')),
  whatsapp_contato: z.string().optional().or(z.literal('')),
  ativo: z.boolean().default(true),
  destaque: z.boolean().default(false),
  ordem: z.number().default(0),
  caracteristicaCustom: z.string().optional(),
  latitude: z.string().optional().or(z.literal('')),
  longitude: z.string().optional().or(z.literal('')),
  video_youtube: z.string().optional().or(z.literal('')),
  texto_botao_whatsapp: z.string().optional().or(z.literal('')),
  mensagem_whatsapp: z.string().optional().or(z.literal('')),
});

type PropriedadeFormData = z.infer<typeof propriedadeSchema>;

export interface PropriedadeVendaData {
  id?: string;
  titulo?: string;
  slug?: string;
  descricao?: string;
  tipo?: string;
  localizacao?: string;
  preco?: number;
  area?: number | null;
  unidade_area?: string;
  telefone_contato?: string;
  whatsapp_contato?: string;
  ativo?: boolean;
  destaque?: boolean;
  ordem?: number;
  imagens?: string[] | null;
  caracteristicas?: string[] | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  video_youtube?: string | null;
  texto_botao_whatsapp?: string | null;
  mensagem_whatsapp?: string | null;
}

interface PropriedadeVendaFormProps {
  propriedade?: PropriedadeVendaData | null;
  onSuccess: () => void;
}

export const PropriedadeVendaForm = ({ propriedade, onSuccess }: PropriedadeVendaFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagens, setImagens] = useState<string[]>(propriedade?.imagens || []);
  const [caracteristicas, setCaracteristicas] = useState<string[]>(propriedade?.caracteristicas || []);

  const form = useForm<PropriedadeFormData>({
    resolver: zodResolver(propriedadeSchema),
    defaultValues: {
      titulo: propriedade?.titulo || '',
      slug: propriedade?.slug || '',
      descricao: propriedade?.descricao || '',
      tipo: propriedade?.tipo || 'lote',
      localizacao: propriedade?.localizacao || '',
      preco: propriedade?.preco ? Number(propriedade.preco) : 0,
      area: propriedade?.area ? Number(propriedade.area) : '',
      unidade_area: propriedade?.unidade_area || 'hectares',
      telefone_contato: propriedade?.telefone_contato || '',
      whatsapp_contato: propriedade?.whatsapp_contato || '',
      ativo: propriedade?.ativo ?? true,
      destaque: propriedade?.destaque ?? false,
      ordem: propriedade?.ordem ?? 0,
      caracteristicaCustom: '',
      latitude: propriedade?.latitude?.toString() || '',
      longitude: propriedade?.longitude?.toString() || '',
      video_youtube: propriedade?.video_youtube || '',
      texto_botao_whatsapp: propriedade?.texto_botao_whatsapp || '',
      mensagem_whatsapp: propriedade?.mensagem_whatsapp || '',
    },
  });

  const generateSlug = (titulo: string) => {
    return titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const compressedFiles = await compressImages(files, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.85,
        maxSizeMB: 1,
      });

      const uploadedUrls: string[] = [];
      const tempId = propriedade?.id || crypto.randomUUID();

      for (const file of compressedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${tempId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('propriedades-venda')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('propriedades-venda')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setImagens((prev) => [...prev, ...uploadedUrls]);
      toast.success(`${compressedFiles.length} imagem(ns) enviada(s) com sucesso!`);
    } catch (error) {
      console.error('Error uploading images:', error);
      const errMsg = (error as { message?: string })?.message || '';
      if (errMsg.toLowerCase().includes('bucket not found') || errMsg.toLowerCase().includes('no such bucket')) {
        toast.error(
          '⚠️ Bucket de armazenamento "propriedades-venda" não encontrado. Execute o SQL "create-storage-bucket.sql" no Supabase Dashboard.',
          { duration: 10000 }
        );
      } else if (errMsg.includes('403') || errMsg.toLowerCase().includes('unauthorized') || errMsg.toLowerCase().includes('policy')) {
        toast.error(
          '⚠️ Sem permissão para enviar imagens. Crie as políticas RLS do bucket "propriedades-venda" no Supabase.',
          { duration: 8000 }
        );
      } else if (errMsg.toLowerCase().includes('size') || errMsg.toLowerCase().includes('exceeded')) {
        toast.error('Imagem muito grande. Tamanho máximo: 10MB.', { duration: 5000 });
      } else {
        toast.error(`Erro ao enviar imagem: ${errMsg || 'Erro desconhecido. Veja o console.'}`, { duration: 6000 });
      }
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImagens((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const addCaracteristica = () => {
    const value = form.getValues('caracteristicaCustom')?.trim();
    if (value) {
      if (!caracteristicas.includes(value)) {
        setCaracteristicas((prev) => [...prev, value]);
      }
      form.setValue('caracteristicaCustom', '');
    }
  };

  const removeCaracteristica = (itemToRemove: string) => {
    setCaracteristicas((prev) => prev.filter((item) => item !== itemToRemove));
  };

  const onSubmit = async (data: PropriedadeFormData) => {
    setIsSubmitting(true);

    try {
      const payload = {
        titulo: data.titulo,
        slug: data.slug,
        descricao: data.descricao || null,
        tipo: data.tipo,
        localizacao: data.localizacao,
        preco: data.preco,
        area: data.area !== '' && data.area !== undefined ? Number(data.area) : null,
        unidade_area: data.unidade_area,
        telefone_contato: data.telefone_contato || null,
        whatsapp_contato: data.whatsapp_contato || null,
        ativo: data.ativo,
        destaque: data.destaque,
        ordem: data.ordem,
        imagens: imagens,
        caracteristicas: caracteristicas,
        latitude: data.latitude && data.latitude.trim() !== '' ? parseFloat(data.latitude) : null,
        longitude: data.longitude && data.longitude.trim() !== '' ? parseFloat(data.longitude) : null,
        video_youtube: data.video_youtube || null,
        texto_botao_whatsapp: data.texto_botao_whatsapp || null,
        mensagem_whatsapp: data.mensagem_whatsapp || null,
      };

      if (propriedade?.id) {
        // Update
        const { error } = await supabase
          .from('propriedades_venda')
          .update(payload)
          .eq('id', propriedade.id);

        if (error) throw error;
        toast.success('Propriedade atualizada com sucesso!');
      } else {
        // Create
        const { error } = await supabase
          .from('propriedades_venda')
          .insert(payload);

        if (error) throw error;
        toast.success('Propriedade cadastrada com sucesso!');
      }

      // Invalidate frontend cache
      invalidateCacheByPrefix('propriedades_venda');

      onSuccess();
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Erro ao salvar propriedade.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basico" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto gap-1">
            <TabsTrigger value="basico">Básico</TabsTrigger>
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            <TabsTrigger value="caracteristicas">Características</TabsTrigger>
            <TabsTrigger value="imagens">Imagens ({imagens.length})</TabsTrigger>
          </TabsList>

          {/* TAB: BÁSICO */}
          <TabsContent value="basico" className="space-y-4 mt-6">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título / Nome do Anúncio *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (!propriedade) {
                          form.setValue('slug', generateSlug(e.target.value));
                        }
                      }}
                      placeholder="Ex: Lote na Beira do Rio São Francisco"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (URL) *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="lote-na-beira-do-rio" />
                  </FormControl>
                  <FormDescription>Identificador único na URL (gerado automaticamente)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Completa</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={5}
                      placeholder="Descreva detalhes como topografia, proximidade da água, infraestrutura..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Propriedade *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lote">Lote</SelectItem>
                        <SelectItem value="terreno">Terreno</SelectItem>
                        <SelectItem value="rancho">Rancho à Venda</SelectItem>
                        <SelectItem value="chacara">Chácara</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="localizacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Represa de Três Marias, MG" />
                    </FormControl>
                    <FormDescription>Use "Rio" ou "Represa" para as tags automáticas do card</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          {/* TAB: DETALHES */}
          <TabsContent value="detalhes" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="preco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço de Venda (R$) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área do Imóvel</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Ex: 1500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unidade_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade de Medida</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hectares">Hectares</SelectItem>
                        <SelectItem value="m²">Metros Quadrados (m²)</SelectItem>
                        <SelectItem value="alqueires">Alqueires</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="whatsapp_contato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp para Lead</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: 5538999999999" />
                    </FormControl>
                    <FormDescription>Apenas números com código do país e DDD (Ex: 5538999999999)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefone_contato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone Fixo / Alternativo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: (38) 3754-0000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <FormField
                control={form.control}
                name="texto_botao_whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto do Botão do WhatsApp</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Saber Mais, Falar com Corretor" />
                    </FormControl>
                    <FormDescription>Texto exibido nos botões do WhatsApp da propriedade (padrão: "WhatsApp" ou "Saber Mais")</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mensagem_whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem Personalizada do WhatsApp</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Olá! Tenho interesse no {titulo}" />
                    </FormControl>
                    <FormDescription>Mensagem pré-preenchida no WhatsApp. Use tags de auto-preenchimento como <strong>{"{titulo}"}</strong> ou <strong>{"{localizacao}"}</strong>.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: -16.12345" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: -45.67890" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CoordenadasHelper
              onCoordenadasExtraidas={(lat, lng) => {
                form.setValue('latitude', lat.toString());
                form.setValue('longitude', lng.toString());
              }}
            />

            <div className="border-t pt-4">
              <FormField
                control={form.control}
                name="video_youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vídeo YouTube (Shorts)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://youtube.com/shorts/..." />
                    </FormControl>
                    <FormDescription>
                      Cole o link completo do YouTube Shorts para mostrar o vídeo do imóvel
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <FormField
                control={form.control}
                name="ordem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordem de Exibição</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ativo"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0 pt-8">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0 cursor-pointer">Anúncio Ativo</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destaque"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0 pt-8">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0 cursor-pointer flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-amber-500 fill-current" />
                      Destaque na Home
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          {/* TAB: CARACTERÍSTICAS */}
          <TabsContent value="caracteristicas" className="space-y-4 mt-6">
            <FormField
              control={form.control}
              name="caracteristicaCustom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adicionar Características (Tags)</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: Energia elétrica, Água encanada, Acesso ao Rio"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCaracteristica();
                          }
                        }}
                      />
                    </FormControl>
                    <Button type="button" variant="outline" onClick={addCaracteristica}>
                      <Plus className="h-4 w-4 mr-1" /> Adicionar
                    </Button>
                  </div>
                  <FormDescription>Escreva e clique no botão ou pressione Enter</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Características Cadastradas</Label>
              {caracteristicas.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Nenhuma característica adicionada.</p>
              ) : (
                <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-gray-50">
                  {caracteristicas.map((char) => (
                    <Badge key={char} variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm bg-white">
                      {char}
                      <button
                        type="button"
                        onClick={() => removeCaracteristica(char)}
                        className="ml-1 text-gray-400 hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB: IMAGENS */}
          <TabsContent value="imagens" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <Label>Enviar Novas Imagens</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Selecione fotos do seu computador. Elas serão otimizadas e enviadas para o Supabase Storage.
                </p>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('prop-file-input')?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Selecionar Imagens
                      </>
                    )}
                  </Button>
                  <input
                    id="prop-file-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Lista de URLs das Imagens (ou digite/cole manualmente)</Label>
                <Textarea
                  value={imagens.join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n');
                    setImagens(lines.filter(line => line.trim() !== ''));
                  }}
                  rows={4}
                  placeholder="https://exemplo.com/imagem.jpg (Uma URL por linha)"
                />
                <FormDescription>
                  Você pode colar URLs diretamente ou usar o botão acima para carregar arquivos. A primeira imagem da lista será a capa.
                </FormDescription>
              </div>

              {imagens.length > 0 && (
                <div className="space-y-2">
                  <Label>Preview / Galeria de Imagens ({imagens.length})</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
                    {imagens.map((url, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border bg-white aspect-video flex items-center justify-center">
                        <img
                          src={url}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded font-semibold shadow">
                            Capa
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="bg-primary text-white"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {propriedade ? 'Salvar Alterações' : 'Criar Oportunidade'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
