import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface PacoteMapProps {
  latitude: number;
  longitude: number;
  endereco: string;
  titulo: string;
}

const PacoteMap = ({ latitude, longitude, endereco, titulo }: PacoteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  useEffect(() => {
    // Buscar token do Mapbox do localStorage ou usar um token padrão
    const token = localStorage.getItem('mapbox_token') || 'pk.eyJ1Ijoicmlvcy1maXNoaW5nIiwiYSI6ImNtMzhuZTBjZTBjNmgyanM2MG13ZmFldXkifQ.placeholder';
    setMapboxToken(token);
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    try {
      // Initialize map
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [longitude, latitude],
        zoom: 12,
        pitch: 45,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add marker
      new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat([longitude, latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<div class="text-sm"><strong>${titulo}</strong><br/>${endereco}</div>`)
        )
        .addTo(map.current);

      // Fit to bounds with padding
      map.current.fitBounds([
        [longitude - 0.05, latitude - 0.05],
        [longitude + 0.05, latitude + 0.05]
      ], {
        padding: 50,
        maxZoom: 14
      });

    } catch (error) {
      console.error('Erro ao inicializar o mapa:', error);
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, latitude, longitude, endereco, titulo]);

  if (!mapboxToken) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            Localização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Carregando mapa...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          Localização da Pescaria
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={mapContainer} className="h-[400px] w-full" />
        <div className="p-4 bg-muted/30">
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary/70" />
            <span>{endereco}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PacoteMap;
