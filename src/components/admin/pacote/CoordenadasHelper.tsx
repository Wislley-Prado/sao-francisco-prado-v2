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
      // 1. https://www.google.com/maps/place/.../@-17.341050,-44.892090,17z/...
      // 2. https://maps.google.com/?q=-17.341050,-44.892090
      // 3. https://www.google.com/maps/@-17.341050,-44.892090,17z
      // 4. https://goo.gl/maps/... (encurtado)

      let latitude: number | null = null;
      let longitude: number | null = null;

      // Padrão 1: URL com @
      const pattern1 = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
      const match1 = url.match(pattern1);
      
      if (match1) {
        latitude = parseFloat(match1[1]);
        longitude = parseFloat(match1[2]);
      } else {
        // Padrão 2: URL com ?q=
        const pattern2 = /\?q=(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match2 = url.match(pattern2);
        
        if (match2) {
          latitude = parseFloat(match2[1]);
          longitude = parseFloat(match2[2]);
        } else {
          // Padrão 3: Buscar qualquer par de coordenadas na URL
          const pattern3 = /(-?\d+\.\d{4,}),\s*(-?\d+\.\d{4,})/;
          const match3 = url.match(pattern3);
          
          if (match3) {
            latitude = parseFloat(match3[1]);
            longitude = parseFloat(match3[2]);
          }
        }
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
              Cole o link do Google Maps abaixo e as coordenadas serão extraídas automaticamente
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.google.com/maps/@-17.341,-44.892,17z"
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
            <li>Abra o Google Maps e encontre o local da pescaria</li>
            <li>Clique com botão direito no local e selecione as coordenadas</li>
            <li>Cole a URL completa do navegador aqui</li>
            <li>Clique em "Extrair Coordenadas"</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
