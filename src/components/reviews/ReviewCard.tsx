import { useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReviewCardProps {
  nome_usuario: string;
  nota: number;
  comentario: string;
  resposta_admin?: string;
  created_at: string;
  verificado: boolean;
  imagens?: string[];
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
          
          {/* Galeria de imagens */}
          {imagens && imagens.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {imagens.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className="relative h-16 w-16 rounded-lg overflow-hidden hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <img
                    src={img}
                    alt={`Foto ${i + 1} de ${nome_usuario}`}
                    className="h-full w-full object-cover"
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

      {/* Modal para visualização de imagem */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Foto da avaliação"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
