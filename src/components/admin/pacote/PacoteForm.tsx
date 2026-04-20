import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ImageUploader, ImageFile } from './ImageUploader';
import { YouTubePreview } from '@/components/YouTubePlayer';
import { RichTextEditor } from '@/components/admin/blog/RichTextEditor';
import { CoordenadasHelper } from './CoordenadasHelper';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, X } from 'lucide-react';
import { invalidateCacheByPrefix } from '@/lib/cacheService';

const pacoteSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  slug: z.string().min(3, 'Slug deve ter no mínimo 3 caracteres'),
  descricao: z.string().optional(),
  preco: z.number().min(0.01, 'Preço deve ser maior que zero'),
  duracao: z.string().min(1, 'Duração é obrigatória'),
  pessoas: z.number().min(1, 'Mínimo 1 pessoa'),
  rating: z.number().min(0).max(5),
  tipo: z.enum(['pescaria', 'completo', 'personalizado', 'expedicao', 'curso', 'passeio']),
  ativo: z.boolean(),
  popular: z.boolean(),
  destaque: z.boolean(),
  parcelas_quantidade: z.number().min(1).max(12).optional(),
  parcela_valor: z.number().min(0).optional(),
  desconto_avista: z.number().min(0).max(100).optional(),
  vagas_disponiveis: z.number().min(0).optional(),
  tracking_code: z.string().optional(),
  telefone_whatsapp: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val === '') return true;
        // Validate phone number format (Brazilian format)
        const phoneRegex = /^[1-9]{2}9?[0-9]{8}$/;
        return phoneRegex.test(val.replace(/\D/g, ''));
      },
      {
        message: 'Formato inválido. Use apenas números (DDD + número)',
      }
    ),
  endereco_completo: z.string().optional(),
  latitude: z.number().optional().or(z.string().transform((val) => val ? parseFloat(val) : undefined)),
  longitude: z.number().optional().or(z.string().transform((val) => val ? parseFloat(val) : undefined)),
  video_youtube: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val === '') return true;
        // Validate YouTube URLs (Shorts, regular videos, youtu.be)
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(shorts\/|watch\?v=)|youtu\.be\/)[a-zA-Z0-9_-]{11}.*$/;
        return youtubeRegex.test(val);
      },
      {
        message: 'URL inválida. Use um link válido do YouTube (Shorts, vídeo normal ou youtu.be)',
      }
    ),
});

type PacoteFormData = z.infer<typeof pacoteSchema>;

export interface PacoteData {
  id: string;
  nome?: string;
  slug?: string;
  descricao?: string;
  preco?: number;
  duracao?: string;
  pessoas?: number;
  rating?: number;
  tipo?: 'pescaria' | 'completo' | 'personalizado' | 'expedicao' | 'curso' | 'passeio';
  ativo?: boolean;
  popular?: boolean;
  destaque?: boolean;
  parcelas_quantidade?: number;
  parcela_valor?: number;
  desconto_avista?: number;
  vagas_disponiveis?: number;
  tracking_code?: string;
  telefone_whatsapp?: string;
  endereco_completo?: string;
  latitude?: number | string;
  longitude?: number | string;
  video_youtube?: string;
  caracteristicas?: string[];
  inclusos?: string[];
  pacote_imagens?: Array<{
    id: string;
    url: string;
    principal: boolean;
    alt_text?: string;
    ordem: number;
  }>;
}

interface PacoteFormProps {
  pacote?: PacoteData | null;
  onSuccess: () => void;
}

