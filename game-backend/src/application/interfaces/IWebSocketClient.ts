// src/application/interfaces/IWebSocketClient.ts
import { Socket } from 'socket.io-client';

export interface IWebSocketClient {
  connect(): void;
  disconnect(): void;
  joinGame(gameId: string): void;
  leaveGame(gameId: string): void;
  onGameUpdated(callback: (game: any) => void): void;
  offGameUpdated(): void;
  emitGameUpdate(gameId: string, data: any): void;
}
