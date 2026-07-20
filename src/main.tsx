import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from '@/components/ErrorBoundary'
import { initGlobalErrorHandlers } from '@/lib/globalErrorHandler'
import './index.css'
import './i18n'

// Inicializar captura de erros globais (window.onerror e window.onunhandledrejection)
initGlobalErrorHandlers();

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

