// src/application/interfaces/IWebSocketClient.ts
export interface IWebSocketClient {
    connect(): void;
    disconnect(): void;
    joinRoom(roomId: string): void;
    leaveRoom(roomId: string): void;
    onRoomUpdated(callback: (room: any) => void): void;
    offRoomUpdated(): void;
  }