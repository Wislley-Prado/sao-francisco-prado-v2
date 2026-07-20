import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isChunkLoadError, clearAppCachesAndReload, handleChunkErrorAutoRetry } from '@/lib/globalErrorHandler';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  showDetails: boolean;
  errorCode: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    showDetails: false,
    errorCode: '',
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    const timestampCode = Date.now().toString(36).toUpperCase();
    return {
      hasError: true,
      error,
      errorCode: `ERR-${timestampCode}`,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    logger.error(
      isChunkLoadError(error) ? 'chunk' : 'react',
      error.message,
      {
        componentStack: errorInfo.componentStack,
        errorCode: this.state.errorCode,
      },
      error.stack
    );

    // Se for erro de carregamento de chunk (deploy recente / 404), tenta auto-retry 1 vez
    if (isChunkLoadError(error)) {
      handleChunkErrorAutoRetry();
    }
  }

  private handleReloadSystem = () => {
    window.location.reload();
  };

  private handleClearCache = async () => {
    await clearAppCachesAndReload();
  };

  private toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  public render() {
    if (this.state.hasError) {
      const isChunk = isChunkLoadError(this.state.error);

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
          <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center space-y-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600 shadow-inner">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">
                Ocorreu um erro inesperado
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                {isChunk
                  ? 'Uma nova versão do sistema pode ter sido publicada. Atualize a página ou limpe o cache para continuar.'
                  : 'Desculpe, ocorreu uma falha ao renderizar este componente.'}
              </p>
            </div>

            {/* Código do erro */}
            {this.state.errorCode && (
              <div className="inline-block px-3 py-1 bg-slate-100 rounded-md text-xs font-mono text-slate-600 border border-slate-200">
                Código do Erro: <span className="font-semibold text-slate-800">{this.state.errorCode}</span>
              </div>
            )}

            {/* Ações principais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                onClick={this.handleReloadSystem}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar Sistema
              </Button>

              <Button
                onClick={this.handleClearCache}
                variant="outline"
                className="w-full border-slate-300 hover:bg-slate-100 text-slate-700 flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
                Limpar Cache
              </Button>
            </div>

            {/* Botão de Detalhes Técnicos */}
            <div className="pt-2">
              <button
                onClick={this.toggleDetails}
                className="text-xs text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1 mx-auto transition-colors"
              >
                {this.state.showDetails ? (
                  <>Ocultar detalhes técnicos <ChevronUp className="h-3 w-3" /></>
                ) : (
                  <>Exibir detalhes técnicos <ChevronDown className="h-3 w-3" /></>
                )}
              </button>

              {this.state.showDetails && (
                <div className="mt-4 p-3 bg-slate-900 text-slate-200 rounded-lg text-left text-xs font-mono max-h-48 overflow-auto space-y-2">
                  <p><span className="text-amber-400">Mensagem:</span> {this.state.error?.message}</p>
                  <p><span className="text-amber-400">Página:</span> {window.location.href}</p>
                  <p><span className="text-amber-400">Navegador:</span> {navigator.userAgent}</p>
                  {this.state.error?.stack && (
                    <div>
                      <span className="text-amber-400">Stack Trace:</span>
                      <pre className="mt-1 whitespace-pre-wrap text-[10px] text-slate-400">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
