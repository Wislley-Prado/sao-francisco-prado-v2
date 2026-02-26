import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload, Image, Check, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FaviconUploaderProps {
  currentFaviconUrl: string;
  onFaviconUpdated: (url: string) => void;
}

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

const FaviconUploader = ({ currentFaviconUrl, onFaviconUpdated }: FaviconUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Imagem deve ter no máximo 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error('Selecione uma imagem primeiro');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
      const fileName = `favicon-${Date.now()}.${ext}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('favicons')
        .upload(fileName, file, { 
          cacheControl: '3600',
          upsert: true 
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('favicons')
        .getPublicUrl(fileName);

      const faviconUrl = urlData.publicUrl;

      // Save to site_settings
      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ favicon_url: faviconUrl } as any)
        .eq('id', SETTINGS_ID);

      if (updateError) throw updateError;

      onFaviconUpdated(faviconUrl);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      toast.success('Favicon atualizado! Recarregue o site para ver a mudança.');
    } catch (error) {
      console.error('Erro ao fazer upload do favicon:', error);
      toast.error('Erro ao fazer upload do favicon');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ favicon_url: null } as any)
        .eq('id', SETTINGS_ID);

      if (error) throw error;

      onFaviconUpdated('');
      toast.success('Favicon removido. O favicon padrão será usado.');
    } catch (error) {
      console.error('Erro ao remover favicon:', error);
      toast.error('Erro ao remover favicon');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          Favicon e Ícones PWA
        </CardTitle>
        <CardDescription>
          Altere o ícone do site que aparece na aba do navegador, na tela inicial do celular e no PWA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current favicon preview */}
        {currentFaviconUrl && (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Favicon atual</Label>
            <div className="flex items-center gap-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center">
                  <img src={currentFaviconUrl} alt="Favicon 16x16" className="w-4 h-4 mx-auto border rounded" />
                  <span className="text-[10px] text-muted-foreground">16px</span>
                </div>
                <div className="text-center">
                  <img src={currentFaviconUrl} alt="Favicon 32x32" className="w-8 h-8 mx-auto border rounded" />
                  <span className="text-[10px] text-muted-foreground">32px</span>
                </div>
                <div className="text-center">
                  <img src={currentFaviconUrl} alt="Favicon 192x192" className="w-12 h-12 mx-auto border rounded-lg" />
                  <span className="text-[10px] text-muted-foreground">192px</span>
                </div>
                <div className="text-center">
                  <img src={currentFaviconUrl} alt="Favicon 512x512" className="w-16 h-16 mx-auto border rounded-xl" />
                  <span className="text-[10px] text-muted-foreground">512px</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRemove} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-1" />
                Remover
              </Button>
            </div>
          </div>
        )}

        {/* Upload area */}
        <div className="space-y-2">
          <Label htmlFor="favicon-upload">Enviar novo favicon</Label>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              id="favicon-upload"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Escolher imagem
            </Button>
            {preview && (
              <div className="flex items-center gap-2">
                <img src={preview} alt="Preview" className="w-10 h-10 rounded border object-cover" />
                <Check className="w-4 h-4 text-green-600" />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Recomendado: imagem quadrada PNG de pelo menos 512x512px. Máximo 2MB.
          </p>
        </div>

        {/* Upload button */}
        {preview && (
          <Button onClick={handleUpload} disabled={uploading} className="flex items-center gap-2">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Salvar Favicon
              </>
            )}
          </Button>
        )}

        <Alert>
          <Image className="h-4 w-4" />
          <AlertDescription className="text-xs">
            O favicon será aplicado automaticamente em todas as páginas do site, na aba do navegador, 
            na tela inicial do celular (PWA) e nos resultados de busca. Use uma imagem quadrada para melhor resultado.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default FaviconUploader;
