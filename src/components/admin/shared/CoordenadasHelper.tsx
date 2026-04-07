import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { MapPin, Copy, ExternalLink } from 'lucide-react';

interface CoordenadasHelperProps {
  onCoordenadasExtraidas: (latitude: number, longitude: number) => void;
}

export const CoordenadasHelper = ({ onCoordenadasExtraidas }: CoordenadasHelperProps) => {
  const [url, setUrl] = useState('');
  const [extraindo, setExtraindo] = useState(false);

  const extrairCoordenadas = () => {
    if (!url.trim()) {
      toast.error('Cole uma URL do Google Maps primeiro');
      return;
    }

    setExtraindo(true);

    try {
      // Padrões de URL do Google Maps:
      let latitude: number | null = null;
      let longitude: number | null = null;
      // Padrão 1: Coordenadas exatas diretas da área de transferência (ex: -18.1671, -45.2380)
      const rawPattern = /^(-?\d+\.\d{4,}),\s*(-?\d+\.\d{4,})$/;
      const rawMatch = url.trim().match(rawPattern);
      
      // Padrão 2: Extrato exato do pino (!3d e !4d da URL)
      const pinPattern = /!3d(-?\d+\.\d+).*?!4d(-?\d+\.\d+)/;
      const pinMatch = url.match(pinPattern);
      
      // Padrão 3: ?q=LAT,LNG
      const qPattern = /[\?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/;
      const qMatch = url.match(qPattern);
      
      // Padrão 4: @LAT,LNG (Centro da tela - Menos preciso)
      const viewportPattern = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
      const viewportMatch = url.match(viewportPattern);
      
      // Padrão 5: Tentar capturar qualquer formato numérico com virgula no meio se for texto sujo
      const fallbackPattern = /(-?\d+\.\d{4,})[,\s]+(-?\d+\.\d{4,})/;
      const fallbackMatch = url.match(fallbackPattern);

      if (rawMatch) {
        latitude = parseFloat(rawMatch[1]);
        longitude = parseFloat(rawMatch[2]);
      } else if (pinMatch) {
        latitude = parseFloat(pinMatch[1]);
        longitude = parseFloat(pinMatch[2]);
      } else if (qMatch) {
        latitude = parseFloat(qMatch[1]);
        longitude = parseFloat(qMatch[2]);
      } else if (fallbackMatch && !url.includes('google.com')) {
        latitude = parseFloat(fallbackMatch[1]);
        longitude = parseFloat(fallbackMatch[2]);
      } else if (viewportMatch) {
        // Usa o viewport center por último, já que não é a posição exata do pino
        latitude = parseFloat(viewportMatch[1]);
        longitude = parseFloat(viewportMatch[2]);
      }

      if (latitude !== null && longitude !== null) {
        // Validar se as coordenadas fazem sentido (Brasil aproximadamente)
        if (latitude < -34 || latitude > 6 || longitude < -74 || longitude > -32) {
          toast.error('Coordenadas fora do Brasil. Verifique a URL.');
          setExtraindo(false);
          return;
        }

        onCoordenadasExtraidas(latitude, longitude);
        toast.success(`Coordenadas extraídas: ${latitude}, ${longitude}`);
        setUrl('');
      } else {
        toast.error('Não foi possível extrair coordenadas desta URL. Verifique o formato.');
      }
    } catch (error) {
      console.error('Erro ao extrair coordenadas:', error);
      toast.error('Erro ao processar a URL');
    } finally {
      setExtraindo(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      toast.success('URL colada! Clique em "Extrair Coordenadas"');
    } catch (error) {
      toast.error('Não foi possível colar do clipboard');
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Label className="text-sm font-medium">
              Extrair Coordenadas do Google Maps
            </Label>
            <p className="text-xs text-muted-foreground">
              Cole as coordenadas exatas ou o link do Google Maps para preencher automaticamente
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Ex: -18.1671, -45.2380 ou Cole a URL do Google Maps..."
              className="text-xs"
              onKeyPress={(e) => e.key === 'Enter' && extrairCoordenadas()}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePaste}
            className="flex-shrink-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={extrairCoordenadas}
            disabled={!url.trim() || extraindo}
            size="sm"
            className="flex-1"
          >
            <MapPin className="h-4 w-4 mr-2" />
            {extraindo ? 'Extraindo...' : 'Extrair Coordenadas'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open('https://www.google.com/maps', '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        <div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1">
          <p className="font-medium">Como usar:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Abra o Google Maps e encontre o local</li>
            <li>Recomendado: Clique com botão direito no pino vermelho e copie as coordenadas</li>
            <li>Ou opcionalmente, copie a URL completa do navegador</li>
            <li>Cole o valor copiado aqui e clique em Extrair</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};