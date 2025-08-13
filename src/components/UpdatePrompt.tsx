import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';

interface UpdatePromptProps {
  onUpdate: () => void;
}

export const UpdatePrompt: React.FC<UpdatePromptProps> = ({ onUpdate }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleUpdate = () => {
    onUpdate();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:max-w-sm">
      <Card className="bg-blue-500 text-white shadow-lg border-blue-600">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="h-5 w-5" />
                <h3 className="font-semibold text-sm">Atualização Disponível</h3>
              </div>
              <p className="text-sm text-white/90 mb-3">
                Uma nova versão do PradoAqui está disponível
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleUpdate}
                  size="sm"
                  variant="secondary"
                  className="text-xs"
                >
                  Atualizar Agora
                </Button>
                <Button
                  onClick={handleDismiss}
                  size="sm"
                  variant="ghost"
                  className="text-xs text-white/70 hover:text-white"
                >
                  Depois
                </Button>
              </div>
            </div>
            <Button
              onClick={handleDismiss}
              size="sm"
              variant="ghost"
              className="p-1 h-auto text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};