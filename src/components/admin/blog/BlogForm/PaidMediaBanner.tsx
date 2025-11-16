import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, ExternalLink } from 'lucide-react';
import { BlogImageUploader } from '../BlogImageUploader';

interface PaidMediaBannerProps {
  value: {
    imagem_url?: string;
    link_anunciante?: string;
    alt_text?: string;
  } | null;
  onChange: (value: any) => void;
}

export const PaidMediaBanner = ({ value, onChange }: PaidMediaBannerProps) => {
  const handleChange = (field: string, newValue: string) => {
    onChange({
      ...value,
      [field]: newValue || undefined,
    });
  };

  const handleRemove = () => {
    onChange(null);
  };

  const isActive = value && (value.imagem_url || value.link_anunciante);

  if (!isActive) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => onChange({ imagem_url: '', link_anunciante: '', alt_text: '' })}
        className="w-full"
      >
        + Adicionar Banner de Mídia Paga
      </Button>
    );
  }

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Banner de Mídia Paga</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="text-destructive hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Imagem do Banner</Label>
          <BlogImageUploader
            value={value?.imagem_url || ''}
            onChange={(url) => handleChange('imagem_url', url)}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Link do Anunciante
          </Label>
          <Input
            type="url"
            placeholder="https://site-do-anunciante.com"
            value={value?.link_anunciante || ''}
            onChange={(e) => handleChange('link_anunciante', e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Usuários serão redirecionados para este link ao clicar no banner
          </p>
        </div>

        <div className="space-y-2">
          <Label>Texto Alternativo (SEO)</Label>
          <Input
            placeholder="Descrição da imagem para acessibilidade"
            value={value?.alt_text || ''}
            onChange={(e) => handleChange('alt_text', e.target.value)}
          />
        </div>

        {value?.imagem_url && (
          <div className="rounded border p-2 bg-muted">
            <p className="text-xs text-muted-foreground mb-2">Pré-visualização:</p>
            <img
              src={value.imagem_url}
              alt={value.alt_text || 'Banner preview'}
              className="w-full rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
};
