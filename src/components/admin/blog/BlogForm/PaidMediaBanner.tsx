import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, CalendarIcon } from 'lucide-react';
import { BlogImageUploader } from '../BlogImageUploader';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface PaidMediaBannerProps {
  value: {
    imagem_url?: string;
    link_anunciante?: string;
    alt_text?: string;
    data_inicio?: string;
    data_fim?: string;
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

  // Considera ativo se value não for null/undefined
  const isActive = value !== null && value !== undefined;

  if (!isActive) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => onChange({})}
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data de Início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !value?.data_inicio && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value?.data_inicio ? (
                    format(new Date(value.data_inicio), "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value?.data_inicio ? new Date(value.data_inicio) : undefined}
                  onSelect={(date) => handleChange('data_inicio', date?.toISOString() || '')}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Banner será exibido a partir desta data
            </p>
          </div>

          <div className="space-y-2">
            <Label>Data de Término</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !value?.data_fim && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value?.data_fim ? (
                    format(new Date(value.data_fim), "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value?.data_fim ? new Date(value.data_fim) : undefined}
                  onSelect={(date) => handleChange('data_fim', date?.toISOString() || '')}
                  disabled={(date) => value?.data_inicio ? date < new Date(value.data_inicio) : false}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Banner será ocultado após esta data
            </p>
          </div>
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
