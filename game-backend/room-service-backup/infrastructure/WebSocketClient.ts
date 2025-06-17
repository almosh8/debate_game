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

  joinRoom(roomId: string): void {
    if (this.socket) {
      this.socket.emit('joinRoom', roomId);
      logger.info(`Joined room: ${roomId}`);
    }
  }

  leaveRoom(roomId: string): void {
    if (this.socket) {
      this.socket.emit('leaveRoom', roomId);
      logger.info(`Left room: ${roomId}`);
    }
  }

  onRoomUpdated(callback: (room: any) => void): void {
    if (this.socket) {
      this.socket.on('roomUpdated', callback);
      logger.info('Subscribed to room updates');
    }
  }

  offRoomUpdated(): void {
    if (this.socket) {
      this.socket.off('roomUpdated');
      logger.info('Unsubscribed from room updates');
    }
  }

  emitRoomUpdate(roomId: string, data: any): void {
    if (this.socket) {
      this.socket.emit('roomUpdate', { roomId, data });
      logger.info(`Emitted room update for room: ${roomId}`);
    }
  }
}