import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Star, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + images.length > maxImages) {
      alert(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    const newImages: ImageFile[] = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      principal: images.length === 0 && index === 0,
      alt_text: '',
      ordem: images.length + index,
    }));

    onChange([...images, ...newImages]);
  };

  const removeImage = (id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    // Se removeu a principal, tornar a primeira como principal
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
      <div>
        <Label htmlFor="images">Imagens do Rancho *</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Faça upload de até {maxImages} imagens. Arraste para reordenar.
        </p>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('file-input')?.click()}
            disabled={images.length >= maxImages}
          >
            <Upload className="w-4 h-4 mr-2" />
            Selecionar Imagens
          </Button>
          <span className="text-sm text-muted-foreground">
            {images.length} / {maxImages}
          </span>
        </div>
        <input
          id="file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {images.length > 0 && (
        <div className="grid gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                'flex gap-4 p-4 border rounded-lg bg-card',
                draggedIndex === index && 'opacity-50'
              )}
            >
              <div className="flex items-center cursor-move">
                <GripVertical className="w-5 h-5 text-muted-foreground" />
              </div>

              <img
                src={image.url}
                alt={image.alt_text || `Imagem ${index + 1}`}
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={image.principal ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPrincipal(image.id)}
                    >
                      <Star className={cn('w-4 h-4', image.principal && 'fill-current')} />
                      {image.principal ? 'Principal' : 'Marcar como principal'}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </Button>
                </div>

                <div>
                  <Label htmlFor={`alt-${image.id}`} className="text-xs">
                    Texto alternativo
                  </Label>
                  <Input
                    id={`alt-${image.id}`}
                    placeholder="Descrição da imagem"
                    value={image.alt_text}
                    onChange={(e) => updateAltText(image.id, e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
