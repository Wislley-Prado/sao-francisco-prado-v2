import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { X, Upload, Star, GripVertical, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { compressImages } from '@/utils/imageCompression';
import { toast } from 'sonner';

export interface ImageFile {
  id: string;
  file?: File;
  url: string;
  principal: boolean;
  alt_text: string;
  ordem: number;
}

interface ImageUploaderProps {
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  maxImages?: number;
}

export const ImageUploader = ({
  images,
  onChange,
  maxImages = 10,
}: ImageUploaderProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + images.length > maxImages) {
      toast.error(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/');
      if (!isValid) {
        toast.error(`${file.name} não é uma imagem válida`);
      }
      return isValid;
    });

    if (validFiles.length === 0) return;

    setIsCompressing(true);
    setCompressionProgress(0);

    try {
      const compressedFiles = await compressImages(
        validFiles,
        {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.85,
          maxSizeMB: 1,
        },
        (current, total) => {
          setCompressionProgress((current / total) * 100);
        }
      );

      const newImages: ImageFile[] = compressedFiles.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        file,
        url: URL.createObjectURL(file),
        principal: images.length === 0 && index === 0,
        alt_text: '',
        ordem: images.length + index,
      }));

      onChange([...images, ...newImages]);
      
      const totalSizeMB = compressedFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024;
      toast.success(
        `${compressedFiles.length} imagem(ns) otimizada(s) (${totalSizeMB.toFixed(2)}MB total)`
      );
    } catch (error) {
      console.error('Error compressing images:', error);
      toast.error('Erro ao processar imagens');
    } finally {
      setIsCompressing(false);
      setCompressionProgress(0);
      e.target.value = '';
    }
  };

  const removeImage = (id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    if (filtered.length > 0 && !filtered.some(img => img.principal)) {
      filtered[0].principal = true;
    }
    onChange(filtered.map((img, index) => ({ ...img, ordem: index })));
  };

  const setPrincipal = (id: string) => {
    onChange(
      images.map((img) => ({
        ...img,
        principal: img.id === id,
      }))
    );
  };

  const updateAltText = (id: string, alt_text: string) => {
    onChange(
      images.map((img) =>
        img.id === id ? { ...img, alt_text } : img
      )
    );
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    onChange(newImages.map((img, idx) => ({ ...img, ordem: idx })));
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Imagens do Pacote</Label>
        <span className="text-sm text-muted-foreground">
          {images.length} / {maxImages}
        </span>
      </div>

      {isCompressing && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              Otimizando imagens...
            </span>
          </div>
          <Progress value={compressionProgress} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              "relative group border rounded-lg p-4 space-y-3 bg-background transition-all cursor-move",
              draggedIndex === index && "opacity-50"
            )}
          >
            <div className="flex items-start gap-3">
              <GripVertical className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={image.url}
                    alt={image.alt_text || 'Preview'}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Input
                    placeholder="Texto alternativo (alt)"
                    value={image.alt_text}
                    onChange={(e) => updateAltText(image.id, e.target.value)}
                  />
                  
                  <Button
                    type="button"
                    variant={image.principal ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                    onClick={() => setPrincipal(image.id)}
                  >
                    <Star className={cn("w-4 h-4 mr-2", image.principal && "fill-current")} />
                    {image.principal ? 'Imagem Principal' : 'Definir como Principal'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length < maxImages && (
        <div>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={isCompressing}
          />
          <Label htmlFor="image-upload">
            <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-accent transition-colors">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Clique para adicionar imagens
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Suporta múltiplas imagens (PNG, JPG, WEBP)
              </p>
            </div>
          </Label>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        * As imagens serão automaticamente otimizadas e comprimidas
      </p>
    </div>
  );
};
