// src/utils/Logger.ts
export class Logger {
  private static instance: Logger;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getCurrentTime(): string {
    const now = new Date();
    const microseconds = Math.floor(performance.now() * 1000) % 1000;
    return `${now.toISOString().slice(0, -1)}${microseconds.toString().padStart(3, '0')}Z`;
  }

  debug(message: string): void {
    console.debug(`[DEBUG] [${this.getCurrentTime()}] ${message}`);
  }

  info(message: string): void {
    console.info(`[INFO] [${this.getCurrentTime()}] ${message}`);
  }

  warn(message: string): void {
    console.warn(`[WARN] [${this.getCurrentTime()}] ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR] [${this.getCurrentTime()}] ${message}`);
  }
}