import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isChunkLoadError, handleChunkErrorAutoRetry } from '@/lib/globalErrorHandler';

interface Props {
  children: ReactNode;
  routeName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class RouteErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[RouteErrorBoundary - ${this.props.routeName || 'Rota'}]:`, error, errorInfo);

    if (isChunkLoadError(error)) {
      handleChunkErrorAutoRetry();
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      const isChunk = isChunkLoadError(this.state.error);

      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6 bg-slate-50/50 rounded-xl border border-slate-200 my-4">
          <div className="max-w-md w-full text-center space-y-4 bg-white p-6 rounded-xl shadow-md border border-slate-100">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-800">
                Ops! Erro ao carregar {this.props.routeName ? `"${this.props.routeName}"` : 'esta página'}
              </h2>
              <p className="text-xs text-slate-500">
                {isChunk
                  ? 'Os arquivos desta página foram atualizados. Recarregando...'
                  : 'Não foi possível carregar os dados desta seção.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <Button
                onClick={this.handleReset}
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Tentar Novamente
              </Button>

              <Button
                onClick={this.handleGoHome}
                variant="outline"
                size="sm"
                className="w-full border-slate-300 text-slate-700 flex items-center justify-center gap-2"
              >
                <Home className="h-3.5 w-3.5" />
                Voltar ao Início
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;
