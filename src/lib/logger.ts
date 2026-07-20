import { supabase } from '@/integrations/supabase/client';

export type LogLevel = 'error' | 'warning' | 'info';
export type ErrorCategory = 
  | 'react'
  | 'api'
  | 'supabase'
  | 'navigation'
  | 'chunk'
  | 'cache'
  | 'console';

export interface LogEntry {
  level: LogLevel;
  category: ErrorCategory;
  message: string;
  details?: Record<string, unknown> | string;
  stack?: string;
  url?: string;
  user_agent?: string;
  user_id?: string;
  created_at?: string;
}

class LoggerService {
  private isDev = import.meta.env.DEV;

  /**
   * Envia log para o console local e tenta salvar na tabela `logs_frontend` no Supabase.
   */
  public async log(
    level: LogLevel,
    category: ErrorCategory,
    message: string,
    details?: Record<string, unknown> | string,
    stack?: string
  ): Promise<void> {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const user_agent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const timestamp = new Date().toISOString();

    const logEntry: LogEntry = {
      level,
      category,
      message,
      details: typeof details === 'object' ? JSON.stringify(details) : details,
      stack,
      url,
      user_agent,
      created_at: timestamp,
    };

    // Imprime no console em ambiente de dev ou erros críticos
    if (this.isDev || level === 'error') {
      const emoji = level === 'error' ? '🚨' : level === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`[Logger ${emoji} ${category.toUpperCase()}]: ${message}`, { details, stack });
    }

    // Envio assíncrono para o Supabase sem bloquear a UI
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user?.id) {
        logEntry.user_id = sessionData.session.user.id;
      }

      await supabase.from('logs_frontend' as any).insert([logEntry]);
    } catch {
      // Ignora silenciosamente se a tabela logs_frontend ainda não existir no Supabase
    }
  }

  public error(category: ErrorCategory, message: string, details?: Record<string, unknown> | string, stack?: string) {
    return this.log('error', category, message, details, stack);
  }

  public warn(category: ErrorCategory, message: string, details?: Record<string, unknown> | string) {
    return this.log('warning', category, message, details);
  }

  public info(category: ErrorCategory, message: string, details?: Record<string, unknown> | string) {
    return this.log('info', category, message, details);
  }
}

export const logger = new LoggerService();
