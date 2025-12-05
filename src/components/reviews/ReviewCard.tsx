import { useState } from "react";
import { Star, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReviewCardProps {
  nome_usuario: string;
  nota: number;
  comentario: string;
  resposta_admin?: string;
  created_at: string;
  verificado: boolean;
  imagens?: string[] | null;
}

export const ReviewCard = ({ 
  nome_usuario, 
  nota, 
  comentario, 
  resposta_admin,
  created_at,
  verificado,
  imagens
}: ReviewCardProps) => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const validImages = imagens?.filter(Boolean) || [];

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold">{nome_usuario}</h4>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(created_at), { 
                  addSuffix: true,
                  locale: ptBR 
                })}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < nota ? "fill-yellow-400 text-yellow-400" : "text-muted"
                  }`}
                />
              ))}
            </div>
          </div>
          {!verificado && (
            <Badge variant="secondary" className="w-fit">
              Aguardando verificação
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">{comentario}</p>
          
          {validImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {validImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setLightboxImage(img)}
                  className="overflow-hidden rounded-lg border border-border hover:border-primary transition-colors"
                >
                  <img
                    src={img}
                    alt={`Foto ${index + 1} de ${nome_usuario}`}
                    className="w-16 h-16 object-cover hover:scale-105 transition-transform"
                  />
                </button>
              ))}
            </div>
          )}

          {resposta_admin && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                Resposta do Rancho
              </p>
              <p className="text-sm">{resposta_admin}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors"
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={lightboxImage}
            alt="Foto em tamanho grande"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