export const PacoteForm = ({ pacote, onSuccess }: PacoteFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<ImageFile[]>(
    pacote?.pacote_imagens?.map((img: { id: string; url: string; principal: boolean; alt_text?: string; ordem?: number }, index: number) => ({
      id: img.id,
      url: img.url,
      principal: img.principal,
      alt_text: img.alt_text || '',
      ordem: img.ordem || index,
    })) || []
  );
  const [caracteristicas, setCaracteristicas] = useState<string[]>(
    pacote?.caracteristicas || []
  );
  const [novaCaracteristica, setNovaCaracteristica] = useState('');
  const [inclusos, setInclusos] = useState<string[]>(pacote?.inclusos || []);
  const [novoIncluso, setNovoIncluso] = useState('');

  const form = useForm<PacoteFormData>({
    resolver: zodResolver(pacoteSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      nome: pacote?.nome || '',
      slug: pacote?.slug || '',
      descricao: pacote?.descricao || '',
      preco: pacote?.preco ? Number(pacote.preco) : 0,
      duracao: pacote?.duracao || '',
      pessoas: pacote?.pessoas || 2,
      rating: pacote?.rating ? Number(pacote.rating) : 5.0,
      tipo: pacote?.tipo || 'pescaria',
      ativo: pacote?.ativo ?? true,
      popular: pacote?.popular ?? false,
      destaque: pacote?.destaque ?? false,
      parcelas_quantidade: pacote?.parcelas_quantidade || 10,
      parcela_valor: pacote?.parcela_valor ? Number(pacote.parcela_valor) : undefined,
      desconto_avista: pacote?.desconto_avista ? Number(pacote.desconto_avista) : 0,
      vagas_disponiveis: pacote?.vagas_disponiveis || undefined,
      tracking_code: pacote?.tracking_code || '',
      telefone_whatsapp: pacote?.telefone_whatsapp || '',
      endereco_completo: pacote?.endereco_completo || '',
      latitude: pacote?.latitude ? Number(pacote.latitude) : undefined,
      longitude: pacote?.longitude ? Number(pacote.longitude) : undefined,
      video_youtube: pacote?.video_youtube || '',
    },
  });

  const generateSlug = (nome: string) => {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNomeChange = (nome: string) => {
    form.setValue('nome', nome);
    if (!pacote) {
      form.setValue('slug', generateSlug(nome));
    }
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

  const addIncluso = () => {
    if (novoIncluso.trim()) {
      setInclusos([...inclusos, novoIncluso.trim()]);
      setNovoIncluso('');
    }
  };

  const removeIncluso = (index: number) => {
    setInclusos(inclusos.filter((_, i) => i !== index));
  };

  const uploadImages = async (pacoteId: string) => {
    // When editing, handle deletions and updates first to avoid deleting
    // freshly inserted rows later in the process.
    if (pacote) {
      const keepIds = images
        .filter((img) => !img.file && !!img.id)
        .map((img) => img.id);

      if (keepIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('pacote_imagens')
          .delete()
          .eq('pacote_id', pacoteId)
          .not('id', 'in', `(${keepIds.join(',')})`);
        if (deleteError) throw deleteError;
      } else {
        // No existing IDs to keep -> remove all previous DB rows for this pacote
        const { error: deleteAllError } = await supabase
          .from('pacote_imagens')
          .delete()
          .eq('pacote_id', pacoteId);
        if (deleteAllError) throw deleteAllError;
      }

      // Update metadata of existing images that are being kept
      for (const image of images.filter((img) => !img.file)) {
        const { error: updateError } = await supabase
          .from('pacote_imagens')
          .update({
            principal: image.principal,
            alt_text: image.alt_text,
            ordem: image.ordem,
          })
          .eq('id', image.id);
        if (updateError) throw updateError;
      }
    }

    // Now upload and insert any new images
    for (const image of images.filter((img) => !!img.file)) {
      // Sanitize filename: remove spaces, special chars, and accents
      const sanitizedName = image.file!.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9.-]/g, '')
        .toLowerCase();

      const fileName = `${pacoteId}/${Date.now()}-${sanitizedName}`;
      const { error: uploadError } = await supabase.storage
        .from('pacotes')
        .upload(fileName, image.file!);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('pacotes')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('pacote_imagens')
        .insert({
          pacote_id: pacoteId,
          url: publicUrl,
          principal: image.principal,
          alt_text: image.alt_text,
          ordem: image.ordem,
        });
      if (dbError) throw dbError;
    }
  };

  const onSubmit = async (data: PacoteFormData) => {
    if (images.length === 0) {
      toast.error('Adicione pelo menos uma imagem do pacote');
      return;
    }

    if (!images.some((img) => img.principal)) {
      toast.error('Defina uma imagem principal');
      return;
    }

    setIsSubmitting(true);

    try {
      const pacoteData = {
        nome: data.nome,
        slug: data.slug,
        descricao: data.descricao || null,
        preco: data.preco,
        duracao: data.duracao,
        pessoas: data.pessoas,
        rating: data.rating,
        tipo: data.tipo,
        ativo: data.ativo,
        popular: data.popular,
        destaque: data.destaque,
        parcelas_quantidade: data.parcelas_quantidade || 10,
        parcela_valor: data.parcela_valor || null,
        desconto_avista: data.desconto_avista || 0,
        vagas_disponiveis: data.vagas_disponiveis || null,
        tracking_code: data.tracking_code || null,
        video_youtube: data.video_youtube || null,
        telefone_whatsapp: data.telefone_whatsapp || null,
        endereco_completo: data.endereco_completo || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        caracteristicas,
        inclusos,
      };

      if (pacote) {
        const { error } = await supabase
          .from('pacotes')
          .update(pacoteData)
          .eq('id', pacote.id);

        if (error) throw error;

        await uploadImages(pacote.id);
        toast.success('Pacote atualizado com sucesso!');
      } else {
        const { data: newPacote, error } = await supabase
          .from('pacotes')
          .insert([pacoteData])
          .select()
          .single();

        if (error) throw error;

        await uploadImages(newPacote.id);
        toast.success('Pacote criado com sucesso!');
      }

      // Invalida cache para refletir as mudanças imediatamente
      invalidateCacheByPrefix('pacote');
      invalidateCacheByPrefix('pacotes');

      onSuccess();
    } catch (error) {
      const isError = error instanceof Error;
      console.error('Error saving pacote:', error);
      toast.error(isError ? error.message : 'Erro ao salvar pacote');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basico" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basico">Básico</TabsTrigger>
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            <TabsTrigger value="imagens">Imagens</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="basico" className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Pacote</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => handleNomeChange(e.target.value)}
                      placeholder="Ex: Pacote Pescaria VIP"
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
                  <FormLabel>Slug (URL)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="pacote-pescaria-vip" />
                  </FormControl>
                  <FormDescription>
                    Usado na URL do pacote
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Descreva o pacote com formatação rica..."
                    />
                  </FormControl>
                  <FormDescription>
                    Use a barra de ferramentas para formatar o texto, adicionar listas, links e mais
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Seção de Preços e Parcelamento */}
            <div className="rounded-lg border p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200">💰 Preços e Parcelamento</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="preco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço Total (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parcelas_quantidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Parcelas</FormLabel>
                      <Select
                        onValueChange={(val) => field.onChange(parseInt(val))}
                        defaultValue={String(field.value || 10)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                            <SelectItem key={n} value={String(n)}>{n}x</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="parcela_valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da Parcela (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Deixe vazio para calcular automaticamente"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Se vazio, será calculado: Preço ÷ Parcelas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="desconto_avista"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desconto à Vista (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          {...field}
                          value={field.value || 0}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="vagas_disponiveis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vagas Disponíveis (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Deixe vazio se não quiser mostrar"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Mostra badge de urgência quando ≤ 5 vagas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preview do Preço */}
              {form.watch('preco') > 0 && (
                <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-2">Preview do preço:</p>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {form.watch('parcelas_quantidade') || 10}x de R$ {(
                        form.watch('parcela_valor') ||
                        (form.watch('preco') / (form.watch('parcelas_quantidade') || 10))
                      ).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {form.watch('desconto_avista') > 0 && (
                        <span className="line-through mr-2">R$ {form.watch('preco').toFixed(2)}</span>
                      )}
                      <span className="font-medium">
                        R$ {(form.watch('preco') * (1 - (form.watch('desconto_avista') || 0) / 100)).toFixed(2)} à vista
                      </span>
                      {form.watch('desconto_avista') > 0 && (
                        <span className="ml-2 text-green-600">({form.watch('desconto_avista')}% off)</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duracao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: 3 dias/2 noites" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pessoas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Pessoas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (0-5)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Pacote</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pescaria">Pescaria</SelectItem>
                      <SelectItem value="expedicao">Expedição</SelectItem>
                      <SelectItem value="curso">Curso de Pesca</SelectItem>
                      <SelectItem value="passeio">Passeio Náutico</SelectItem>
                      <SelectItem value="completo">Completo</SelectItem>
                      <SelectItem value="personalizado">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="ativo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Ativo</FormLabel>
                      <FormDescription>
                        Pacote visível no site
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="popular"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Popular</FormLabel>
                      <FormDescription>
                        Badge de popular
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destaque"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Destaque</FormLabel>
                      <FormDescription>
                        Destacado na home
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="detalhes" className="space-y-6">
            <div className="space-y-4">
              <Label>Características</Label>
              <div className="flex gap-2">
                <Input
                  value={novaCaracteristica}
                  onChange={(e) => setNovaCaracteristica(e.target.value)}
                  placeholder="Ex: Guia especializado"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCaracteristica())}
                />
                <Button type="button" onClick={addCaracteristica} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {caracteristicas.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                    <span className="text-sm">{item}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCaracteristica(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Itens Inclusos</Label>
              <div className="flex gap-2">
                <Input
                  value={novoIncluso}
                  onChange={(e) => setNovoIncluso(e.target.value)}
                  placeholder="Ex: Café da manhã"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIncluso())}
                />
                <Button type="button" onClick={addIncluso} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {inclusos.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                    <span className="text-sm">{item}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIncluso(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="video_youtube"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vídeo do YouTube (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://www.youtube.com/shorts/xxxxx ou https://youtube.com/watch?v=xxxxx"
                    />
                  </FormControl>
                  <FormDescription>
                    Cole a URL do vídeo (aceita YouTube normal, Shorts e youtu.be)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview do vídeo */}
            {form.watch('video_youtube') && (
              <div className="space-y-2">
                <Label>Preview do Vídeo</Label>
                <YouTubePreview videoUrl={form.watch('video_youtube')} />
              </div>
            )}

            <Separator className="my-6" />

            {/* WhatsApp */}
            <FormField
              control={form.control}
              name="telefone_whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp para Contato (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="5538999999999 (apenas números com DDD)"
                      maxLength={13}
                    />
                  </FormControl>
                  <FormDescription>
                    Número específico para este pacote. Se deixar vazio, será usado o WhatsApp padrão do site
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-6" />

            {/* Localização */}
            <div className="space-y-4">
              <div className="rounded-lg border p-4 bg-muted/50">
                <h3 className="text-sm font-medium mb-2">Localização da Pescaria</h3>
                <p className="text-xs text-muted-foreground">
                  Adicione o endereço e coordenadas do local onde será realizada a pescaria. Isso ajudará os clientes a visualizarem a localização no mapa.
                </p>
              </div>

              {/* Helper para extrair coordenadas */}
              <CoordenadasHelper
                onCoordenadasExtraidas={(latitude, longitude) => {
                  form.setValue('latitude', latitude);
                  form.setValue('longitude', longitude);
                }}
              />

              <FormField
                control={form.control}
                name="endereco_completo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço Completo</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: Rio São Francisco, Prado - MG"
                      />
                    </FormControl>
                    <FormDescription>
                      Endereço ou descrição do local da pescaria
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="any"
                          placeholder="-17.341050"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Coordenada de latitude
                      </FormDescription>
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
                        <Input
                          {...field}
                          type="number"
                          step="any"
                          placeholder="-44.892090"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Coordenada de longitude
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="imagens">
            <ImageUploader images={images} onChange={setImages} maxImages={10} />
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4">
            <div className="rounded-lg border p-4 bg-muted/50">
              <h3 className="text-sm font-medium mb-2">Sobre o Código de Tracking</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Use este campo para adicionar códigos de rastreamento personalizados para este pacote específico.
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Facebook Pixel: Rastreie conversões e visualizações</li>
                <li>Google Analytics: Acompanhe eventos personalizados</li>
                <li>Google Tag Manager: Dispare tags específicas</li>
                <li>Scripts personalizados para rastreamento de afiliados</li>
              </ul>
            </div>

            <FormField
              control={form.control}
              name="tracking_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Tracking</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Cole aqui seu código de tracking (Facebook Pixel, Google Analytics, etc.)"
                      rows={8}
                      className="font-mono text-xs"
                    />
                  </FormControl>
                  <FormDescription>
                    Exemplo Facebook Pixel: fbq('track', 'ViewContent', {'{'}'content_name': 'Pacote VIP'{'}'});
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border p-4 bg-amber-50 dark:bg-amber-950/20">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="text-amber-600">⚠️</span> Importante
              </h4>
              <p className="text-sm text-muted-foreground">
                O código de tracking será executado automaticamente quando usuários visualizarem ou interagirem com este pacote. Certifique-se de que o código está correto para evitar problemas.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {pacote ? 'Atualizar Pacote' : 'Criar Pacote'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
