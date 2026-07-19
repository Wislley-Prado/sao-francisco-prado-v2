import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React ErrorBoundary:', error, errorInfo);
  }

  private handleReload = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
    } catch (e) {
      console.error('Erro ao limpar cache durante reload:', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
          <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600">
              <AlertTriangle className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-gray-900">
                Ops! Algo deu errado ao carregar a página.
              </h1>
              <p className="text-sm text-gray-600">
                Ocorreu um erro temporário durante o carregamento dos componentes. Por favor, tente recarregar a página.
              </p>
            </div>

            <div className="pt-2">
              <Button 
                onClick={this.handleReload}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Recarregar Página
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
