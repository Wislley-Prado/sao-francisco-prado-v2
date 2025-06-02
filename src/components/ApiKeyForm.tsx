
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Eye, EyeOff, ExternalLink } from 'lucide-react';

interface ApiKeyFormProps {
  onApiKeySubmit: (apiKey: string) => void;
  currentApiKey?: string;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onApiKeySubmit, currentApiKey }) => {
  const [apiKey, setApiKey] = useState(currentApiKey || '');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5 text-blue-600" />
          <span>Configurar API do OpenWeatherMap</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Configure sua chave da API para obter dados meteorológicos em tempo real
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Chave da API</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Insira sua chave da API OpenWeatherMap"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            Salvar Chave da API
          </Button>
        </form>

        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>Como obter uma chave da API:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Acesse o site do OpenWeatherMap</li>
            <li>Crie uma conta gratuita</li>
            <li>Vá para "API Keys" no seu painel</li>
            <li>Copie sua chave padrão</li>
          </ol>
          
          <a 
            href="https://openweathermap.org/api" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-xs"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Obter chave gratuita
          </a>
        </div>

        {currentApiKey && (
          <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
            ✓ Chave da API configurada e salva no navegador
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeyForm;
