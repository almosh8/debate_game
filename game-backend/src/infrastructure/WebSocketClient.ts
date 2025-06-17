// src/infrastructure/WebSocketClient.ts
import { io, Socket } from 'socket.io-client';
import { IWebSocketClient } from '../application/interfaces/IWebSocketClient';
import { Logger } from '../utils/Logger';

const logger = Logger.getInstance();

export class WebSocketClient implements IWebSocketClient {
  private socket: Socket | null = null;

  constructor(private url: string) {}

  connect(): void {
    if (!this.socket) {
      this.socket = io(this.url);
      logger.info('WebSocket connected');
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      logger.info('WebSocket disconnected');
    }
  }

  joinGame(gameId: string): void {
    if (this.socket) {
      this.socket.emit('joinGame', gameId);
      logger.info(`Joined game: ${gameId}`);
    }
  }

  leaveGame(gameId: string): void {
    if (this.socket) {
      this.socket.emit('leaveGame', gameId);
      logger.info(`Left game: ${gameId}`);
    }
  }

  onGameUpdated(callback: (game: any) => void): void {
    if (this.socket) {
      this.socket.on('gameUpdated', callback);
      logger.info('Subscribed to game updates');
    }
  }

  offGameUpdated(): void {
    if (this.socket) {
      this.socket.off('gameUpdated');
      logger.info('Unsubscribed from game updates');
    }
  }

  emitGameUpdate(gameId: string, data: any): void {
    if (this.socket) {
      this.socket.emit('gameUpdate', { gameId, data });
      logger.info(`Emitted game update for game: ${gameId}`);
    }
  }
}
