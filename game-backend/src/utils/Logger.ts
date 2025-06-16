// src/utils/Logger.ts
import { format } from 'date-fns';

export class Logger {
  private static instance: Logger;
  private readonly logLevel: string;
  private readonly isProduction: boolean;

  private constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'debug';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: string, message: string, meta?: any): void {
    if (this.shouldLog(level)) {
      const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
      const logEntry = {
        timestamp,
        level: level.toUpperCase(),
        message,
        ...meta
      };

      if (this.isProduction) {
        console.log(JSON.stringify(logEntry));
      } else {
        // Красивое форматирование для разработки
        const color = this.getColor(level);
        console.log(
          `\x1b[90m${timestamp}\x1b[0m \x1b[${color}m${level.toUpperCase().padEnd(5)}\x1b[0m ${message}`,
          meta ? JSON.stringify(meta, null, 2) : ''
        );
      }
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['error', 'warn', 'info', 'debug', 'verbose'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private getColor(level: string): string {
    const colors: Record<string, string> = {
      error: '31', // red
      warn: '33',  // yellow
      info: '32',  // green
      debug: '36', // cyan
      verbose: '35' // magenta
    };
    return colors[level] || '37'; // default white
  }

  public error(message: string, error?: Error, meta?: any): void {
    this.log('error', message, { 
      error: error?.message,
      stack: error?.stack,
      ...meta 
    });
  }

  public warn(message: string, meta?: any): void {
    this.log('warn', message, meta);
  }

  public info(message: string, meta?: any): void {
    this.log('info', message, meta);
  }

  public debug(message: string, meta?: any): void {
    this.log('debug', message, meta);
  }

  public verbose(message: string, meta?: any): void {
    this.log('verbose', message, meta);
  }
}