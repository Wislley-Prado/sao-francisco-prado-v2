import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface PublicationSettingsProps {
  publicado: boolean;
  dataPublicacao: Date | undefined;
  onPublicadoChange: (value: boolean) => void;
  onDataPublicacaoChange: (date: Date | undefined) => void;
}

export const PublicationSettings = ({
  publicado,
  dataPublicacao,
  onPublicadoChange,
  onDataPublicacaoChange,
}: PublicationSettingsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-0.5">
          <label className="text-sm font-medium">Publicado</label>
          <p className="text-sm text-muted-foreground">
            O post estará visível no site
          </p>
        </div>
        <Switch checked={publicado} onCheckedChange={onPublicadoChange} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Data de Publicação</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !dataPublicacao && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dataPublicacao ? (
                format(dataPublicacao, 'PPP', { locale: ptBR })
              ) : (
                <span>Selecione uma data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dataPublicacao}
              onSelect={onDataPublicacaoChange}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
