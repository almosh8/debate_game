// src/application/interfaces/IWebSocketClient.ts
import { Socket } from 'socket.io-client';

export interface IWebSocketClient {
  connect(): void;
  disconnect(): void;
  joinRoom(roomId: string): void;
  leaveRoom(roomId: string): void;
  onRoomUpdated(callback: (room: any) => void): void;
  offRoomUpdated(): void;
  emitRoomUpdate(roomId: string, data: any): void;
}